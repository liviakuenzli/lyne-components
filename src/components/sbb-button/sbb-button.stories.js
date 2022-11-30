import { h } from 'jsx-dom';
import readme from './readme.md';

const Template = (args) => <sbb-button {...args}>Label</sbb-button>;

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

const defaultArgTypes = {
  variant,
  negative,
  size,
};

const defaultArgs = {
  variant: variant.options[0],
  negative: false,
  size: size.options[0],
};

export const Button = Template.bind({});
Button.argTypes = defaultArgTypes;
Button.args = defaultArgs;
Button.parameters = {
  variants: {
    enable: true,
  },
};

export default {
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
  title: 'components/sbb-button',
};
