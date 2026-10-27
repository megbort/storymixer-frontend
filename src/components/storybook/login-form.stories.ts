import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { LoginForm } from '../LoginForm'

const meta = {
  title: 'Components/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  args: {
    mode: 'login',
    onModeChange: fn(),
    onSubmit: fn(),
    onContinueAsGuest: fn(),
  },
} satisfies Meta<typeof LoginForm>

export default meta
type Story = StoryObj<typeof meta>

export const LogIn: Story = {}

export const SignUp: Story = {
  args: {
    mode: 'signup',
  },
}

export const LoginError: Story = {
  args: {
    error: "That email and password don't match. Try again.",
  },
}

export const SignUpEmailTaken: Story = {
  args: {
    mode: 'signup',
    error: 'An account with this email already exists. Try logging in instead.',
  },
}

export const Loading: Story = {
  args: {
    isLoading: true,
  },
}
