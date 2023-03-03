import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('sbb-navigation-action', () => {
  let element: E2EElement, page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent(
      '<sbb-navigation-action id="focus-id">Navigation Action</sbb-navigation-action>'
    );

    element = await page.find('sbb-navigation-action');
  });

  describe('events', () => {
    it('dispatches event on click', async () => {
      await page.waitForChanges();
      const navigationAction = await page.find('sbb-navigation-action >>> .sbb-navigation-action');
      const changeSpy = await page.spyOnEvent('click');

      await navigationAction.click();
      expect(changeSpy).toHaveReceivedEventTimes(1);
    });

    it('should forward host click to action element', async () => {
      const navigationAction = await page.find('sbb-navigation-action >>> .sbb-navigation-action');

      const changeSpy = await navigationAction.spyOnEvent('click');

      element.triggerEvent('click');
      await page.waitForChanges();

      expect(changeSpy).toHaveReceivedEventTimes(1);
    });

    it('should receive focus', async () => {
      await element.focus();
      await page.waitForChanges();

      expect(await page.evaluate(() => document.activeElement.id)).toBe('focus-id');
    });
  });

  it('renders as a button and triggers click event', async () => {
    page = await newE2EPage();
    await page.setContent('<sbb-navigation-action>Label</sbb-navigation-action>');

    element = await page.find('sbb-navigation-action');
    expect(element).toHaveClass('hydrated');

    const button = await page.find('sbb-navigation-action >>> button');
    const clickedSpy = await page.spyOnEvent('click');
    await button.click();
    expect(clickedSpy).toHaveReceivedEventTimes(1);
  });
});
