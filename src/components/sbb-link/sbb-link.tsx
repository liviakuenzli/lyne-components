import { Component, ComponentInterface, Element, h, JSX, Listen, Prop, State } from '@stencil/core';
import {
  actionElement,
  ButtonType,
  focusActionElement,
  forwardHostEvent,
  LinkButtonProperties,
  LinkButtonRenderVariables,
  LinkTargetType,
  PopupType,
  resolveRenderVariables,
} from '../../global/interfaces/link-button-properties';
import { InterfaceLinkAttributes } from './sbb-link.custom';
import { ACTION_ELEMENTS, hostContext } from '../../global/helpers/host-context';
import { i18nTargetOpensInNewWindow } from '../../global/i18n';
import { documentLanguage, SbbLanguageChangeEvent } from '../../global/helpers/language';
import {
  createNamedSlotState,
  queryAndObserveNamedSlotState,
  queryNamedSlotState,
} from '../../global/helpers/observe-named-slot-changes';

/**
 * @slot unnamed - Link Content
 * @slot icon - Slot used to display the icon, if one is set
 */
@Component({
  shadow: true,
  styleUrl: 'sbb-link.scss',
  tag: 'sbb-link',
})
export class SbbLink implements ComponentInterface, LinkButtonProperties {
  /** Variant of the link (block or inline). */
  @Prop({ reflect: true }) public variant: InterfaceLinkAttributes['variant'] = 'block';

  /** Negative coloring variant flag. */
  @Prop({ reflect: true }) public negative = false;

  /**
   * Text size, the link should get in the non-button variation.
   * With inline variant, the text size adapts to where it is used.
   */
  @Prop({ reflect: true }) public size: InterfaceLinkAttributes['size'] = 's';

  /**
   * Set this property to true if you want only a visual representation of a
   * link, but no interaction (a span instead of a link/button will be rendered).
   */
  @Prop({ attribute: 'static', mutable: true, reflect: true }) public isStatic = false;

  /**
   * The icon name we want to use, choose from the small icon variants
   * from the ui-icons category from here
   * https://lyne.sbb.ch/tokens/icons/.
   * Inline variant doesn't support icons.
   */
  @Prop() public iconName?: string;

  /** Moves the icon to the end of the component if set to true. */
  @Prop() public iconPlacement?: InterfaceLinkAttributes['iconPlacement'] = 'start';

  /** The href value you want to link to (if it is not present link becomes a button). */
  @Prop() public href: string | undefined;

  /** Where to display the linked URL. */
  @Prop() public target?: LinkTargetType | string | undefined;

  /** The relationship of the linked URL as space-separated link types. */
  @Prop() public rel?: string | undefined;

  /** Whether the browser will show the download dialog on click. */
  @Prop() public download?: boolean;

  /** The type attribute to use for the button. */
  @Prop() public type: ButtonType | undefined;

  /** Whether the button is disabled. */
  @Prop({ reflect: true }) public disabled = false;

  /** The name attribute to use for the button. */
  @Prop() public name: string | undefined;

  /** The value attribute to use for the button. */
  @Prop() public value?: string;

  /** The <form> element to associate the button with. */
  @Prop() public form?: string;

  /**
   * If you use the button to trigger another widget which itself is covering
   * the page, you must provide an according attribute for aria-haspopup.
   */
  @Prop() public accessibilityHaspopup: PopupType | undefined;

  /** This will be forwarded as aria-label to the relevant nested element. */
  @Prop() public accessibilityLabel: string | undefined;

  /** State of listed named slots, by indicating whether any element for a named slot is defined. */
  @State() private _namedSlots = createNamedSlotState('icon');

  @State() private _currentLanguage = documentLanguage();

  @Element() private _element!: HTMLElement;

  private _closestForm: HTMLFormElement | null;

  public connectedCallback(): void {
    // Check if the current element is nested in an action element.
    this.isStatic = this.isStatic || !!hostContext(ACTION_ELEMENTS, this._element);
    // Check if the current element is nested in a form.
    this._closestForm = hostContext('form', this._element) as HTMLFormElement;
    this._namedSlots = queryAndObserveNamedSlotState(this._element, this._namedSlots);

    // Forward focus call to action element
    this._element.focus = focusActionElement;
  }

  @Listen('sbbLanguageChange', { target: 'document' })
  public handleLanguageChange(event: SbbLanguageChangeEvent): void {
    this._currentLanguage = event.detail;
  }

  /**
   * Method triggered on button click to emit the click event (can be caught from parent component).
   */
  public emitButtonClick(): void {
    if (this.disabled || this.isStatic) {
      return;
    }

    if (!this._closestForm || this.type !== 'submit') {
      return;
    }

    if (this._closestForm.requestSubmit) {
      this._closestForm.requestSubmit();
    } else {
      this._closestForm.submit();
    }
  }

  @Listen('click')
  public handleClick(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    } else if (!this.isStatic) {
      forwardHostEvent(event, this._element, actionElement(this._element));
    }
  }

  @Listen('sbbNamedSlotChange', { passive: true })
  public handleSlotNameChange(event: CustomEvent<Set<string>>): void {
    this._namedSlots = queryNamedSlotState(this._element, this._namedSlots, event.detail);
  }

  public render(): JSX.Element {
    const {
      tagName: TAG_NAME,
      attributes,
      screenReaderNewWindowInfo,
    }: LinkButtonRenderVariables = resolveRenderVariables(
      this,
      this._currentLanguage,
      this.isStatic
    );

    // See https://github.com/ionic-team/stencil/issues/2703#issuecomment-1050943715 on why form attribute is set with `setAttribute`
    return (
      <TAG_NAME
        class="sbb-link"
        {...attributes}
        ref={(btn) => this.form && btn?.setAttribute('form', this.form)}
      >
        {this.variant !== 'inline' && (this.iconName || this._namedSlots.icon) && (
          <span class="sbb-link__icon">
            <slot name="icon">{this.iconName && <sbb-icon name={this.iconName} />}</slot>
          </span>
        )}
        <slot />
        {screenReaderNewWindowInfo && (
          <span class="sbb-link__opens-in-new-window">
            . {i18nTargetOpensInNewWindow[this._currentLanguage]}
          </span>
        )}
      </TAG_NAME>
    );
  }
}
