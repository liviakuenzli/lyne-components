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
  Watch,
} from '@stencil/core';
import { isBreakpoint } from '../../global/helpers/breakpoint';
import { FocusTrap, IS_FOCUSABLE_QUERY } from '../../global/helpers/focus';
import getDocumentLang from '../../global/helpers/get-document-lang';
import { AgnosticMutationObserver as MutationObserver } from '../../global/helpers/mutation-observer';
import { isEventOnElement } from '../../global/helpers/position';
import { i18nCloseNavigation } from '../../global/i18n';
import { AccessibilityProperties } from '../../global/interfaces/accessibility-properties';

/**
 * @slot unnamed - Use this to project any content inside the navigation.
 */

/** Configuration for the attribute to look at if a navigation section is displayed */
const navigationObserverConfig: MutationObserverInit = {
  subtree: true,
  attributeFilter: ['class'],
};

@Component({
  shadow: true,
  styleUrl: 'sbb-navigation.scss',
  tag: 'sbb-navigation',
})
export class SbbNavigation implements ComponentInterface, AccessibilityProperties {
  /**
   * The element that will trigger the navigation.
   * Accepts both a string (id of an element) or an HTML element.
   */
  @Prop() public trigger: string | HTMLElement;

  /**
   * This will be forwarded as aria-label to the relevant nested element.
   */
  @Prop() public accessibilityLabel: string | undefined;

  /**
   * This will be forwarded as aria-label to the close button element.
   */
  @Prop() public accessibilityCloseLabel: string | undefined;

  /**
   * Whether the animation is enabled.
   */
  @Prop({ reflect: true }) public disableAnimation = false;

  /**
   * The state of the navigation.
   */
  @State() private _state: 'closed' | 'opening' | 'opened' | 'closing' = 'closed';

  /**
   * Whether a navigation section is displayed.
   */
  @State() private _activeNavigationSection: HTMLElement;

  /**
   * Emits whenever the navigation begins the opening transition.
   */
  @Event({
    bubbles: true,
    composed: true,
  })
  public willOpen: EventEmitter<void>;

  /**
   * Emits whenever the navigation is opened.
   */
  @Event({
    bubbles: true,
    composed: true,
  })
  public didOpen: EventEmitter<void>;

  /**
   * Emits whenever the navigation begins the closing transition.
   */
  @Event({
    bubbles: true,
    composed: true,
  })
  public willClose: EventEmitter<void>;

  /**
   * Emits whenever the navigation is closed.
   */
  @Event({
    bubbles: true,
    composed: true,
  })
  public didClose: EventEmitter<void>;

  private _navigation: HTMLDialogElement;
  private _navigationWrapperElement: HTMLElement;
  private _navigationContentElement: HTMLElement;
  private _triggerElement: HTMLElement;
  private _firstFocusable: HTMLElement;
  private _navigationController: AbortController;
  private _windowEventsController: AbortController;
  private _focusTrap = new FocusTrap();
  private _openedByKeyboard = false;
  private _currentLanguage = getDocumentLang();
  private _isPointerDownEventOnDialog: boolean;
  private _navigationObserver = new MutationObserver((mutationsList: MutationRecord[]) =>
    this._onNavigationSectionChange(mutationsList)
  );

  @Element() private _element: HTMLElement;

  /**
   * Opens the navigation.
   */
  @Method()
  public async open(): Promise<void> {
    if (this._state !== 'closed' || !this._navigation) {
      return;
    }

    this.willOpen.emit();
    this._state = 'opening';
    this._navigation.show();
    this._setDialogFocus();
    // Disable scrolling for content below the dialog
    document.body.style.overflow = 'hidden';
  }

  /**
   * Closes the navigation.
   */
  @Method()
  public async close(): Promise<void> {
    if (this._state !== 'opened') {
      return;
    }

    this.willClose.emit();
    this._state = 'closing';
    this._openedByKeyboard = false;
  }

  // Removes trigger click listener on trigger change.
  @Watch('trigger')
  public removeTriggerClickListener(
    newValue: string | HTMLElement,
    oldValue: string | HTMLElement
  ): void {
    if (newValue !== oldValue) {
      this._navigationController?.abort();
      this._windowEventsController?.abort();
      this._configure(this.trigger);
    }
  }

  // Check if the trigger is valid and attach click event listeners.
  private _configure(trigger: string | HTMLElement): void {
    if (!trigger) {
      return;
    }

    // Check whether it's a string or an HTMLElement
    if (typeof trigger === 'string') {
      this._triggerElement = document.getElementById(trigger);
      // TODO: Check if window can be avoided
    } else if (trigger instanceof window.Element) {
      this._triggerElement = trigger;
    }

    if (!this._triggerElement) {
      return;
    }

    this._navigationController = new AbortController();
    this._triggerElement.addEventListener('click', () => this.open(), {
      signal: this._navigationController.signal,
    });
    this._triggerElement.addEventListener(
      'keydown',
      (event: KeyboardEvent) => {
        if (event.code === 'Enter' || event.code === 'Space') {
          this._openedByKeyboard = true;
        }
      },
      { signal: this._navigationController.signal }
    );
  }

  private _trapFocusFilter = (el: HTMLElement): boolean => {
    return (
      el.nodeName === 'SBB-NAVIGATION-SECTION' &&
      !el.classList.contains('sbb-navigation-section--opened')
    );
  };

