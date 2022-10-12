import { h } from 'jsx-dom';
import readme from './readme.md';
import buttonEvents from '../sbb-button/sbb-button.events';
import linkEvents from '../sbb-link/sbb-link.events';

const firstButtonTemplate = (size, alignSelf) => (
  <sbb-button size={size} align-self={alignSelf} variant="secondary">
    Button 1
  </sbb-button>
);

const secondButtonTemplate = (size, alignSelf) => (
  <sbb-button size={size} align-self={alignSelf}>
    Button 2
  </sbb-button>
);

const linkTemplate = (alignSelf) => (
  <sbb-link
    align-self={alignSelf}
    variant="block"
    text-size="s"
    icon-name="chevron-small-left-small"
    icon-placement="start"
    href="https://github.com/lyne-design-system/lyne-components"
  >
    Link
  </sbb-link>
);

const TemplateTwoElements = (size, alignSelfFirst, alignSelfSecond) => [
  firstButtonTemplate(size, alignSelfFirst),
  secondButtonTemplate(size, alignSelfSecond),
];

const TemplateThreeElements = (size, alignSelfFirst, alignSelfSecond, alignSelfThird) => [
  TemplateTwoElements(size, alignSelfFirst, alignSelfSecond),
  linkTemplate(alignSelfThird),
];

const CommonTemplateThreeElementsAllocation = ({ size, ...args }) => (
  <sbb-action-group {...args}>{TemplateThreeElements(size)}</sbb-action-group>
);

const CommonTemplateTwoElementsAllocation = ({ size, ...args }) => (
  <sbb-action-group {...args}>{TemplateTwoElements(size)}</sbb-action-group>
);

const TemplateHorizontalAllocation111 = ({ size, ...args }) => (
  <sbb-action-group {...args}>{TemplateThreeElements(size, null, 'center')}</sbb-action-group>
);

const TemplateHorizontalAllocation201 = ({ size, ...args }) => (
  <sbb-action-group {...args}>{TemplateThreeElements(size, null, null, 'end')}</sbb-action-group>
);

const TemplateHorizontalAllocation102 = ({ size, ...args }) => (
  <sbb-action-group {...args}>{TemplateThreeElements(size, 'start')}</sbb-action-group>
);

const TemplateHorizontalAllocation101 = ({ size, ...args }) => (
  <sbb-action-group {...args}>{TemplateTwoElements(size, null, 'end')}</sbb-action-group>
);

const TemplateVerticalAllocation300FullWidth = ({ size, ...args }) => (
  <sbb-action-group {...args}>{TemplateThreeElements(size, null, null, 'start')}</sbb-action-group>
);

const TemplateVerticalAllocation030FullWidth = ({ size, ...args }) => (
  <sbb-action-group {...args}>{TemplateThreeElements(size, null, null, 'center')}</sbb-action-group>
);

const TemplateVerticalAllocation003FullWidth = ({ size, ...args }) => (
  <sbb-action-group {...args}>{TemplateThreeElements(size, null, null, 'end')}</sbb-action-group>
);

const buttonSize = {
  control: {
    type: 'inline-radio',
  },
  options: ['l', 'm'],
  table: {
    category: 'Button',
  },
};

const orientation = {
  control: {
    type: 'inline-radio',
  },
  options: ['horizontal', 'vertical'],
};

const horizontalFrom = {
  control: {
    type: 'select',
  },
  options: ['unset', 'zero', 'micro', 'small', 'medium', 'large', 'wide', 'ultra'],
};

const alignGroup = {
  control: {
    type: 'inline-radio',
  },
  options: ['start', 'center', 'stretch', 'end'],
};

const basicArgTypes = {
  'align-group': alignGroup,
  orientation,
  'horizontal-from': horizontalFrom,
  size: buttonSize,
};

const basicArgs = {
  'align-group': 'start',
  orientation: 'horizontal',
  'horizontal-from': 'unset',
  size: buttonSize.options[0],
};

const basicArgsVertical = {
  ...basicArgs,
  orientation: 'vertical',
};

