import images from '../../global/images';
import { SbbColorWhiteDefault } from '@sbb-esta/lyne-design-tokens';
// FIXME
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import readme from './readme.md';

const wrapperStyle = (context): string => {
  if (context.args.negative) {
    if (context.args.variant === 'translucent') {
      return `background: url('${images[5]}');background-size: cover;`;
    }
    return 'background-color: #484040;';
  }

  if (context.args.variant === 'translucent') {
    return `background: url('${images[1]}');background-size: cover;`;
  }
  return `background-color: ${SbbColorWhiteDefault};`;
};

const focusStyle = (context): string => {
  if (context.args.negative) {
    return `--sbb-focus-outline-color: var(--sbb-focus-outline-color-dark);`;
  }
};

// FIXME
const spreadTagAttributes = (args: object): string => {
  return Object.entries(args).reduce((acc: string, [currKey, currValue]: [string, string]) => {
    if (currValue) {
      return `${acc} ${currKey}="${currValue}"`;
    }
    return acc;
  }, '');
};

// --- Component

const template = ({ text, ...args }): string => `
  <sbb-button ${spreadTagAttributes(args)}>${text ?? ''}</sbb-button>
`;

const iconSlotTemplate = ({ text, 'icon-name': iconName, ...args }): string => `
  <sbb-button ${spreadTagAttributes(args)}>
    ${text}
    <sbb-icon slot="icon" name="${iconName}"></sbb-icon>
  </sbb-button>
`;

const fixedWidthTemplate = ({ text, ...args }): string => `
  <div>
    <p>
      <sbb-button ${spreadTagAttributes(args)} style="width: 200px;">
        ${text ?? ''}
      </sbb-button>
    </p>
    <p>
      <sbb-button ${spreadTagAttributes(args)} style="max-width: 100%; width: 600px;">
        Wide Button
      </sbb-button>
    </p>
  </div>
`;

// --- Arg types

const text = {
  control: {
    type: 'text',
  },
};

const variant = {
  control: {
    type: 'select',
  },
  options: ['primary', 'secondary', 'translucent', 'transparent'],
};

const negative = {
  control: {
    type: 'boolean',
  },
};

const size = {
  control: {
    type: 'inline-radio',
  },
  options: ['l', 'm'],
};

const isStatic = {
  control: { type: 'boolean' },
};

const buttonId = {
  control: {
    type: 'text',
  },
};

const iconName = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Icon',
  },
};

const href = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Link',
  },
};

const target = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Link',
  },
};

const rel = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Link',
  },
};

const download = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Link',
  },
};

const type = {
  control: {
    type: 'select',
  },
  options: ['button', 'reset', 'submit'],
  table: {
    category: 'Button',
  },
};

const disabledArgType = {
  control: {
    type: 'boolean',
  },
  table: {
    category: 'Button',
  },
};

const name = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Button',
  },
};

const value = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Button',
  },
};

const form = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Button',
  },
};

const accessibilityControls = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Button',
  },
};

const accessibilityHaspopup = {
  control: {
    type: 'text',
  },
  table: {
    category: 'Button',
  },
};

const accessibilityLabel = {
  control: {
    type: 'text',
  },
};

const accessibilityDescribedby = {
  control: {
    type: 'text',
  },
};

const accessibilityLabelledby = {
  control: {
    type: 'text',
  },
};

const defaultArgTypes = {
  text,
  variant,
  negative,
  size,
  static: isStatic,
  'button-id': buttonId,
  'icon-name': iconName,
  href,
  target,
  rel,
  download,
  type,
  disabled: disabledArgType,
  name,
  value,
  form,
  'accessibility-controls': accessibilityControls,
  'accessibility-haspopup': accessibilityHaspopup,
  'accessibility-label': accessibilityLabel,
  'accessibility-describedby': accessibilityDescribedby,
  'accessibility-labelledby': accessibilityLabelledby,
};

const defaultArgs = {
  text: 'Button',
  variant: variant.options[0],
  negative: false,
  size: size.options[0],
  static: false,
  'button-id': undefined,
  'icon-name': 'arrow-right-small',
  href: undefined,
  target: undefined,
  rel: undefined,
  download: false,
  type: type.options[0],
  disabled: false,
  name: 'Button Name',
  value: undefined,
  form: undefined,
  'accessibility-controls': undefined,
  'accessibility-haspopup': undefined,
  'accessibility-label': undefined,
  'accessibility-describedby': undefined,
  'accessibility-labelledby': undefined,
};

export const primary = template.bind({});
primary.argTypes = defaultArgTypes;
primary.args = {
  ...defaultArgs,
  variant: variant.options[0],
};
primary.documentation = {
  title: 'Primary',
};

export const secondary = template.bind({});
secondary.argTypes = defaultArgTypes;
secondary.args = {
  ...defaultArgs,
  variant: variant.options[1],
};
secondary.documentation = {
  title: 'Secondary',
};

export const translucent = template.bind({});
translucent.argTypes = defaultArgTypes;
translucent.args = {
  ...defaultArgs,
  variant: variant.options[2],
};
translucent.documentation = {
  title: 'Translucent',
};

export const transparent = template.bind({});
transparent.argTypes = defaultArgTypes;
transparent.args = {
  ...defaultArgs,
  variant: variant.options[3],
};
transparent.documentation = {
  title: 'Transparent',
};

export const primaryNegative = template.bind({});
primaryNegative.argTypes = defaultArgTypes;
primaryNegative.args = {
  ...defaultArgs,
  variant: variant.options[0],
  negative: true,
};
primaryNegative.documentation = {
  title: 'Primary Negative',
};

