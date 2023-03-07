import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  JSX,
  Listen,
  Method,
  Prop,
  State,
} from '@stencil/core';
import { hostContext } from '../../global/helpers/host-context';
import { toggleDatasetEntry } from '../../global/helpers/dataset';
import { getElementPosition, isEventOnElement } from '../../global/helpers/position';
import { assignId } from '../../global/helpers/assign-id';
import { SbbOptionSelectionChange } from '../sbb-autocomplete/sbb-autocomplete.custom';

type SbbSelectState = 'closed' | 'opening' | 'opened' | 'closing';

let nextId = 0;

@Component({
  shadow: true,
  styleUrl: 'sbb-select.scss',
  tag: 'sbb-select',
})
export class SbbSelect implements ComponentInterface {
  @Element() private _element: HTMLElement;

  /** The state of the menu. */
  @State() private _state: SbbSelectState = 'closed';

  @Prop() public inputPlaceholder: string;

  @Prop() public value: string | string[];

  @Prop() public multiple = false;

  @Prop() public disabled = false;

  @Prop() public readonly = false;

  /** Whether the animation is enabled. */
  @Prop({ reflect: true }) public disableAnimation = false;

  /**
   * @deprecated only used for React. Will probably be removed once React 19 is available.
   */
  @Event({ bubbles: true, cancelable: true }) public didChange: EventEmitter;

  @Event({ bubbles: true, cancelable: true }) public change: EventEmitter;

  /** Emits whenever the menu starts the opening transition. */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'will-open',
  })
  public willOpen: EventEmitter<void>;

  /** Emits whenever the menu is opened. */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'did-open',
  })
  public didOpen: EventEmitter<void>;

  /** Emits whenever the menu begins the closing transition. */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'will-close',
  })
  public willClose: EventEmitter<void>;

  /** Emits whenever the menu is closed. */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'did-close',
  })
  public didClose: EventEmitter<void>;

  /** Opens the selection panel. */
  @Method() public async open(): Promise<void> {
    if (this._state !== 'closed' || !this._dialog || this._options.length === 0) {
      return;
    }

    this._state = 'opening';
    this.willOpen.emit();
    this._setOverlayPosition();
    toggleDatasetEntry(this._originElement, 'selectOpen', true);
  }

  /** Closes the selection panel. */
  @Method() public async close(): Promise<void> {
    if (this._state !== 'opened') {
      return;
    }

    this._state = 'closing';
    this.willClose.emit();
    this._openPanelEventsController.abort();
  }

  /** When an option is selected, update the input value and close the autocomplete. */
  @Listen('option-did-select')
  public onOptionSelected(event: CustomEvent<SbbOptionSelectionChange>): void {
    const selectedOptionId = event.detail.id;

    // Deselect the previous options
    this._options
      .filter((option) => option.id !== selectedOptionId)
      .forEach((option) => option.deselect());

    // Set the option value
    this.value = event.detail.value;

    if (!this.multiple) {
      this.close();
      this.change.emit();
    }
  }

  private _originElement: HTMLElement;
  private _dialog: HTMLElement;
  private _optionContainer: HTMLElement;
  private _openPanelEventsController: AbortController;
  private _overlayId = `sbb-autocomplete-${++nextId}`;
  private _activeItemIndex = -1;

  public connectedCallback(): void {
    this._setupOrigin();
  }

  private get _options(): HTMLSbbOptionElement[] {
    return Array.from(this._element.querySelectorAll('sbb-option')) as HTMLSbbOptionElement[];
  }

  private _setupOrigin(): void {
    this._originElement = hostContext('sbb-form-field', this._element) as HTMLSbbFormFieldElement;
    if (this._originElement) {
      toggleDatasetEntry(this._originElement, 'selectOrigin', true);
      toggleDatasetEntry(this._originElement, 'selectOpen', false);
      toggleDatasetEntry(this._originElement, 'selectDisableAnimation', this.disableAnimation);
    }
  }

  private _setOverlayPosition(): void {
    if (!this._dialog || !this._originElement) {
      return;
    }

    // Set the width to match the trigger element
    this._element.style.setProperty('--sbb-overlay-width', `${this._originElement.offsetWidth}px`);

    // Set the origin height
    this._element.style.setProperty(
      '--sbb-overlay-origin-height',
      `${this._originElement.offsetHeight}px`
    );

    // Calculate and set the position
    const panelPosition = getElementPosition(this._optionContainer, this._originElement);

    this._element.style.setProperty('--sbb-overlay-position-x', `${panelPosition.left}px`);
    this._element.style.setProperty('--sbb-overlay-position-y', `${panelPosition.top}px`);
    this._element.style.setProperty('--sbb-overlay-max-height', panelPosition.maxHeight);
    this._element.setAttribute('data-select-position', panelPosition.alignment.vertical);
    this._originElement.setAttribute('data-select-position', panelPosition.alignment.vertical);
  }

  private _onAnimationEnd(event: AnimationEvent): void {
    if (event.animationName === 'open') {
      this._onOpenAnimationEnd();
    } else if (event.animationName === 'close') {
      this._onCloseAnimationEnd();
    }
  }

  private _onOpenAnimationEnd(): void {
    this._state = 'opened';
    this._element.setAttribute('aria-expanded', 'true');
    this._attachOpenPanelEvents();
    this.didOpen.emit();
  }

  private _onCloseAnimationEnd(): void {
    this._state = 'closed';
    this._element.setAttribute('aria-expanded', 'false');
    toggleDatasetEntry(this._originElement, 'selectOpen', false);
    this._resetActiveElement();
    this.didClose.emit();
  }

  private _attachOpenPanelEvents(): void {
    this._openPanelEventsController = new AbortController();
    document.addEventListener('scroll', () => this._setOverlayPosition(), {
      passive: true,
      signal: this._openPanelEventsController.signal,
    });
    window.addEventListener('resize', () => this._setOverlayPosition(), {
      passive: true,
      signal: this._openPanelEventsController.signal,
    });
    window.addEventListener('click', this._onBackdropClick, {
      signal: this._openPanelEventsController.signal,
    });
  }

  private _resetActiveElement(): void {
    const activeElement = this._options[this._activeItemIndex];

    if (activeElement) {
      activeElement.active = false;
    }
    this._activeItemIndex = -1;
  }

  private _onBackdropClick = (event: PointerEvent): void => {
    if (!isEventOnElement(this._dialog, event) && !isEventOnElement(this._originElement, event)) {
      this.close();
    }
  };

  public render(): JSX.Element {
    let displayValue = '';
    if (Array.isArray(this.value)) {
      displayValue = this.value.join(', ');
    } else {
      displayValue = this.value;
    }
    return (
      <Host
        role="combobox"
        aria-autocomplete="none"
        aria-haspopup="listbox"
        aria-expanded="false"
        aria-controls={this._overlayId}
        aria-owns={this._overlayId}
        data-state={this._state}
        onClick={() => this.open()}
      >
        <div>{displayValue ?? <span>{this.inputPlaceholder ?? 'Please select'}</span>}</div>
        <div class="sbb-select__backdrop">
          <div
            onAnimationEnd={(event: AnimationEvent) => this._onAnimationEnd(event)}
            class="sbb-select__panel"
            data-open={this._state === 'opened' || this._state === 'opening'}
            ref={(dialogRef) => (this._dialog = dialogRef)}
          >
            <div
              role="listbox"
              aria-multiselectable={this.multiple}
              class="sbb-select__options"
              ref={(containerRef) => {
                assignId(() => this._overlayId);
                this._optionContainer = containerRef;
              }}
            >
              <slot />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
