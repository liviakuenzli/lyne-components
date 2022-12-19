import { Component, ComponentInterface, Event, EventEmitter, h, JSX, Prop } from '@stencil/core';
import { NativeDateAdapter } from '../../global/helpers/native-date-adapter';

/**
 * @slot unnamed - Use this to document a slot.
 */
@Component({
  shadow: true,
  styleUrl: 'sbb-calendar-month.scss',
  tag: 'sbb-calendar-month',
})
export class SbbCalendarMonth implements ComponentInterface {
  /** The currently active date. */
  @Prop() public activeDate: Date;

  /** The selected date. */
  @Prop() public selectedDate: Date;

  /** The minimum valid date. */
  @Prop() public minDate: Date;

  /** The maximum valid date. */
  @Prop() public maxDate: Date;

  /** A function used to filter out dates. */
  @Prop() public dateFilter: (date: Date | null) => boolean;

  /** Event emitted on date selection. */
  @Event({
    eventName: 'date-selected',
  })
  public dateSelected: EventEmitter<Date>;

  /** Date adapter. */
  private _nativeDateAdapter: NativeDateAdapter = new NativeDateAdapter();

  /** Grid of calendar cells representing the dates of the month. */
  private _weeks: { value: number; displayValue: string }[][];

  /** A list of the day of the week, in two format (long and single char). */
  private _weekdays: { long: string; narrow: string }[];

  /** The number of blank cells in the first row before the 1st of the month. */
  private _firstWeekOffset: number;

  /** The selected date. */
  private _activeDate: Date;

  /** The selected date. */
  private _selectedDate: number;

  /** The date of the current day. */
  private _todayDate: number;

  public connectedCallback(): void {
    this._setWeekdays();
    // set activeDate with dateadapter.today?
    this._init();
  }

