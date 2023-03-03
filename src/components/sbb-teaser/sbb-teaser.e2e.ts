import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('sbb-teaser', () => {
  let element: E2EElement, page: E2EPage;

  it('should forward host click to action element', async () => {
    page = await newE2EPage();
    await page.setContent(
      '<sbb-teaser href="link" accessibility-label="label">Teaser content</sbb-teaser>'
    );
    const teaserHero = await page.find('sbb-teaser >>> .sbb-teaser');

    const changeSpy = await teaserHero.spyOnEvent('click');

    element = await page.find('sbb-teaser');
    element.triggerEvent('click');

    await page.waitForChanges();

    expect(changeSpy).toHaveReceivedEventTimes(1);
  });

  it('should receive focus', async () => {
    page = await newE2EPage();
    await page.setContent('<sbb-teaser href="link" id="focus-id">Hero content</sbb-teaser>');

    element = await page.find('sbb-teaser');
    await element.focus();
    await page.waitForChanges();

    expect(await page.evaluate(() => document.activeElement.id)).toBe('focus-id');
  });
});
