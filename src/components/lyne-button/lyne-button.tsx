import {
  Component,
  Element,
  h,
  Prop
} from '@stencil/core';
import events from './lyne-button.events';
import { InterfaceButtonAttributes } from './lyne-button.custom.d';

/**
 * @slot unnamed - Slot to render svg icon. You must pass an svg-element.
 */

@Component({
  shadow: true,
  styleUrl: 'lyne-button.scss',
  tag: 'lyne-button'
})

export class LyneButton {

  /** Label text to show on the button */
  @Prop() public label? = 'Default button text';

  /** Variant of the button, like primary, secondary etc. */
  @Prop() public variant?: InterfaceButtonAttributes['variant'] = 'primary';

  /** Size variant, either large or small. */
  @Prop() public size?: InterfaceButtonAttributes['size'] = 'large';

  /**
   * Set this property to true if you want only a visual represenation of a
   * button, but no interaction (a div instead of a button will be rendered).
   */
  @Prop() public visualButtonOnly?: boolean;

  /** Set to true to get a disabled button */
  @Prop() public disabled? = false;

  /** Id which is sent in the click event payload */
  @Prop() public eventId?: string;

  /** Define if icon should be shown or not */
  @Prop() public icon? = false;

  /** If you use an icon without a label, you must provide an iconDescription */
  @Prop() public iconDescription?: string;

  /** The type attribute to use for the button */
  @Prop() public type?: InterfaceButtonAttributes['type'] = 'button';

  /** The name attribute to use for the button */
  @Prop() public name?: string;

  /** The value attribute to use for the button */
  @Prop() public value?: string;

  /**
   * If you use the button to trigger another widget which itself is covering
   * the page, you must provide an according attribute for aria-haspopup.
   */
  @Prop() public ariaHaspopup?: InterfaceButtonAttributes['popup'];

  @Element() private _element: HTMLElement;

  private _buttonClick = (): void => {
    let eventDetail;

    if (this.visualButtonOnly) {
      return;
    }

    if (this.eventId) {
      eventDetail = this.eventId;
    }

    const event = new CustomEvent(events.click, {
      bubbles: true,
      composed: true,
      detail: eventDetail
    });

    this._element.dispatchEvent(event);
  };

  public render(): JSX.Element {
    const hasNoLabel = !this.label || this.label.length < 1;

    // security exit, if neither label nor icon is provided via props
    if (hasNoLabel && !this.icon) {
      return <p>Config error: either label or icon must be provided</p>;
    }

    // security exit for icon only button with no icon description
    if (hasNoLabel && this.icon && !this.iconDescription) {
      return <p>Config error: you must provide an icon description</p>;
    }

    const sizeClass = `button--${this.size}`;
    const variantClass = `button--${this.variant}`;
    const iconClass = hasNoLabel
      ? 'button--icon-only'
      : '';
    const semanticClass = this.visualButtonOnly
      ? 'button--visual-only'
      : '';

    const buttonClass = `button ${variantClass} ${sizeClass} ${iconClass} ${semanticClass}`;

    const TAGNAME = this.visualButtonOnly
      ? 'div'
      : 'button';

    const mainAttributes = {
      class: buttonClass
    };

    const buttonAttributes = {
      ...mainAttributes,
      'aria-haspopup': this.ariaHaspopup,
      'disabled': this.disabled,
      'name': this.name,
      'onClick': this._buttonClick,
      'type': this.type,
      'value': this.value
    };

    const finalAttributes = this.visualButtonOnly
      ? mainAttributes
      : buttonAttributes;

    return (
      <TAGNAME {...finalAttributes}>

        {this.icon && hasNoLabel && this.iconDescription
          ? <span class='button__icon-description'>{this.iconDescription}</span>
          : ''
        }

        {this.icon === true
          ? <span class='button__icon'><slot /></span>
          : ''
        }

        {hasNoLabel
          ? ''
          : <span class='button__label'>{this.label}</span>
        }

      </TAGNAME>
    );
  }
}