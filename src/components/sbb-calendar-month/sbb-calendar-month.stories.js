import events from './sbb-calendar-month.events.ts';
import { h } from 'jsx-dom';
import readme from './readme.md';

const Template = (args) => <sbb-calendar-month {...args}></sbb-calendar-month>;

export const story1 = Template.bind({});

story1.args = {
  'some-prop': 'opt1',
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
      handles: [events.click],
    },
    backgrounds: {
      disable: true,
    },
    docs: {
      extractComponentDescription: () => readme,
    },
  },
  title: 'components/form elements/datepicker/sbb-calendar-month',
};
