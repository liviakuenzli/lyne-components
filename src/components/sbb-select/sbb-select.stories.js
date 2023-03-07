import events from './sbb-select.events.ts';
import { h } from 'jsx-dom';
import readme from './readme.md';

const Template = (args) => (
  <sbb-form-field label="Select">
    <sbb-select {...args}>
      <sbb-option value="Option 1">Option 1</sbb-option>
      <sbb-option value="Option 2">Option 2</sbb-option>
    </sbb-select>
  </sbb-form-field>
);

export const Default = Template.bind({});

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
      handles: [
        events.change,
        events.didChange,
        events.didClose,
        events.didOpen,
        events.willClose,
        events.willOpen,
      ],
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'sbb-select',
};
