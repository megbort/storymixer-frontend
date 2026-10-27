import type { Meta, StoryObj } from '@storybook/react-vite'
import { CardButton } from '../ui/card-button'

const meta: Meta<typeof CardButton> = {
  title: 'Components/CardButton',
  component: CardButton,
}

export default meta
type Story = StoryObj<typeof CardButton>

export const Default: Story = {
  args: {
    image: 'https://placehold.co/400x225',
    title: 'Sample Card',
    onClick: () => alert('CardButton clicked!'),
  },
}
