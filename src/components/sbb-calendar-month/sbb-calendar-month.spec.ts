import { SbbCalendarMonth } from './sbb-calendar-month';
import { newSpecPage } from '@stencil/core/testing';

describe('sbb-calendar-month', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [SbbCalendarMonth],
      html: '<sbb-calendar-month />',
    });

    expect(root).toEqualHtml(`
        <sbb-calendar-month>
          <mock:shadow-root>
            <button class="some-class"></button>
          </mock:shadow-root>
        </sbb-calendar-month>
      `);
  });
});
