import { SbbSelect } from './sbb-select';
import { newSpecPage } from '@stencil/core/testing';

describe('sbb-select', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [SbbSelect],
      html: '<sbb-select />',
    });

    expect(root).toEqualHtml(`
      <sbb-select>
        <mock:shadow-root>
          <button class="some-class"></button>
        </mock:shadow-root>
      </sbb-select>
    `);
  });
});
