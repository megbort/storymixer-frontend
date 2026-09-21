import type { Meta, StoryObj } from '@storybook/react-vite'

import { Dialog } from './dialog'
import { Button } from '../ui/button'

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'User Profile',
    children: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          This is a simple dialog component with a title and content area.
        </p>
      </div>
    ),
  },
}

export const WithFooter: Story = {
  args: {
    title: 'Confirm Action',
    children: (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Are you sure you want to proceed with this action?
        </p>
      </div>
    ),
    footer: (
      <div className="flex gap-3 justify-end">
        <Button variant="outline">Cancel</Button>
        <Button variant="default">Confirm</Button>
      </div>
    ),
  },
}

export const Form: Story = {
  args: {
    title: 'Create Account',
    children: (
      <div className="space-y-4 min-w-80">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="px-4 py-2 rounded-lg border border-border dark:border-storymixer-grey-dark bg-background text-foreground"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="px-4 py-2 rounded-lg border border-border dark:border-storymixer-grey-dark bg-background text-foreground"
          />
        </div>
      </div>
    ),
    footer: (
      <div className="flex gap-3 justify-end">
        <Button variant="outline">Cancel</Button>
        <Button variant="default">Create Account</Button>
      </div>
    ),
  },
}
