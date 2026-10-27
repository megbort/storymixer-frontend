import type React from 'react'

export interface PageWrapperProps {
  children: React.ReactNode
}

export interface CardButtonProps {
  image: string
  title: string
  onClick?: () => void
}

export interface SpinnerProps extends React.ComponentProps<'svg'> {
  size?: 'sm' | 'md' | 'lg'
}