  /** Creates the array of weekdays. */
  private _setWeekdays(): void {
    const narrowWeekdays = this._nativeDateAdapter.getDayOfWeekNames('narrow');
    const longWeekdays = this._nativeDateAdapter.getDayOfWeekNames('long');
    const weekdays = longWeekdays.map((long, i) => ({ long, narrow: narrowWeekdays[i] }));

    // Rotate the labels for days of the week based on the configured first day of the week.
    const firstDayOfWeek = this._nativeDateAdapter.getFirstDayOfWeek();
    this._weekdays = weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek));
  }

  /** Initialize the component. */
  private _init(): void {
    // set _selectedDate with this._getDateInCurrentMonth(this.selected); ?
    this._todayDate = this._nativeDateAdapter.getDateInCurrentMonth(
      this._nativeDateAdapter.today(),
      this.activeDate
    );
    this._setFirstWeekOffset();
    this._createWeekRows();
  }

  /** Sets the first week offset. */
  private _setFirstWeekOffset(): void {
    const firstOfMonth = this._nativeDateAdapter.createDate(
      this._nativeDateAdapter.getYear(this.activeDate),
      this._nativeDateAdapter.getMonth(this.activeDate),
      1
    );
    this._firstWeekOffset =
      (NativeDateAdapter.DAYS_PER_WEEK +
        this._nativeDateAdapter.getDayOfWeek(firstOfMonth) -
        this._nativeDateAdapter.getFirstDayOfWeek()) %
      NativeDateAdapter.DAYS_PER_WEEK;
  }

  /** Create the rows for each week. */
  private _createWeekRows(): void {
    const daysInMonth = this._nativeDateAdapter.getNumDaysInMonth(this.activeDate);
    const dateNames = this._nativeDateAdapter.getDateNames();
    this._weeks = [[]];
    for (let i = 0, cell = this._firstWeekOffset; i < daysInMonth; i++, cell++) {
      if (cell === NativeDateAdapter.DAYS_PER_WEEK) {
        this._weeks.push([]);
        cell = 0;
      }
      this._weeks[this._weeks.length - 1].push({ value: i + 1, displayValue: dateNames[i] });
    }
  }

  /** Creates the table header with the months header cells. */
  private _createTableHeader(): JSX.Element {
    return this._weekdays.map((day: { long: string; narrow: string }) => (
      <th>
        <span class="visually-hidden">{day.long}</span>
        <span aria-hidden="true">{day.narrow}</span>
      </th>
    ));
  }

  /** Create the table body with the days cells. */
  private _createTableBody(): JSX.Element {
    return this._weeks.map((week: { value: number; displayValue: string }[], rowIndex: number) => {
      const firstRowOffset = NativeDateAdapter.DAYS_PER_WEEK - week.length;
      if (rowIndex === 0 && firstRowOffset) {
        return (
          <tr>
            <td colSpan={firstRowOffset}></td>
            {this._createDayCells(week, rowIndex, firstRowOffset)}
          </tr>
        );
      }
      return <tr>{this._createDayCells(week, rowIndex)}</tr>;
    });
  }

  /**
   * Create the cells for the days.
   * FIXME: check selected, disabled and active states.
   */
  private _createDayCells(
    week: { value: number; displayValue: string }[],
    rowIndex: number,
    firstRowOffset?: number
  ): JSX.Element {
    return week.map((day: { value: number; displayValue: string }, colIndex: number) => (
      <td>
        <button
          class={{
            'sbb-datepicker__day-today': day.value === this._todayDate,
            'sbb-datepicker__day-selected': day.value === this._selectedDate,
            'sbb-datepicker__day-active': this._isActiveCell(rowIndex, colIndex, firstRowOffset),
          }}
          onClick={() => this._dateSelected(day.value)}
          onFocus={() => this._activeDateChange(day.value)}
        >
          {day.displayValue}
        </button>
      </td>
    ));
  }

  /**
   * Sets the active date.
   * FIXME: check it, not working as expected.
   * */
  private _isActiveCell(rowIndex: number, colIndex: number, firstRowOffset?: number): boolean {
    let cellNumber = rowIndex * NativeDateAdapter.DAYS_PER_WEEK + colIndex;

    // Account for the fact that the first row may not have as many cells.
    if (firstRowOffset) {
      cellNumber -= firstRowOffset;
    }

    return cellNumber === this._nativeDateAdapter.getDate(this.activeDate) - 1;
  }

  /** Emits the selected date and sets it internally. */
  private _dateSelected(date: number): void {
    if (this._selectedDate !== date) {
      this._selectedDate = date;
      const selectedDate = this._nativeDateAdapter.getDateFromDayOfMonth(date, this.activeDate);
      this.dateSelected.emit(selectedDate);
    }
  }

  private _activeDateChange(date: number): void {
    this._setActiveDate(this._getDateFromDayOfMonth(date));
  }

  /**
   * Takes a day of the month and returns a new date in the same month and year as the currently
   *  active date. The returned date will have the same day of the month as the argument date.
   */
  private _getDateFromDayOfMonth(dayOfMonth: number): Date {
    return this._nativeDateAdapter.createDate(
      this._nativeDateAdapter.getYear(this.activeDate),
      this._nativeDateAdapter.getMonth(this.activeDate),
      dayOfMonth
    );
  }

  private _setActiveDate(value: Date): void {
    const oldActiveDate = this._activeDate;
    const validDate =
      this._nativeDateAdapter.getValidDateOrNull(this._nativeDateAdapter.deserialize(value)) ||
      this._nativeDateAdapter.today();
    this._activeDate = this._nativeDateAdapter.clampDate(validDate, this.minDate, this.maxDate);
    if (!this._nativeDateAdapter.hasSameMonthAndYear(oldActiveDate, this._activeDate)) {
      this._init();
    }
  }

  public render(): JSX.Element {
    return (
      <table class="sbb-calendar__table">
        <thead class="sbb-calendar__table-header">
          <tr class="sbb-calendar__table-header-row">{this._createTableHeader()}</tr>
        </thead>
        <tbody class="sbb-calendar__table-body">{this._createTableBody()}</tbody>
      </table>
    );
  }
}
