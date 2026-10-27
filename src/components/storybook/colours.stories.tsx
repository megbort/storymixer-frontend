import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Design System/Colours',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const colours = [
  {
    name: 'Primary Dark',
    token: 'primary-dark',
    bg: 'bg-storymixer-primary-dark',
  },
  { name: 'Primary', token: 'primary', bg: 'bg-storymixer-primary' },
  {
    name: 'Primary Light',
    token: 'primary-light',
    bg: 'bg-storymixer-primary-light',
  },
  { name: 'Accent', token: 'accent', bg: 'bg-storymixer-accent' },
  {
    name: 'Accent Dark',
    token: 'accent-dark',
    bg: 'bg-storymixer-accent-dark',
  },
  { name: 'Black', token: 'black', bg: 'bg-storymixer-black' },
  { name: 'White', token: 'white', bg: 'bg-storymixer-white' },
  { name: 'Grey', token: 'grey', bg: 'bg-storymixer-grey' },
  { name: 'Grey Alt', token: 'grey-alt', bg: 'bg-storymixer-grey-alt' },
  { name: 'Grey Dark', token: 'grey-dark', bg: 'bg-storymixer-grey-dark' },
  { name: 'Error', token: 'error', bg: 'bg-storymixer-error' },
  { name: 'Error Alt', token: 'error-alt', bg: 'bg-storymixer-error-alt' },
]

interface ResolvedColour {
  value: string
  hex: string
}

// Let the browser resolve any CSS colour (oklch etc.) to sRGB via a canvas.
const toHex = (value: string): string => {
  const ctx = document.createElement('canvas').getContext('2d')
  if (!ctx || !value) return ''
  ctx.fillStyle = '#000'
  ctx.fillStyle = value
  ctx.fillRect(0, 0, 1, 1)
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
  return `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

const resolveColours = (): Record<string, ResolvedColour> => {
  const styles = getComputedStyle(document.documentElement)
  return Object.fromEntries(
    colours.map(({ token }) => {
      const value = styles.getPropertyValue(`--storymixer-${token}`).trim()
      return [token, { value, hex: toHex(value).toUpperCase() }]
    }),
  )
}

export const ColourPalette: Story = {
  render: function ColourPaletteTable() {
    const [resolved, setResolved] = useState<Record<string, ResolvedColour>>({})

    useEffect(() => setResolved(resolveColours()), [])

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-8">Colour Palette</h1>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 pr-4 font-semibold">Swatch</th>
                <th className="py-2 pr-4 font-semibold">Name</th>
                <th className="py-2 pr-4 font-semibold">Class</th>
                <th className="py-2 pr-4 font-semibold">CSS variable</th>
                <th className="py-2 pr-4 font-semibold">Value</th>
                <th className="py-2 font-semibold">Hex</th>
              </tr>
            </thead>
            <tbody>
              {colours.map(({ name, token, bg }) => (
                <tr key={token} className="border-b border-border">
                  <td className="py-2 pr-4">
                    <div
                      className={cn('size-10 rounded border border-border', bg)}
                    />
                  </td>
                  <td className="py-2 pr-4 font-medium">{name}</td>
                  <td className="py-2 pr-4 font-mono">{bg}</td>
                  <td className="py-2 pr-4 font-mono">--storymixer-{token}</td>
                  <td className="py-2 pr-4 font-mono">
                    {resolved[token]?.value}
                  </td>
                  <td className="py-2 font-mono">{resolved[token]?.hex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  },
}