  private _onAnimationEnd(event: AnimationEvent): void {
    if (event.animationName === 'open') {
      this._state = 'opened';
      this.didOpen.emit();
      this._focusTrap.trap(this._element, this._trapFocusFilter);
      this._attachWindowEvents();
    } else if (event.animationName === 'close') {
      this._state = 'closed';
      this._navigationContentElement.scrollTo(0, 0);
      this._navigation.close();
      this.didClose.emit();
      this._windowEventsController?.abort();
      this._focusTrap.disconnect();
      // Enable scrolling for content below the dialog
      document.body.style.overflow = 'auto';
    }
  }

  private _attachWindowEvents(): void {
    this._windowEventsController = new AbortController();
    window.addEventListener('keydown', (event: KeyboardEvent) => this._onKeydownEvent(event), {
      signal: this._windowEventsController.signal,
    });
  }

  @Listen('click')
  public handleNavigationClose(event: Event): void {
    const composedPathElements = event
      .composedPath()
      .filter((el) => el instanceof window.HTMLElement);
    if (composedPathElements.some((el) => this._isCloseElement(el as HTMLElement))) {
      this.close();
    }
  }

  private _isCloseElement(element: HTMLElement): boolean {
    return (
      element.nodeName === 'A' ||
      (element.hasAttribute('sbb-navigation-close') && !element.hasAttribute('disabled'))
    );
  }

  // Closes the navigation on "Esc" key pressed.
  private _onKeydownEvent(event: KeyboardEvent): void {
    if (this._state === 'opened' && event.key === 'Escape') {
      this.close();
    }
  }

  // Set focus on the first focusable element.
  private _setDialogFocus(): void {
    this._firstFocusable = this._element.shadowRoot.querySelector(
      IS_FOCUSABLE_QUERY
    ) as HTMLElement;

    if (this._openedByKeyboard) {
      this._firstFocusable.focus();
    } else {
      // Focusing sbb-navigation__wrapper in order to provide a consistent behavior in Safari where else
      // the focus-visible styles would be incorrectly applied
      this._navigationWrapperElement.tabIndex = 0;
      this._navigationWrapperElement.focus();

      this._navigationWrapperElement.addEventListener(
        'blur',
        () => this._navigationWrapperElement.removeAttribute('tabindex'),
        { once: true }
      );
    }
  }

  // Check if the pointerdown event target is triggered on the navigation.
  private _pointerDownListener = (event: PointerEvent): void => {
    this._isPointerDownEventOnDialog =
      isEventOnElement(this._navigation, event) ||
      isEventOnElement(
        this._element
          .querySelector('.sbb-navigation-section--opened')
          ?.shadowRoot.querySelector('dialog') as HTMLElement,
        event
      );
  };

  // Close navigation on backdrop click.
  private _closeOnBackdropClick = (event: PointerEvent): void => {
    if (!this._isPointerDownEventOnDialog && !isEventOnElement(this._navigation, event)) {
      this.close();
    }
  };

  // Observe changes on navigation section class list.
  private _onNavigationSectionChange(mutationsList: MutationRecord[]): void {
    for (const mutation of mutationsList) {
      if ((mutation.target as HTMLElement).nodeName === 'SBB-NAVIGATION-SECTION') {
        this._activeNavigationSection = this._element.querySelector(
          '.sbb-navigation-section--opening, .sbb-navigation-section--opened'
        );
        if (!isBreakpoint('zero', 'large')) {
          (
            this._activeNavigationSection?.querySelector(IS_FOCUSABLE_QUERY) as HTMLElement
          )?.focus();
        }
      }
    }
  }

  public connectedCallback(): void {
    // Validate trigger element and attach event listeners
    this._configure(this.trigger);

    // Close navigation on backdrop click
    this._element.addEventListener('pointerdown', this._pointerDownListener, {
      signal: this._navigationController.signal,
    });
    this._element.addEventListener('pointerup', this._closeOnBackdropClick, {
      signal: this._navigationController.signal,
    });

    this._navigationObserver.observe(this._element, navigationObserverConfig);
  }

  public disconnectedCallback(): void {
    this._navigationController?.abort();
    this._windowEventsController?.abort();
    this._focusTrap.disconnect();
    this._navigationObserver.disconnect();
  }

  public render(): JSX.Element {
    const closeButton = (
      <sbb-button
        class="sbb-navigation__close"
        accessibility-label={
          this.accessibilityCloseLabel || i18nCloseNavigation[this._currentLanguage]
        }
        aria-controls="sbb-navigation-dialog-id"
        variant="transparent"
        negative={true}
        size="m"
        type="button"
        icon-name="cross-small"
        sbb-navigation-close
      ></sbb-button>
    );
    return (
      <Host
        role="navigation"
        class={{
          'sbb-navigation--opened': this._state === 'opened',
          'sbb-navigation--opening': this._state === 'opening',
          'sbb-navigation--closing': this._state === 'closing',
          'sbb-navigation--has-navigation-section': !!this._activeNavigationSection,
        }}
      >
        <div class="sbb-navigation__container">
          <dialog
            ref={(navigationRef) => (this._navigation = navigationRef)}
            id="sbb-navigation-dialog-id"
            aria-label={this.accessibilityLabel}
            onAnimationEnd={(event: AnimationEvent) => this._onAnimationEnd(event)}
            class="sbb-navigation"
          >
            <div class="sbb-navigation__header">{closeButton}</div>
            <div
              ref={(navigationWrapperRef) =>
                (this._navigationWrapperElement = navigationWrapperRef)
              }
              class="sbb-navigation__wrapper"
            >
              <div
                class="sbb-navigation__content"
                ref={(navigationContent) => (this._navigationContentElement = navigationContent)}
              >
                <slot />
              </div>
            </div>
          </dialog>
          <slot name="navigation-section" />
        </div>
      </Host>
    );
  }
}