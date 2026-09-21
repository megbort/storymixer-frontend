import * as React from 'react'
import { Card, CardTitle } from './card'

interface CardButtonProps {
  image: string
  title: string
  onClick?: () => void
}

export const CardButton: React.FC<CardButtonProps> = ({
  image,
  title,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="group relative p-0 cursor-pointer w-72 transition-transform duration-300 hover:scale-103"
  >
    <Card variant="media" className="flex flex-col h-full relative">
      <div className="relative w-full">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover rounded-t-xl"
        />
      </div>
      <div className="flex flex-1 flex-col items-center justify-center pb-4">
        <CardTitle size="lg" className="text-center">
          {title}
        </CardTitle>
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-storymixer-primary-dark/60 opacity-0 transition-opacity duration-300 rounded-xl pointer-events-none group-hover:opacity-100">
        <span className="text-storymixer-white text-lg font-semibold px-4 text-center">
          Start story
        </span>
      </div>
    </Card>
  </button>
)
