import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { AccountPanel } from '../AccountPanel'

const meta = {
  title: 'Components/AccountPanel',
  component: AccountPanel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { onLogin: fn(), onLogout: fn() },
  decorators: [
    (Story) => (
      <div className="w-80 p-4 bg-storymixer-primary-dark text-storymixer-white">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AccountPanel>

export default meta
type Story = StoryObj<typeof meta>

export const Guest: Story = {
  args: {
    user: null,
  },
}

export const SignedIn: Story = {
  args: {
    user: { name: 'Sam Rivera', email: 'sam.rivera@example.com' },
  },
}

export const LongEmail: Story = {
  args: {
    user: {
      name: 'Alexandra Montgomery-Smythe',
      email: 'alexandra.montgomery-smythe@averylongdomainname.example.com',
    },
  },
}
