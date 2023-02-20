import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  JSX,
  Method,
  Prop,
  State,
  Watch,
} from '@stencil/core';
import { getNextElementIndex } from '../../global/helpers/arrow-navigation';
import { assignId } from '../../global/helpers/assign-id';
import { hostContext } from '../../global/helpers/host-context';
import {
  removeAriaOverlayTriggerAttributes,
  setAriaOverlayTriggerAttributes,
} from '../../global/helpers/overlay-trigger-attributes';
import { getElementPosition, isEventOnElement } from '../../global/helpers/position';

type SbbAutocompleteState = 'closed' | 'opening' | 'opened' | 'closing';

let nextId = 0;

/**
 * @slot unnamed - Use this to document a slot.
 */
@Component({
  shadow: true,
  styleUrl: 'sbb-autocomplete.scss',
  tag: 'sbb-autocomplete',
})
export class SbbAutocomplete implements ComponentInterface {
  /**
   * The element where the autocomplete will attach.
   * Accepts both a string (id of an element) or an HTML element.
   *
   * If not setted, will search for the first 'sbb-form-field' ancestor
   */
  @Prop() public origin: string | HTMLElement;

  /**
   * The element that will trigger the autocomplete opening.
   * Accepts both a string (id of an element) or an HTML element.
   * By default, the autocomplete will open on focus of the 'trigger' element.
   *
   * If not setted, will search for the first 'input' child of 'origin'
   */
  @Prop() public trigger: string | HTMLElement;

  /**
   * The state of the menu.
   */
  @State() private _state: SbbAutocompleteState = 'closed';

