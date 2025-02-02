import { PtSituation } from './sbb-timetable-row.custom';
import {
  getCus,
  getHimIcon,
  getTransportIcon,
  filterNotices,
  isProductIcon,
  sortSituation,
} from './sbb-timetable-row.helper';
import { walkTimeTrip, partiallyCancelled } from './sbb-timetable-row.sample-data';

describe('getTransportIcon', () => {
  it('should return schiff', () => {
    expect(getTransportIcon('SHIP')).toBe('schiff-right');
  });

  it('should return empty string', () => {
    expect(getTransportIcon('UNKNOWN')).toBe('');
  });
});

describe('isProductIcon', () => {
  it('should return true', () => {
    expect(isProductIcon('ic')).toBe(true);
  });

  it('should return false', () => {
    expect(isProductIcon('icc')).toBe(false);
  });
});

describe('sortSituation', () => {
  it('should return sorted array', () => {
    expect(
      sortSituation([{ cause: 'TRAIN_REPLACEMENT_BY_BUS' }, { cause: 'DISTURBANCE' }])
    ).toStrictEqual([{ cause: 'DISTURBANCE' }, { cause: 'TRAIN_REPLACEMENT_BY_BUS' }]);
  });

  it('should return sorted array even with double causes', () => {
    expect(
      sortSituation([
        { cause: 'TRAIN_REPLACEMENT_BY_BUS' },
        { cause: 'DISTURBANCE' },
        { cause: 'DISTURBANCE' },
      ])
    ).toStrictEqual([
      { cause: 'DISTURBANCE' },
      { cause: 'DISTURBANCE' },
      { cause: 'TRAIN_REPLACEMENT_BY_BUS' },
    ]);
  });
});

describe('getHimIcon', () => {
  it('should return replacementbus', () => {
    const situation: PtSituation = {
      cause: 'TRAIN_REPLACEMENT_BY_BUS',
    };
    expect(getHimIcon(situation)).toStrictEqual({ name: 'replacementbus', text: '' });
  });

  it('should return info', () => {
    const situation: PtSituation = {
      cause: null,
    };
    expect(getHimIcon(situation)).toStrictEqual({ name: 'info', text: '' });
  });
});

describe('getCus', () => {
  it('should return cancellation', () => {
    expect(getCus(partiallyCancelled)).toStrictEqual({ name: 'cancellation', text: undefined });
  });
});

describe('filterNotices', () => {
  it('should return sa-rr', () => {
    expect(filterNotices(walkTimeTrip?.notices)).toStrictEqual([]);
  });
});
