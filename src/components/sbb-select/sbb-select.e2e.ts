import { E2EElement, E2EPage, newE2EPage } from '@stencil/core/testing';

describe('sbb-select', () => {
  let element: E2EElement, page: E2EPage;

  it('renders', async () => {
    page = await newE2EPage();
    await page.setContent('<sbb-select></sbb-select>');

    element = await page.find('sbb-select');
    expect(element).toHaveClass('hydrated');
  });
});
