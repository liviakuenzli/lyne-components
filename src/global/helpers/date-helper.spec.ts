import { removeTimezoneFromISOTimeString, durationToTime } from './date-helper';

describe('removeTimezoneFromDate', () => {
  it('returns date in local timezone', () => {
    expect(removeTimezoneFromISOTimeString('2022-10-28T21:16:00+03:00')).toStrictEqual(
      new Date('2022-10-28T21:16:00')
    );
  });
  it('returns date with a negative timezone in local timezone', () => {
    expect(removeTimezoneFromISOTimeString('2022-10-28T21:16:00-03:00')).toStrictEqual(
      new Date('2022-10-28T21:16:00')
    );
  });
  it('returns date when date string has Z', () => {
    expect(removeTimezoneFromISOTimeString('2022-10-28T21:16:00Z')).toStrictEqual(
      new Date('2022-10-28T21:16:00')
    );
  });
  it('returns undefined when date string is invalid', () => {
    expect(removeTimezoneFromISOTimeString('10-28T21:16:00+03:00')).toBe(undefined);
  });
  it('returns date when date string has no time', () => {
    expect(removeTimezoneFromISOTimeString('2022-10-28')).toStrictEqual(new Date('2022-10-28'));
  });
  it('returns date when date string has no timezone', () => {
    expect(removeTimezoneFromISOTimeString('2022-10-28T21:16:00')).toStrictEqual(
      new Date('2022-10-28T21:16:00')
    );
  });
});

describe('durationToTime', () => {
  it('should return only minutes', () => {
    expect(durationToTime(40)).toBe('40 min');
  });

  it('should return day with hours', () => {
    expect(durationToTime(3000)).toBe('2 d 2 h');
  });

  it('should return hours', () => {
    expect(durationToTime(60)).toBe('1 h');
  });
});
