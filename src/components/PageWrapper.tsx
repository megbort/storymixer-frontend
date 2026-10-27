import React from 'react'
import type { PageWrapperProps } from '@/types/ui'

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <div className="flex-1 max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 w-full">
      {children}
    </div>
  )
}
