import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('sbb-header-action', () => {
  let element: E2EElement, page: E2EPage;

  beforeEach(async () => {
    page = await newE2EPage();
    await page.setContent('<sbb-header-action id="focus-id">Action</sbb-header-action>');
    await page.waitForChanges();

    element = await page.find('sbb-header-action');
  });

  describe('events', () => {
    it('dispatches event on click', async () => {
      await page.waitForChanges();
      const headerAction = await page.find('sbb-header-action >>> .sbb-header-action');
      const changeSpy = await page.spyOnEvent('click');

      await headerAction.click();
      expect(changeSpy).toHaveReceivedEventTimes(1);
    });

    it('should forward host click to action element', async () => {
      const headerAction = await page.find('sbb-header-action >>> .sbb-header-action');

      const changeSpy = await headerAction.spyOnEvent('click');

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
});
