import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('sbb-navigation-section', () => {
  let element: E2EElement, page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(`

      <sbb-navigation-section disable-animation>
        <sbb-navigation-list>
          <sbb-navigation-action >Tickets & Offers</sbb-navigation-action>
          <sbb-navigation-action>Vacations & Recreation</sbb-navigation-action>
          <sbb-navigation-action>Travel information</sbb-navigation-action>
          <sbb-navigation-action>Help & Contact</sbb-navigation-action>
        </sbb-navigation-list>
      </sbb-navigation-section>
    `);
    element = await page.find('sbb-navigation-section');
  });

  it('renders', async () => {
    expect(element).toHaveClass('hydrated');
  });

  it('opens the section', async () => {
    const dialog = await page.find('sbb-navigation-section >>> dialog');

    await element.callMethod('open');
    await page.waitForChanges();

    expect(element).toEqualAttribute('data-state', 'opened');
    expect(dialog).toHaveAttribute('open');
  });

  it('closes the section', async () => {
    const dialog = await page.find('sbb-navigation-section >>> dialog');

    await element.callMethod('open');
    await page.waitForChanges();

    expect(dialog).toHaveAttribute('open');

    await element.callMethod('close');
    await page.waitForChanges();

    expect(element).toEqualAttribute('data-state', 'closed');
    expect(dialog).not.toHaveAttribute('open');
  });
});
