import { Component, ComponentInterface, h, JSX, Prop } from '@stencil/core';
import { AccessibilityProperties } from '../../global/interfaces/accessibility-properties';

/**
 * @slot unnamed - Slot to render the content.
 */
@Component({
  shadow: true,
  styleUrl: 'sbb-tooltip-trigger.scss',
  tag: 'sbb-tooltip-trigger',
})
export class SbbTooltipTrigger implements ComponentInterface, AccessibilityProperties {
  /**
   * The icon name we want to use, choose from the small icon variants
   * from the ui-icons category from here
   * https://lyne.sbb.ch/tokens/icons/.
   */
  @Prop() public iconName = 'circle-information-small';

  /** Whether the tooltip-trigger is disabled. */
  @Prop({ reflect: true }) public disabled = false;

  /** This will be forwarded as aria-label to the relevant nested element. */
  @Prop() public accessibilityLabel: string | undefined;

  public render(): JSX.Element {
    return (
      <button
        class="sbb-tooltip-trigger"
        disabled={this.disabled}
        aria-disabled={this.disabled}
        aria-label={this.accessibilityLabel}
      >
        <slot>{this.iconName && <sbb-icon name={this.iconName} />}</slot>
      </button>
    );
  }
}