  /**
   * Emits whenever the menu starts the opening transition.
   */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'will-open',
  })
  public willOpen: EventEmitter<void>;

  /**
   * Emits whenever the menu is opened.
   */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'did-open',
  })
  public didOpen: EventEmitter<void>;

  /**
   * Emits whenever the menu begins the closing transition.
   */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'will-close',
  })
  public willClose: EventEmitter<void>;

  /**
   * Emits whenever the menu is closed.
   */
  @Event({
    bubbles: true,
    composed: true,
    eventName: 'did-close',
  })
  public didClose: EventEmitter<void>;

  @Element() private _element!: HTMLElement;

  private _dialog: HTMLElement;
  private _originElement: HTMLElement;
  private _triggerElement: HTMLElement;
  private _triggerEventsController: AbortController;
  private _windowEventsController: AbortController;
  private _overlayId = `sbb-autocomplete-${++nextId}`;
  private _activeItemIndex = -1;

  private get _options(): HTMLSbbOptionElement[] {
    return Array.from(this._element.querySelectorAll('sbb-option')) as HTMLSbbOptionElement[];
  }

  /**
   * Opens the autocomplete.
   */
  @Method()
  public async open(): Promise<void> {
    console.log('Open autocomplete');
    if (this._state !== 'closed' || !this._dialog || this._options.length === 0) {
      return;
    }

    this.willOpen.emit();
    this._setOverlayPosition();
    this._state = 'opened';
    this._attachWindowEvents();
    this._triggerElement?.setAttribute('aria-expanded', 'true');
    this._originElement?.setAttribute('data-autocomplete-open', 'true');
    this.didOpen.emit(); // TODO should be emitted on animation end
  }

  /**
   * Closes the autocomplete.
   */
  @Method()
  public async close(): Promise<void> {
    console.log('Close autocomplete');
    if (this._state !== 'opened') {
      return;
    }

    this.willClose.emit();
    this._windowEventsController.abort();
    this._state = 'closed';
    this._triggerElement?.setAttribute('aria-expanded', 'false');
    this._originElement?.setAttribute('data-autocomplete-open', 'false');
    this._resetActiveElement();
    this.didClose.emit(); // TODO should be emitted on animation end
  }

  // Removes trigger click listener on trigger change.
  @Watch('origin')
  public removeTriggerClickListener(
    newValue: string | HTMLElement,
    oldValue: string | HTMLElement
  ): void {
    if (newValue !== oldValue) {
      this._setUp();
    }
  }

  public connectedCallback(): void {
    this._setUp();
  }

  public disconnectedCallback(): void {
    this._windowEventsController.abort();
  }

  private _setUp(): void {
    this._triggerEventsController?.abort();
    this._windowEventsController?.abort();

    this._attachTo(this._getOriginElement());
    this._bindTo(this._getTriggerElement());
  }

  /**
   * Retrieve the element where the autocomplete will be attached
   * @returns 'anchor' or the first 'sbb-form-field' ancestor
   */
  private _getOriginElement(): HTMLElement {
    if (!this.origin) {
      return hostContext('sbb-form-field', this._element) as HTMLSbbFormFieldElement;
    }

    return typeof this.origin === 'string' ? document.getElementById(this.origin) : this.origin;
  }

  /**
   * Retrieve the element that will trigger the autocomplete opening
   * @returns 'trigger' or the first 'input' inside the origin element
   */
  private _getTriggerElement(): HTMLElement {
    if (!this.trigger) {
      return this._originElement?.querySelector('input') as HTMLInputElement;
    }

    return typeof this.trigger === 'string' ? document.getElementById(this.trigger) : this.trigger;
  }

  private _attachTo(anchorElem: HTMLElement): void {
    if (!anchorElem) {
      return;
    }
    this._originElement = anchorElem;
    this._originElement.setAttribute('data-autocomplete-origin', 'true');
    // Set position attribute
    this._originElement.setAttribute('data-autocomplete-open', 'false');
  }

  private _bindTo(triggerElem: HTMLElement): void {
    if (!triggerElem) {
      return;
    }

    // Reset aria attributes to the old trigger and add them to the new one
    this._removeAriaAttributes(this._triggerElement);
    this._setAriaAttributes(triggerElem);

    this._triggerElement = triggerElem;

    this._triggerEventsController = new AbortController();
    this._triggerElement.addEventListener('focus', () => this.open(), {
      signal: this._triggerEventsController.signal,
    });
  }

  private _setAriaAttributes(element: HTMLElement): void {
    setAriaOverlayTriggerAttributes(
      element,
      'listbox',
      this._element.id || this._overlayId,
      this._state
    );
    element?.setAttribute('role', 'combobox');
    element?.setAttribute('aria-autocomplete', 'list');
    element?.setAttribute('autocomplete', 'off');
  }

  private _removeAriaAttributes(element: HTMLElement): void {
    removeAriaOverlayTriggerAttributes(element);
    element?.removeAttribute('role');
    element?.removeAttribute('aria-autocomplete');
    element?.removeAttribute('autocomplete');
  }

  // Set overlay position, width and max height
  private _setOverlayPosition(): void {
    if (!this._dialog || !this._originElement) {
      return;
    }

    // Set the width to match the trigger element
    this._element.style.setProperty('--sbb-overlay-width', `${this._originElement.offsetWidth}px`);

    // Calculate and set the position
    const panelPosition = getElementPosition(this._dialog, this._originElement);

    this._element.style.setProperty('--sbb-overlay-position-x', `${panelPosition.left}px`);
    this._element.style.setProperty('--sbb-overlay-position-y', `${panelPosition.top}px`);
    this._element.style.setProperty('--sbb-overlay-max-height', panelPosition.maxHeight);
    this._originElement.setAttribute(
      'data-autocomplete-position',
      panelPosition.alignment.vertical
    );
  }

  private _attachWindowEvents(): void {
    this._windowEventsController = new AbortController();
    document.addEventListener('scroll', () => this._setOverlayPosition(), {
      passive: true,
      signal: this._windowEventsController.signal,
    });
    window.addEventListener('resize', () => this._setOverlayPosition(), {
      passive: true,
      signal: this._windowEventsController.signal,
    });

    window.addEventListener('click', this._onBackdropClick, {
      signal: this._windowEventsController.signal,
    });

    window.addEventListener('keydown', (event: KeyboardEvent) => this._onKeydownEvent(event), {
      signal: this._windowEventsController.signal,
    });
  }

  // Closes the menu on "Esc" key pressed and traps focus within the menu.
  private _onKeydownEvent(event: KeyboardEvent): void {
    if (this._state !== 'opened') {
      return;
    }

    if (event.key === 'Escape') {
      this.close();
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      this._setNextActiveOption(event);
    }
  }

  private _onBackdropClick = (event: PointerEvent): void => {
    if (!isEventOnElement(this._dialog, event) && !isEventOnElement(this._triggerElement, event)) {
      //TODO shoul be trigger or origin?
      this.close();
    }
  };

  private _setNextActiveOption(event: KeyboardEvent): void {
    const options: HTMLSbbOptionElement[] = this._options;

    const last = this._activeItemIndex;
    const lastActiveOption = options[last];
    const next = getNextElementIndex(event, this._activeItemIndex, options.length);
    const nextActiveOption = options[next];

    nextActiveOption.active = true;
    this._triggerElement.setAttribute('aria-activedescendant', nextActiveOption.id);

    if (lastActiveOption) {
      lastActiveOption.active = false;
    }

    this._activeItemIndex = next;
  }

  private _resetActiveElement(): void {
    const activeElement = this._options[this._activeItemIndex];

    if (activeElement) {
      activeElement.active = false;
    }
    this._activeItemIndex = -1;
  }

  public render(): JSX.Element {
    return (
      <Host data-state={this._state} ref={assignId(() => this._overlayId)}>
        <div class="sbb-autocomplete__container">
          <div
            class="sbb-autocomplete__panel"
            data-open={this._state === 'opened' || this._state === 'opening'}
            ref={(dialogRef) => (this._dialog = dialogRef)}
          >
            <div>
              {' '}
              {/* TODO This div might not be necessary */}
              <slot />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
