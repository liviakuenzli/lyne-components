import {
  Component,
  h,
  JSX,
  Prop,
  Element,
  Listen,
  ComponentInterface,
  State,
  Host,
  Watch,
} from '@stencil/core';
import { documentLanguage, SbbLanguageChangeEvent } from '../../global/helpers/language';
import { i18nTargetOpensInNewWindow } from '../../global/i18n';
import {
  actionElement,
  ButtonType,
  focusActionElement,
  forwardHostEvent,
  LinkButtonProperties,
  LinkTargetType,
  PopupType,
  resolveRenderVariables,
} from '../../global/interfaces/link-button-properties';
import { InterfaceSbbHeaderActionAttributes } from './sbb-header-action.custom';
import { isBreakpoint } from '../../global/helpers/breakpoint';
import { toggleDatasetEntry } from '../../global/helpers/dataset';
import { AgnosticResizeObserver as ResizeObserver } from '../../global/helpers/resize-observer';

/**
 * @slot icon - Slot used to render the action icon.
 * @slot unnamed - Slot used to render the action text.
 */

@Component({
  shadow: true,
  styleUrl: 'sbb-header-action.scss',
  tag: 'sbb-header-action',
})
export class SbbHeaderAction implements ComponentInterface, LinkButtonProperties {
  /**
   * Used to set the minimum breakpoint from which the text is displayed.
   * E.g. if set to 'large', the text will be visible for breakpoints large, wide, ultra,
   * and hidden for all the others.
   */
  @Prop({ reflect: true }) public expandFrom: InterfaceSbbHeaderActionAttributes['expandFrom'] =
    'medium';

  /**
   * The icon name we want to use, choose from the small icon variants
   * from the ui-icons category from here
   * https://lyne.sbb.ch/tokens/icons/.
   */
  @Prop() public iconName?: string;

  /** The href value you want to link to (if it is not present sbb-header-action becomes a button). */
  @Prop() public href: string | undefined;

  /** Where to display the linked URL. */
  @Prop() public target?: LinkTargetType | string | undefined;

  /** The relationship of the linked URL as space-separated link types. */
  @Prop() public rel?: string | undefined;

  /** Whether the browser will show the download dialog on click. */
  @Prop() public download?: boolean;

  /** Type attribute if component is displayed as a button. */
  @Prop() public type: ButtonType | undefined;

  /** Name attribute if component is displayed as a button. */
  @Prop() public name: string | undefined;

  /** The value associated with button `name` when it's submitted with the form data. */
  @Prop() public value?: string;

  /** Form attribute if component is displayed as a button. */
  @Prop() public form?: string;

  /**
   * If you use the button to trigger another widget which itself is covering
   * the page, you must provide an according attribute for aria-haspopup.
   */
  @Prop() public accessibilityHaspopup: PopupType | undefined;

  /** This will be forwarded as aria-label to the relevant nested element. */
  @Prop() public accessibilityLabel: string | undefined;

  @State() private _currentLanguage = documentLanguage();

  @Listen('sbbLanguageChange', { target: 'document' })
  public handleLanguageChange(event: SbbLanguageChangeEvent): void {
    this._currentLanguage = event.detail;
  }

  @Element() private _element: HTMLElement;

  private _documentResizeObserver = new ResizeObserver(() => this._updateExpanded());

  public connectedCallback(): void {
    // Forward focus call to action element
    this._element.focus = focusActionElement;

    this._documentResizeObserver.observe(document.documentElement);
    this._updateExpanded();
  }

  public disconnectedCallback(): void {
    this._documentResizeObserver.disconnect();
  }

  @Listen('click')
  public handleClick(event: Event): void {
    forwardHostEvent(event, this._element, actionElement(this._element));
  }

  @Watch('expandFrom')
  private _updateExpanded(): void {
    toggleDatasetEntry(this._element, 'expanded', !isBreakpoint('zero', this.expandFrom));
  }

  public render(): JSX.Element {
    const {
      tagName: TAG_NAME,
      attributes,
      hostAttributes,
      screenReaderNewWindowInfo,
    } = resolveRenderVariables(this, this._currentLanguage);
    return (
      <Host {...hostAttributes}>
        <TAG_NAME class="sbb-header-action" {...attributes}>
          <span class="sbb-header-action__wrapper">
            <span class="sbb-header-action__icon">
              <slot name="icon">{this.iconName && <sbb-icon name={this.iconName} />}</slot>
            </span>
            <span class="sbb-header-action__text">
              <slot />
              {screenReaderNewWindowInfo && (
                <span class="sbb-header-action__opens-in-new-window">
                  . {i18nTargetOpensInNewWindow[this._currentLanguage]}
                </span>
              )}
            </span>
          </span>
        </TAG_NAME>
      </Host>
    );
  }
}
