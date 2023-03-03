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
import { documentLanguage, SbbLanguageChangeEvent } from '../../global/helpers/language';
import { i18nTargetOpensInNewWindow } from '../../global/i18n';
import {
  ButtonType,
  dispatchClickEventWhenButtonAndSpaceKeyup,
  dispatchClickEventWhenEnterKeypress,
  handleLinkButtonClick,
  LinkButtonProperties,
  LinkButtonRenderVariables,
  LinkTargetType,
  resolveRenderVariables,
} from '../../global/interfaces/link-button-properties';
import { InterfaceSbbCardAttributes } from './sbb-card.custom';
import {
  createNamedSlotState,
  queryAndObserveNamedSlotState,
  queryNamedSlotState,
} from '../../global/helpers/observe-named-slot-changes';

/**
 * @slot unnamed - Slot to render the content.
 * @slot badge - Slot to render `<sbb-card-badge>`.
 */
@Component({
  shadow: true,
  styleUrl: 'sbb-card.scss',
  tag: 'sbb-card',
})
export class SbbCard implements ComponentInterface, LinkButtonProperties {
  /** Size variant, either xs, s, m, l, xl or xxl. */
  @Prop({ reflect: true }) public size?: InterfaceSbbCardAttributes['size'] = 'm';

  /** Option to set the component's background color. */
  @Prop({ reflect: true }) public color: InterfaceSbbCardAttributes['color'] = 'white';

  /** Used to set the component's active state. */
  @Prop({ reflect: true }) public active = false;

  /** The href value you want to link to. */
  @Prop({ reflect: true }) public href: string | undefined;

  /** Where to display the linked URL. */
  @Prop() public target?: LinkTargetType | string | undefined;

  /** The relationship of the linked URL as space-separated link types. */
  @Prop() public rel?: string | undefined;

  /** Whether the browser will show the download dialog on click. */
  @Prop() public download?: boolean | undefined;

  /** Default behaviour of the button. */
  @Prop() public type: ButtonType | undefined;

  /** The name of the button. */
  @Prop() public name: string | undefined;

  /** The <form> element to associate the button with. */
  @Prop() public form?: string | undefined;

  /** The value associated with button `name` when it's submitted with the form data. */
  @Prop() public value?: string | undefined;

  @State() private _currentLanguage = documentLanguage();

  @Element() private _element!: HTMLElement;

  /**
   * State of listed named slots, by indicating whether any element for a named slot is defined.
   */
  @State() private _namedSlots = createNamedSlotState('badge');

  @Listen('sbbNamedSlotChange', { passive: true })
  public handleNamedSlotChange(event: CustomEvent<Set<string>>): void {
    this._namedSlots = queryNamedSlotState(this._element, this._namedSlots, event.detail);
  }

  public connectedCallback(): void {
    this._namedSlots = queryAndObserveNamedSlotState(this._element, this._namedSlots);
  }

  @Listen('sbbLanguageChange', { target: 'document' })
  public handleLanguageChange(event: SbbLanguageChangeEvent): void {
    this._currentLanguage = event.detail;
  }

  @Listen('click')
  public handleClick(event: Event): void {
    handleLinkButtonClick(event);
  }

  @Listen('keypress')
  public handleKeypress(event: KeyboardEvent): void {
    dispatchClickEventWhenEnterKeypress(event);
  }

  @Listen('keyup')
  public handleKeyup(event: KeyboardEvent): void {
    dispatchClickEventWhenButtonAndSpaceKeyup(event);
  }

  /**
   * It is used internally to show the `<sbb-card-badge>`.
   *
   * @returns True whether size is equal to m, l, xl or xxl.
   */
  private _hasBadge(): boolean {
    return (
      this._namedSlots['badge'] &&
      (this.size === 'm' || this.size === 'l' || this.size === 'xl' || this.size === 'xxl')
    );
  }

  public render(): JSX.Element {
    const {
      tagName: TAG_NAME,
      attributes,
      hostAttributes,
      screenReaderNewWindowInfo,
    }: LinkButtonRenderVariables = resolveRenderVariables(this);
    if (this._hasBadge()) {
      hostAttributes['data-has-badge'] = '';
    }

    return (
      <Host {...hostAttributes}>
        <TAG_NAME class="sbb-card" {...attributes}>
          {this._hasBadge() && <slot name="badge" />}
          <span class="sbb-card__wrapper">
            <slot />
          </span>
          {screenReaderNewWindowInfo && (
            <span class="sbb-card__opens-in-new-window">
              . {i18nTargetOpensInNewWindow[this._currentLanguage]}
            </span>
          )}
        </TAG_NAME>
      </Host>
    );
  }
}