const basicArgsVerticalFullWidth = {
  ...basicArgsVertical,
  'align-group': 'stretch',
};

export const HorizontalAllocation3_0_0 = CommonTemplateThreeElementsAllocation.bind({});
HorizontalAllocation3_0_0.argTypes = basicArgTypes;
HorizontalAllocation3_0_0.args = { ...basicArgs };
HorizontalAllocation3_0_0.documentation = {
  title: 'sbb-action-group horizontal allocation 3-0-0',
};

export const HorizontalAllocation1_1_1 = TemplateHorizontalAllocation111.bind({});
HorizontalAllocation1_1_1.argTypes = basicArgTypes;
HorizontalAllocation1_1_1.args = { ...basicArgs };
HorizontalAllocation1_1_1.documentation = {
  title: 'sbb-action-group horizontal allocation 1-1-1',
};

export const HorizontalAllocation2_0_1 = TemplateHorizontalAllocation201.bind({});
HorizontalAllocation2_0_1.argTypes = basicArgTypes;
HorizontalAllocation2_0_1.args = { ...basicArgs };
HorizontalAllocation2_0_1.documentation = {
  title: 'sbb-action-group horizontal allocation 2-0-1',
};

export const HorizontalAllocation1_0_2 = TemplateHorizontalAllocation102.bind({});
HorizontalAllocation1_0_2.argTypes = basicArgTypes;
HorizontalAllocation1_0_2.args = { ...basicArgs, 'align-group': 'end' };
HorizontalAllocation1_0_2.documentation = {
  title: 'sbb-action-group horizontal allocation 1-0-2',
};

export const HorizontalAllocation2_0_0 = CommonTemplateTwoElementsAllocation.bind({});
HorizontalAllocation2_0_0.argTypes = basicArgTypes;
HorizontalAllocation2_0_0.args = { ...basicArgs };
HorizontalAllocation2_0_0.documentation = {
  title: 'sbb-action-group horizontal allocation 2-0-0',
};

export const HorizontalAllocation1_0_1 = TemplateHorizontalAllocation101.bind({});
HorizontalAllocation1_0_1.argTypes = basicArgTypes;
HorizontalAllocation1_0_1.args = { ...basicArgs };
HorizontalAllocation1_0_1.documentation = {
  title: 'sbb-action-group horizontal allocation 1-0-1',
};

export const VerticalAllocation3_0_0 = CommonTemplateThreeElementsAllocation.bind({});
VerticalAllocation3_0_0.argTypes = basicArgTypes;
VerticalAllocation3_0_0.args = { ...basicArgsVertical, 'align-group': 'start' };
VerticalAllocation3_0_0.documentation = {
  title: 'sbb-action-group vertical allocation 3-0-0',
};

export const VerticalAllocation2_0_0 = CommonTemplateTwoElementsAllocation.bind({});
VerticalAllocation2_0_0.argTypes = basicArgTypes;
VerticalAllocation2_0_0.args = { ...basicArgsVertical, 'align-group': 'start' };
VerticalAllocation2_0_0.documentation = {
  title: 'sbb-action-group vertical allocation 2-0-0',
};

export const VerticalAllocation0_3_0 = CommonTemplateThreeElementsAllocation.bind({});
VerticalAllocation0_3_0.argTypes = basicArgTypes;
VerticalAllocation0_3_0.args = { ...basicArgsVertical, 'align-group': 'center' };
VerticalAllocation0_3_0.documentation = {
  title: 'sbb-action-group vertical allocation 0-3-0',
};

export const VerticalAllocation0_2_0 = CommonTemplateTwoElementsAllocation.bind({});
VerticalAllocation0_2_0.argTypes = basicArgTypes;
VerticalAllocation0_2_0.args = { ...basicArgsVertical, 'align-group': 'center' };
VerticalAllocation0_2_0.documentation = {
  title: 'sbb-action-group vertical allocation 0-2-0',
};