export const secondaryNegative = template.bind({});
secondaryNegative.argTypes = defaultArgTypes;
secondaryNegative.args = {
  ...defaultArgs,
  variant: variant.options[1],
  negative: true,
};
secondaryNegative.documentation = {
  title: 'Secondary Negative',
};

export const translucentNegative = template.bind({});
translucentNegative.argTypes = defaultArgTypes;
translucentNegative.args = {
  ...defaultArgs,
  variant: variant.options[2],
  negative: true,
};
translucentNegative.documentation = {
  title: 'Translucent Negative',
};

export const transparentNegative = template.bind({});
transparentNegative.argTypes = defaultArgTypes;
transparentNegative.args = {
  ...defaultArgs,
  variant: variant.options[3],
  negative: true,
};
transparentNegative.documentation = {
  title: 'Transparent Negative',
};

export const iconOnly = template.bind({});
iconOnly.argTypes = defaultArgTypes;
iconOnly.args = {
  ...defaultArgs,
  'icon-name': 'arrow-right-small',
  text: undefined,
};
iconOnly.documentation = {
  title: 'Icon only',
};

export const primaryDisabled = template.bind({});
primaryDisabled.argTypes = defaultArgTypes;
primaryDisabled.args = {
  ...defaultArgs,
  variant: variant.options[0],
  disabled: true,
};
primaryDisabled.documentation = {
  title: 'Primary Disabled',
};

export const secondaryDisabled = template.bind({});
secondaryDisabled.argTypes = defaultArgTypes;
secondaryDisabled.args = {
  ...defaultArgs,
  variant: variant.options[1],
  disabled: true,
};
secondaryDisabled.documentation = {
  title: 'Secondary Disabled',
};

export const translucentDisabled = template.bind({});
translucentDisabled.argTypes = defaultArgTypes;
translucentDisabled.args = {
  ...defaultArgs,
  variant: variant.options[2],
  disabled: true,
};
translucentDisabled.documentation = {
  title: 'Translucent Disabled',
};

export const transparentDisabled = template.bind({});
transparentDisabled.argTypes = defaultArgTypes;
transparentDisabled.args = {
  ...defaultArgs,
  variant: variant.options[3],
  disabled: true,
};
transparentDisabled.documentation = {
  title: 'Transparent Disabled',
};

export const primaryNegativeDisabled = template.bind({});
primaryNegativeDisabled.argTypes = defaultArgTypes;
primaryNegativeDisabled.args = {
  ...defaultArgs,
  variant: variant.options[0],
  negative: true,
  disabled: true,
};
primaryNegativeDisabled.documentation = {
  title: 'Primary Negative Disabled',
};

export const secondaryNegativeDisabled = template.bind({});
secondaryNegativeDisabled.argTypes = defaultArgTypes;
secondaryNegativeDisabled.args = {
  ...defaultArgs,
  variant: variant.options[1],
  negative: true,
  disabled: true,
};
secondaryNegativeDisabled.documentation = {
  title: 'Secondary Negative Disabled',
};

export const translucentNegativeDisabled = template.bind({});
translucentNegativeDisabled.argTypes = defaultArgTypes;
translucentNegativeDisabled.args = {
  ...defaultArgs,
  variant: variant.options[2],
  negative: true,
  disabled: true,
};
translucentNegativeDisabled.documentation = {
  title: 'Translucent Negative Disabled',
};

export const transparentNegativeDisabled = template.bind({});
transparentNegativeDisabled.argTypes = defaultArgTypes;
transparentNegativeDisabled.args = {
  ...defaultArgs,
  variant: variant.options[3],
  negative: true,
  disabled: true,
};
transparentNegativeDisabled.documentation = {
  title: 'Transparent Negative Disabled',
};

export const iconOnlyDisabled = template.bind({});
iconOnlyDisabled.argTypes = defaultArgTypes;
iconOnlyDisabled.args = {
  ...defaultArgs,
  'icon-name': 'arrow-right-small',
  text: undefined,
  disabled: true,
};
iconOnlyDisabled.documentation = {
  title: 'Icon only Disabled',
};

export const noIcon = template.bind({});
noIcon.argTypes = defaultArgTypes;
noIcon.args = { ...defaultArgs, 'icon-name': undefined };
noIcon.documentation = {
  title: 'No Icon',
};

export const sizeM = template.bind({});
sizeM.argTypes = defaultArgTypes;
sizeM.args = {
  ...defaultArgs,
  size: size.options[1],
};
sizeM.documentation = {
  title: 'M size',
};

export const fixedWidth = fixedWidthTemplate.bind({});
fixedWidth.argTypes = defaultArgTypes;
fixedWidth.args = {
  ...defaultArgs,
  text: 'Button with long text',
  'icon-name': 'arrow-right-small',
};
fixedWidth.documentation = {
  title: 'Fixed width with overflow',
};

export const withSlottedIcon = iconSlotTemplate.bind({});
withSlottedIcon.argTypes = defaultArgTypes;
withSlottedIcon.args = {
  ...defaultArgs,
  'icon-name': 'chevron-small-right-small',
};
withSlottedIcon.documentation = {
  title: 'With slotted icon',
};

export const linkOpensInNewWindow = iconSlotTemplate.bind({});
linkOpensInNewWindow.argTypes = defaultArgTypes;
linkOpensInNewWindow.args = {
  ...defaultArgs,
  href: 'https://www.sbb.ch',
  'icon-name': 'chevron-small-right-small',
  target: '_blank',
  'accessibility-label': undefined,
};
linkOpensInNewWindow.documentation = {
  title: 'Link opened in new window',
};

export default {
  decorators: [
    (story, context) =>
      `<div style="${wrapperStyle(context)}padding: 2rem;${focusStyle(context)}">
        ${story()}
      </div>`,
  ],
  parameters: {
    actions: {
      handles: ['click'],
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-button-new',
};
