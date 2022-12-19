import { Component, ComponentInterface, h, JSX, Prop } from '@stencil/core';
import { NativeDateAdapter } from '../../global/helpers/native-date-adapter';

@Component({
  shadow: true,
  styleUrl: 'sbb-calendar.scss',
  tag: 'sbb-calendar',
})
export class SbbCalendar implements ComponentInterface {
  /** If set to true, two months are displayed */
  @Prop() public wide = false;

  /** The minimum valid date. */
  @Prop() public min: Date;

  /** The maximum valid date. */
  @Prop() public max: Date;

  /** A function used to filter out dates. */
  @Prop() public dateFilter: (date: Date | null) => boolean;

  /** The selected date. */
  @Prop() public selectedDate: Date;

  /**  */
  @Prop() public startAt: Date;

  /** Date adapter. */
  private _nativeDateAdapter: NativeDateAdapter;

  /** The currently active date. */
  private _activeDate: Date;

  /** The selected date. */
  private _selectedDate: Date;

  /***/
  private _startAt: Date;

  /***/
  private _minDate: Date;

  /***/
  private _maxDate: Date;

  /** The name of the displayed month. */
  private _monthLabel: string;

  public connectedCallback(): void {
    this._nativeDateAdapter = new NativeDateAdapter();
    this._init();
  }

  /** Initialize the component. */
  private _init(): void {
    this._setDates();
    this._setMonthLabel();
  }

  /** Sets the date variables. */
  private _setDates(): void {
    this._startAt = this._nativeDateAdapter.getValidDateOrNull(
      this._nativeDateAdapter.deserialize(this.startAt)
    );
    this._minDate = this._nativeDateAdapter.getValidDateOrNull(
      this._nativeDateAdapter.deserialize(this.min)
    );
    this._maxDate = this._nativeDateAdapter.getValidDateOrNull(
      this._nativeDateAdapter.deserialize(this.max)
    );
    this._activeDate = this._nativeDateAdapter.clampDate(
      this._startAt || this._nativeDateAdapter.today(),
      this._minDate,
      this._maxDate
    );
    this._selectedDate = this._nativeDateAdapter.getValidDateOrNull(
      this._nativeDateAdapter.deserialize(this.selectedDate)
    );
  }

  /** Sets the label for the displayed month. */
  private _setMonthLabel(): void {
    this._monthLabel =
      this._nativeDateAdapter.getMonthNames('long')[
        this._nativeDateAdapter.getMonth(this._activeDate)
      ];
  }

  public render(): JSX.Element {
    return (
      <div class="sbb-calendar__wrapper">
        <div class="sbb-calendar__controls">
          <sbb-button variant="secondary" iconName="chevron-left-small"></sbb-button>
          <span class="sbb-calendar__controls-month">{this._monthLabel}</span>
          <sbb-button variant="secondary" iconName="chevron-right-small"></sbb-button>
        </div>
        <sbb-calendar-month
          selectedDate={this._selectedDate}
          activeDate={this._activeDate}
          dateFilter={this.dateFilter}
          minDate={this._minDate}
          maxDate={this._maxDate}
        ></sbb-calendar-month>
      </div>
    );
  }
}
