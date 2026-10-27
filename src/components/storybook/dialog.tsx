import React from 'react'
import type { DialogProps } from '@/types/storybook'

export const Dialog: React.FC<DialogProps> = ({
  title,
  children,
  footer,
  className = '',
}) => {
  return (
    <div
      className={`bg-card rounded-xl shadow-2xl border border-border dark:border-storymixer-grey-dark overflow-hidden ${className}`}
    >
      <div className="px-6 py-4 border-b border-border dark:border-storymixer-grey-dark">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>
      <div className="px-6 py-6">{children}</div>
      {footer && (
        <div className="px-6 py-4 bg-muted/20 border-t border-border dark:border-storymixer-grey-dark">
          {footer}
        </div>
      )}
    </div>
  )
}