export const VerticalAllocation0_0_3 = CommonTemplateThreeElementsAllocation.bind({});
VerticalAllocation0_0_3.argTypes = basicArgTypes;
VerticalAllocation0_0_3.args = { ...basicArgsVertical, 'align-group': 'end' };
VerticalAllocation0_0_3.documentation = {
  title: 'sbb-action-group vertical allocation 0-0-3',
};

export const VerticalAllocation0_0_2 = CommonTemplateTwoElementsAllocation.bind({});
VerticalAllocation0_0_2.argTypes = basicArgTypes;
VerticalAllocation0_0_2.args = { ...basicArgsVertical, 'align-group': 'end' };
VerticalAllocation0_0_2.documentation = {
  title: 'sbb-action-group vertical allocation 0-0-2',
};

export const VerticalAllocation3_0_0FullWidth = TemplateVerticalAllocation300FullWidth.bind({});
VerticalAllocation3_0_0FullWidth.argTypes = basicArgTypes;
VerticalAllocation3_0_0FullWidth.args = { ...basicArgsVerticalFullWidth };
VerticalAllocation3_0_0FullWidth.documentation = {
  title: 'sbb-action-group vertical allocation 3-0-0 full width',
};

export const VerticalAllocation2_0_0FullWidth = CommonTemplateTwoElementsAllocation.bind({});
VerticalAllocation2_0_0FullWidth.argTypes = basicArgTypes;
VerticalAllocation2_0_0FullWidth.args = { ...basicArgsVerticalFullWidth };
VerticalAllocation2_0_0FullWidth.documentation = {
  title: 'sbb-action-group vertical allocation 2-0-0 full width',
};

export const VerticalAllocation0_3_0FullWidth = TemplateVerticalAllocation030FullWidth.bind({});
VerticalAllocation0_3_0FullWidth.argTypes = basicArgTypes;
VerticalAllocation0_3_0FullWidth.args = { ...basicArgsVerticalFullWidth };
VerticalAllocation0_3_0FullWidth.documentation = {
  title: 'sbb-action-group vertical allocation 0-3-0 full width',
};

export const VerticalAllocation0_2_0FullWidth = CommonTemplateTwoElementsAllocation.bind({});
VerticalAllocation0_2_0FullWidth.argTypes = basicArgTypes;
VerticalAllocation0_2_0FullWidth.args = { ...basicArgsVerticalFullWidth };
VerticalAllocation0_2_0FullWidth.documentation = {
  title: 'sbb-action-group vertical allocation 0-2-0 full width',
};

export const VerticalAllocation0_0_3FullWidth = TemplateVerticalAllocation003FullWidth.bind({});
VerticalAllocation0_0_3FullWidth.argTypes = basicArgTypes;
VerticalAllocation0_0_3FullWidth.args = { ...basicArgsVerticalFullWidth };
VerticalAllocation0_0_3FullWidth.documentation = {
  title: 'sbb-action-group vertical allocation 0-0-3 full width',
};

export const VerticalAllocation0_0_2FullWidth = CommonTemplateTwoElementsAllocation.bind({});
VerticalAllocation0_0_2FullWidth.argTypes = basicArgTypes;
VerticalAllocation0_0_2FullWidth.args = { ...basicArgsVerticalFullWidth };
VerticalAllocation0_0_2FullWidth.documentation = {
  title: 'sbb-action-group vertical allocation 0-0-2 full width',
};

export const VerticalToHorizontal3_0_0 = CommonTemplateThreeElementsAllocation.bind({});
VerticalToHorizontal3_0_0.argTypes = basicArgTypes;
VerticalToHorizontal3_0_0.args = { ...basicArgsVertical, 'horizontal-from': 'medium' };
VerticalToHorizontal3_0_0.documentation = {
  title: 'sbb-action-group vertical to horizontal allocation 3-0-0',
};

export default {
  decorators: [
    (Story) => (
      <div style={'padding: 2rem'}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    actions: {
      handles: [buttonEvents.click, linkEvents.click],
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/layout/sbb-action-group',
};