import { STORIES } from '@/data/stories'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { HelpCircle, ArrowLeft } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const SUGGESTIONS: Record<string, string[]> = {
  noun: ['dog', 'elephant', 'banana', 'telescope', 'pizza'],
  verbPast: ['jumped', 'danced', 'exploded', 'whispered', 'flew'],
  verbPresent: ['jump', 'dance', 'explode', 'whisper', 'fly'],
  adjective: ['sparkly', 'grumpy', 'invisible', 'gigantic', 'fuzzy'],
  adverb: [
    'quickly',
    'mysteriously',
    'enthusiastically',
    'gracefully',
    'frantically',
  ],
  exclamation: ['Holy cow!', 'Yikes!', 'Wow!', 'Eureka!', 'Oh no!'],
}

const DESCRIPTIONS: Record<string, string> = {
  noun: 'A person, place, or thing',
  verbPast: 'An action that already happened',
  verbPresent: 'An action word in present/base form',
  adjective: 'A word that describes something',
  adverb: 'A word that describes how something is done',
  exclamation: 'An expression of strong emotion or surprise',
}

const TYPE_LABELS: Record<string, string> = {
  noun: 'Noun',
  verbPast: 'Verb (past tense)',
  verbPresent: 'Verb (present tense)',
  adjective: 'Adjective',
  adverb: 'Adverb',
  exclamation: 'Exclamation',
}

const formatExamples = (type: string) => {
  const examples = SUGGESTIONS[type] ?? []
  return type === 'exclamation' ? examples.join(' ') : examples.join(', ')
}

export const Route = createFileRoute('/editor/$storyId')({
  component: EditorComponent,
})

function EditorComponent() {
  const { storyId } = Route.useParams()
  const navigate = useNavigate()
  const story = STORIES.find((story) => story.id === storyId)

  const [formValues, setFormValues] = useState<Record<string, string>>(
    Object.fromEntries(story?.inputs.map((input) => [input.id, '']) ?? []),
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!story) {
    return <div>Story not found</div>
  }

  const handleInputChange = (inputId: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [inputId]: value }))

    if (errors[inputId]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[inputId]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    story.inputs.forEach((input) => {
      if (!formValues[input.id]?.trim()) {
        newErrors[input.id] = `${input.label} is required`
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (validateForm()) {
      navigate({
        to: '/results',
        search: { storyId, formValues, isNewStory: true },
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Button
        onClick={() => navigate({ to: '/' })}
        variant="ghost"
        size="sm"
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>
      <h1 className="text-3xl font-bold mb-8">{story.title}</h1>

      <TooltipProvider>
        <form onSubmit={handleSubmit} className="space-y-6">
          {story.inputs.map((input) => (
            <div key={input.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor={input.id}>{input.label}</Label>
                {SUGGESTIONS[input.type] && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-4 h-4 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-semibold">
                          {TYPE_LABELS[input.type]}
                        </p>
                        <p className="text-xs">{DESCRIPTIONS[input.type]}</p>
                        <p className="text-xs">
                          Examples: {formatExamples(input.type)}
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <Input
                id={input.id}
                type="text"
                placeholder={`${formatExamples(input.type)}`}
                value={formValues[input.id]}
                onChange={(event) =>
                  handleInputChange(input.id, event.target.value)
                }
                aria-invalid={!!errors[input.id]}
              />
              {errors[input.id] && (
                <p className="text-storymixer-error text-sm">
                  {errors[input.id]}
                </p>
              )}
            </div>
          ))}

          <Button type="submit" className="w-full">
            Create Story
          </Button>
        </form>
      </TooltipProvider>
    </div>
  )
}
