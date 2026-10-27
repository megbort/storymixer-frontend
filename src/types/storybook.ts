import type React from 'react'

export interface DialogProps {
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export interface InputProps {
  label: string
  id: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  required?: boolean
  className?: string
}

export interface ResolvedColour {
  value: string
  hex: string
}
