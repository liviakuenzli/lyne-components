import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('sbb-datepicker-toggle', () => {
  it('renders standalone', async () => {
    const page: E2EPage = await newE2EPage({
      html: '<sbb-datepicker-toggle></sbb-datepicker-toggle>',
    });
    const element: E2EElement = await page.find('sbb-datepicker-toggle');
    const tooltipTrigger: E2EElement = await page.find(
      'sbb-datepicker-toggle >>> sbb-tooltip-trigger'
    );
    expect(element).toHaveClass('hydrated');
    expect(tooltipTrigger).toHaveAttribute('disabled');
  });

  it('renders and open tooltip with picker', async () => {
    const page: E2EPage = await newE2EPage({
      html: `
          <sbb-datepicker-toggle date-picker="datepicker"></sbb-datepicker-toggle>
          <sbb-datepicker id='datepicker' value="01-01-2023"></sbb-datepicker>
        `,
    });
    const element: E2EElement = await page.find('sbb-datepicker-toggle');
    const tooltipTrigger: E2EElement = await page.find(
      'sbb-datepicker-toggle >>> sbb-tooltip-trigger'
    );
    const tooltip: E2EElement = await page.find('sbb-datepicker-toggle >>> sbb-tooltip');
    await page.waitForChanges();
    expect(element).toHaveClass('hydrated');
    expect(tooltipTrigger).not.toHaveAttribute('disabled');
    expect(tooltip).toEqualAttribute('data-state', 'closed');

    await tooltipTrigger.click();
    await page.waitForChanges();
    expect(tooltip).toEqualAttribute('data-state', 'opened');
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('renders in form field, open calendar and change date', async () => {
    const page: E2EPage = await newE2EPage();
    await page.setContent(`
        <sbb-form-field>
          <sbb-datepicker-toggle></sbb-datepicker-toggle>
          <sbb-datepicker></sbb-datepicker>
        </sbb-form-field>
      `);
    await page.waitForChanges();
    const tooltip: E2EElement = await page.find('sbb-datepicker-toggle >>> sbb-tooltip');
    expect(tooltip).toEqualAttribute('data-state', 'closed');
    const element: E2EElement = await page.find('sbb-datepicker-toggle');
    expect(element).toHaveClass('hydrated');

    const tooltipTrigger: E2EElement = await page.find(
      'sbb-datepicker-toggle >>> sbb-tooltip-trigger'
    );
    await tooltipTrigger.click();
    await page.waitForChanges();
    expect(tooltip).toEqualAttribute('data-state', 'opened');

    const calendar = await page.find('sbb-datepicker-toggle >>> sbb-calendar');
    await calendar.triggerEvent('date-selected', {
      detail: new Date('2022-01-01'),
    });
    await page.waitForChanges();

    const picker = await page.find('sbb-datepicker');
    expect(await picker.getProperty('value')).toEqual('01.01.2022');
  });
});
