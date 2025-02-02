import { SbbTeaser } from './sbb-teaser';
import { newSpecPage } from '@stencil/core/testing';

describe('sbb-teaser', () => {
  describe('sbb-teaser is stacked', () => {
    it('renders', async () => {
      const { root } = await newSpecPage({
        components: [SbbTeaser],
        html: '<sbb-teaser href="https://github.com/lyne-design-system/lyne-components" is-stacked accessibility-label="Sbb teaser"></sbb-teaser>',
      });

      expect(root).toEqualHtml(`
        <sbb-teaser accessibility-label="Sbb teaser" href="https://github.com/lyne-design-system/lyne-components" is-stacked>
          <mock:shadow-root>
            <a aria-label="Sbb teaser" class="sbb-teaser" href="https://github.com/lyne-design-system/lyne-components" dir="ltr">
            <span class="sbb-teaser__container">
              <span class='sbb-teaser__image-wrapper'><slot name='image'/></span>
                <span class='sbb-teaser__text'>
                  <sbb-title class="sbb-teaser__lead" level="5" visuallevel="5">
                    <slot name='title'/>
                  </sbb-title>
                <span class='sbb-teaser__description'><slot name='description'/></span>
              </span>
            </a>
          </mock:shadow-root>
        </sbb-teaser>
        `);
    });
  });
  describe('sbb-teaser is not stacked', () => {
    it('renders', async () => {
      const { root } = await newSpecPage({
        components: [SbbTeaser],
        html: '<sbb-teaser href="https://github.com/lyne-design-system/lyne-components" accessibility-label="Sbb teaser" />',
      });

      expect(root).toEqualHtml(`
        <sbb-teaser accessibility-label="Sbb teaser" href="https://github.com/lyne-design-system/lyne-components">
          <mock:shadow-root>
            <a aria-label="Sbb teaser" class="sbb-teaser" dir="ltr" href="https://github.com/lyne-design-system/lyne-components">
              <span class="sbb-teaser__container">
                <span class='sbb-teaser__image-wrapper'><slot name='image'/></span>
                  <span class='sbb-teaser__text'>
                    <sbb-title class="sbb-teaser__lead" level="5" visuallevel="5">
                      <slot name='title'/>
                    </sbb-title>
                  <span class='sbb-teaser__description'><slot name='description'/></span>
                </span>
              </span>
            </a>
          </mock:shadow-root>
        </sbb-teaser>
        `);
    });
  });
});
