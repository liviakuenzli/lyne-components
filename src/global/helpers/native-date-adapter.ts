import getDocumentLang from './get-document-lang';

// FIXME for missing utils, see:
//  https://github.com/sbb-design-systems/sbb-angular/blob/main/src/angular/core/datetime/native-date-adapter.ts
export class NativeDateAdapter {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  public static readonly DAYS_PER_WEEK = 7;

  /** Creates an array and fills it with values. */
  private _range<T>(length: number, valueFunction: (index: number) => T): T[] {
    const valuesArray = Array(length);
    for (let i = 0; i < length; i++) {
      valuesArray[i] = valueFunction(i);
    }
    return valuesArray;
  }

  public getYear(date: Date): number {
    return date.getFullYear();
  }

  public getMonth(date: Date): number {
    return date.getMonth();
  }

  public getDate(date: Date): number {
    return date.getDate();
  }

  public getDayOfWeek(date: Date): number {
    return date.getDay();
  }

  public getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    const formatter = new Intl.DateTimeFormat(getDocumentLang(), { month: style });
    return this._range(12, (i) => formatter.format(new Date(2017, i, 1)));
  }

  public getDateNames(): string[] {
    const formatter = new Intl.DateTimeFormat(getDocumentLang(), { day: 'numeric' });
    return this._range(31, (i) => formatter.format(new Date(2017, 0, i + 1)));
  }

  /**
   * Creates an array of days starting from Sunday in the given format.
   * @param style - 'long' for full name, 'short' for short name, 'narrow' for single letter.
   */
  public getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    const formatter = new Intl.DateTimeFormat(getDocumentLang(), { weekday: style });
    return this._range(7, (i) => formatter.format(new Date(2017, 0, i + 1)));
  }

  /* Define which is the first day of the week (0: sunday; 1: monday; etc.)*/
  public getFirstDayOfWeek(): number {
    return 1;
  }

  public getNumDaysInMonth(date: Date): number {
    const lastDayOfMonth = new Date(0);
    lastDayOfMonth.setFullYear(date.getFullYear(), date.getMonth() + 1, 0);
    lastDayOfMonth.setHours(0, 0, 0, 0);
    return lastDayOfMonth.getDate();
  }

  public today(): Date {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }

  public createDate(year: number, month: number, date: number): Date {
    // Check for invalid month and date (except upper bound on date which we have to check after creating the Date).
    if (month < 0 || month > 11) {
      throw Error(`Invalid month index "${month}". Month index has to be between 0 and 11.`);
    }

    if (date < 1) {
      throw Error(`Invalid date "${date}". Date has to be greater than 0.`);
    }

    const result = this._createDateWithOverflow(year, month, date);
    // Check that the date wasn't above the upper bound for the month, causing the month to overflow
    if (result.getMonth() !== month) {
      throw Error(`Invalid date "${date}" for month with index "${month}".`);
    }

    return result;
  }

  /**
   * Takes a day of the month and returns a new date in the same month and year as the currently
   *  active date. The returned date will have the same day of the month as the argument date.
   */
  public getDateFromDayOfMonth(dayOfMonth: number, activeDate: Date): Date {
    return this.createDate(this.getYear(activeDate), this.getMonth(activeDate), dayOfMonth);
  }

  /**
   * Gets the date in this month that the given Date falls on.
   * Returns null if the given Date is in another month.
   */
  public getDateInCurrentMonth(date: Date | null, activeDate: Date | null): number | null {
    return date && this._hasSameMonthAndYear(date, activeDate) ? this.getDate(date) : null;
  }

  /** Creates a date but allows the month and date to overflow. */
  private _createDateWithOverflow(year: number, month: number, date: number): Date {
    const result = new Date(year, month, date);

    // We need to correct for the fact that JS native Date treats years in range [0, 99] as
    // abbreviations for 19xx.
    if (year >= 0 && year < 100) {
      result.setFullYear(this.getYear(result) - 1900);
    }
    return result;
  }

  /** Checks whether the 2 dates are non-null and fall within the same month of the same year. */
  private _hasSameMonthAndYear(d1: Date | null, d2: Date | null): boolean {
    return !!(
      d1 &&
      d2 &&
      this.getMonth(d1) === this.getMonth(d2) &&
      this.getYear(d1) === this.getYear(d2)
    );
  }
}