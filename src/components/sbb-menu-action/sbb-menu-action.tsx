import {
  Component,
  ComponentInterface,
  Element,
  h,
  Host,
  JSX,
  Listen,
  Prop,
  State,
} from '@stencil/core';
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
import { documentLanguage, SbbLanguageChangeEvent } from '../../global/helpers/language';

/**
 * @slot unnamed - Use this slot to provide the menu action label.
 * @slot icon - Use this slot to provide an icon. If `icon` is set, an sbb-icon will be used.
 */
@Component({
  shadow: true,
  styleUrl: 'sbb-menu-action.scss',
  tag: 'sbb-menu-action',
})
export class SbbMenuAction implements ComponentInterface, LinkButtonProperties {
  /**
   * The name of the icon, choose from the small icon variants
   * from the ui-icons category from here
   * https://lyne.sbb.ch/tokens/icons/.
   */
  @Prop() public iconName?: string | undefined;

  /** Value shown as badge at component end. */
  @Prop() public amount?: string | undefined;

  /** The href value you want to link to (if it is not present menu action becomes a button). */
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

  @State() private _currentLanguage = documentLanguage();

  @Element() private _element: HTMLElement;

  public connectedCallback(): void {
    // Forward focus call to action element
    this._element.focus = focusActionElement;
  }

  @Listen('sbbLanguageChange', { target: 'document' })
  public handleLanguageChange(event: SbbLanguageChangeEvent): void {
    this._currentLanguage = event.detail;
  }

  @Listen('click')
  public handleClick(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    } else {
      forwardHostEvent(event, this._element, actionElement(this._element));
    }
  }

  public render(): JSX.Element {
    const {
      tagName: TAG_NAME,
      hostAttributes,
      attributes,
    }: LinkButtonRenderVariables = resolveRenderVariables(this, this._currentLanguage, false);

    // See https://github.com/ionic-team/stencil/issues/2703#issuecomment-1050943715 on why form attribute is set with `setAttribute`
    return (
      <Host {...hostAttributes}>
        <TAG_NAME
          class="sbb-menu-action"
          {...attributes}
          ref={(btn) => this.form && btn?.setAttribute('form', this.form)}
        >
          <span class="sbb-menu-action__content">
            <span class="sbb-menu-action__icon">
              <slot name="icon">{this.iconName && <sbb-icon name={this.iconName} />}</slot>
            </span>
            <span class="sbb-menu-action__label">
              <slot />
            </span>
            {this.amount && !this.disabled && (
              <span class="sbb-menu-action__amount">{this.amount}</span>
            )}
          </span>
        </TAG_NAME>
      </Host>
    );
  }
}
