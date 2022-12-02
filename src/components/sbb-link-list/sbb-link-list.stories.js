import { SbbColorCharcoalDefault, SbbColorWhiteDefault } from '@sbb-esta/lyne-design-tokens';
import { h } from 'jsx-dom';
import readme from './readme.md';

const wrapperStyle = (context) => {
  if (context.args.negative) {
    return `background-color: ${SbbColorCharcoalDefault};`;
  }

  return `background-color: ${SbbColorWhiteDefault};`;
};

const LinkTemplate = ({ linkTitle }) => (
  <sbb-link href="https://www.sbb.ch/de/hilfe-und-kontakt/erstattung-entschaedigung/rueckerstattung-von-billetten.html">
    {linkTitle}
  </sbb-link>
);

// SlottedTitle
const TemplateSlottedTitle = ({ 'title-content': titleContent, ...args }) => (
  <sbb-link-list {...args}>
    <span slot="title">{titleContent}</span>
    {links.map((linkTitle) => (
      <LinkTemplate {...{ linkTitle }} />
    ))}
  </sbb-link-list>
);

// TitleAsProperty
const Template = ({ ...args }) => (
  <sbb-link-list {...args}>
    {links.map((linkTitle) => (
      <LinkTemplate {...{ linkTitle }} />
    ))}
  </sbb-link-list>
);

const links = ['Refunds', 'Lost property office', 'Complaints', 'Praise', 'Report property damage'];

const orientation = {
  control: {
    type: 'select',
  },
  options: ['vertical', 'horizontal'],
  table: {
    category: 'List Styling',
  },
};

const horizontalFrom = {
  control: {
    type: 'select',
  },
  options: ['zero', 'micro', 'small', 'medium', 'large', 'wide', 'ultra'],
  table: {
    category: 'List Styling',
  },
};

const titleContent = {
  control: {
    type: 'text',
  },
  table: {
    category: 'List Title',
  },
};

const titleLevel = {
  control: {
    type: 'inline-radio',
  },
  options: [2, 3, 4, 5, 6],
  table: {
    category: 'List Title',
  },
};

const negative = {
  control: {
    type: 'boolean',
  },
  options: [true, false],
  table: {
    category: 'Styling Variant',
  },
};

const textSize = {
  control: {
    type: 'select',
  },
  options: ['xs', 's', 'm'],
  table: {
    category: 'List Items',
  },
};

const defaultArgTypes = {
  orientation: orientation,
  'horizontal-from': horizontalFrom,
  'title-level': titleLevel,
  'title-content': titleContent,
  negative,
  'text-size': textSize,
};

const defaultArgs = {
  orientation: orientation.options[0],
  'title-level': titleLevel.options[0],
  'title-content': 'Help & Contact',
  negative: false,
  'text-size': textSize.options[1],
};

/* ************************************************* */
/* The Stories                                       */
/* ************************************************* */
export const LinkListDefault = Template.bind({});

LinkListDefault.argTypes = defaultArgTypes;
LinkListDefault.args = {
  ...defaultArgs,
};

LinkListDefault.documentation = {
  title: 'Link List',
};

export const LinkListXS = Template.bind({});

LinkListXS.argTypes = defaultArgTypes;
LinkListXS.args = {
  ...defaultArgs,
  'text-size': textSize.options[0],
};

LinkListXS.documentation = {
  title: 'Link List - Textsize extra small',
};

export const LinkListNoTitle = Template.bind({});

LinkListNoTitle.argTypes = defaultArgTypes;
LinkListNoTitle.args = {
  ...defaultArgs,
  'title-content': undefined,
};

LinkListNoTitle.documentation = {
  title: 'Link List No Title',
};

export const LinkListNegative = Template.bind({});

LinkListNegative.argTypes = defaultArgTypes;
LinkListNegative.args = {
  ...defaultArgs,
  negative: true,
};

LinkListNegative.documentation = {
  title: 'Link List Negative',
};

export const LinkListWithSlottedTitle = TemplateSlottedTitle.bind({});
LinkListWithSlottedTitle.argTypes = defaultArgTypes;
LinkListWithSlottedTitle.args = {
  ...defaultArgs,
};

LinkListWithSlottedTitle.documentation = {
  title: 'Link List with slotted title',
};

export default {
  decorators: [
    (Story, context) => (
      <div style={`${wrapperStyle(context)}padding: 2rem`}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/sbb-link-list',
};
