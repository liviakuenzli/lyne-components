import { SbbNavigationMarker } from './sbb-navigation-marker';
import { newSpecPage } from '@stencil/core/testing';

describe('sbb-navigation-marker', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [SbbNavigationMarker],
      html: '<sbb-navigation-marker />',
    });

    expect(root).toEqualHtml(`
      <sbb-navigation-marker size="l">
        <mock:shadow-root>
          <ul class="sbb-navigation-marker"></ul>
          <span hidden="">
            <slot></slot>
          </span>
        </mock:shadow-root>
      </sbb-navigation-marker>
    `);
  });
});
