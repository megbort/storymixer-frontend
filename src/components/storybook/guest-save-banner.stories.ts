import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { GuestSaveBanner } from '../GuestSaveBanner'

const meta = {
  title: 'Components/GuestSaveBanner',
  component: GuestSaveBanner,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  args: { onLogin: fn(), onDismiss: fn() },
} satisfies Meta<typeof GuestSaveBanner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
