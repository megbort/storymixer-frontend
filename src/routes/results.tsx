import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { useEffect, useRef, useState } from 'react'
import { STORIES } from '@/data/stories'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, BookOpen } from 'lucide-react'

const IMAGE_KEY_PREFIX = 'storyMixer:image:'

const getImageStorageKey = (storyId: string, storyText: string) =>
  `${IMAGE_KEY_PREFIX}${storyId}:${storyText}`

const getStorySaveKey = (storyId: string, storyText: string) =>
  `storyMixer:saved:${storyId}:${storyText}`

const trySetItem = (key: string, value: string) => {
  try {
    sessionStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

const cacheImage = (key: string, dataUrl: string) => {
  const staleKeys = Object.keys(sessionStorage).filter(
    (storedKey) => storedKey.startsWith(IMAGE_KEY_PREFIX) && storedKey !== key,
  )
  const evictedEntries: [string, string][] = []

  while (!trySetItem(key, dataUrl)) {
    const staleKey = staleKeys.shift()
    if (!staleKey) {
      evictedEntries.forEach(([evictedKey, evictedValue]) =>
        sessionStorage.setItem(evictedKey, evictedValue),
      )
      return
    }
    evictedEntries.push([staleKey, sessionStorage.getItem(staleKey) ?? ''])
    sessionStorage.removeItem(staleKey)
  }
}

export const Route = createFileRoute('/results')({
  validateSearch: (search) => ({
    storyId: z.string().parse(search.storyId),
    formValues: z.record(z.string(), z.string()).parse(search.formValues),
    isNewStory: z.boolean().optional().parse(search.isNewStory) ?? false,
  }),
  component: ResultsComponent,
})

function ResultsComponent() {
  const { storyId, formValues, isNewStory } = Route.useSearch()
  const story = STORIES.find((story) => story.id === storyId)
  const hasSaved = useRef(false)
  const hasRequestedImage = useRef(false)
  const navigate = useNavigate()
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null)
  const [imageError, setImageError] = useState<string | null>(null)
  const [isRateLimitError, setIsRateLimitError] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(false)

  const storyText = story
    ? story.template
        .map((part) =>
          typeof part === 'string'
            ? part
            : (formValues?.[part.inputId] ?? `[${part.inputId}]`),
        )
        .join('')
    : ''

  const saveNewStoryToSession = () => {
    if (!isNewStory || !story || hasSaved.current) return

    const storySaveKey = getStorySaveKey(storyId, storyText)
    if (localStorage.getItem(storySaveKey)) {
      hasSaved.current = true
      return
    }

    const createdStories = JSON.parse(
      localStorage.getItem('storyMixer:createdStories') || '[]',
    )

    if (
      createdStories.some(
        (existing: { storyId: string; storyText: string }) =>
          existing.storyId === storyId && existing.storyText === storyText,
      )
    ) {
      localStorage.setItem(storySaveKey, 'deduped')
      hasSaved.current = true
      return
    }

    const newStory = {
      id: crypto.randomUUID(),
      storyId,
      title: story.title,
      storyText,
      formValues,
      createdAt: Date.now(),
    }

    createdStories.push(newStory)
    localStorage.setItem(
      'storyMixer:createdStories',
      JSON.stringify(createdStories),
    )
    localStorage.setItem(storySaveKey, newStory.id)
    hasSaved.current = true
  }

  useEffect(() => {
    saveNewStoryToSession()
  }, [isNewStory])

  const imageStorageKey = story ? getImageStorageKey(storyId, storyText) : null

  useEffect(() => {
    if (!story || !imageStorageKey) return

    const cachedImage = sessionStorage.getItem(imageStorageKey)
    if (cachedImage) {
      setImageDataUrl(cachedImage)
      return
    }

    if (isNewStory && !hasRequestedImage.current) {
      hasRequestedImage.current = true
      setIsImageLoading(true)
      setImageError(null)

      const generateImage = async () => {
        try {
          const { default: OpenAI } = await import('openai')
          const openai = new OpenAI({
            apiKey: 'proxy',
            baseURL: 'https://storymixer.megankrenbrink.com',
            dangerouslyAllowBrowser: true,
          })

          const prompt = `Create a single fun and whimsical illustration inspired by this story. Show one silly moment as one full-frame scene. Do not make a comic strip: no panels, no speech bubbles, no captions, no text or lettering of any kind. Draw any people as adults, and draw animals, creatures and objects as the story describes them. Do not include children unless the story explicitly mentions them. Story: "${storyText}"`

          const response = await openai.images.generate({
            model: 'gpt-image-2.6-flare',
            prompt,
            size: '1024x1024',
            quality: 'low',
            complexity: 'low',
            output_format: 'webp',
            output_compression: 80,
          })

          const imageBase64 = response.data?.[0]?.b64_json
          if (!imageBase64) {
            throw new Error('No image generated from API')
          }

          const dataUrl = `data:image/webp;base64,${imageBase64}`
          setImageDataUrl(dataUrl)
          cacheImage(imageStorageKey, dataUrl)
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Failed to generate image'
          setIsRateLimitError(
            error instanceof Error && 'status' in error && error.status === 429,
          )
          setImageError(message)
        } finally {
          setIsImageLoading(false)
        }
      }

      void generateImage()
    }
  }, [imageStorageKey, isNewStory, story])

  if (!story) {
    return <div>Story not found</div>
  }

  const renderImageContent = () => {
    if (imageDataUrl) {
      return (
        <img
          src={imageDataUrl}
          alt={`Illustration for ${story.title}`}
          className="w-full rounded border border-storymixer-grey"
        />
      )
    }

    if (isImageLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center gap-3 min-h-55">
          <Spinner />
          <p className="text-sm text-storymixer-grey">
            Generating a story image...
          </p>
        </div>
      )
    }

    if (isRateLimitError) {
      return (
        <div className="flex flex-col items-center justify-center text-center gap-3 min-h-55">
          <img
            src="https://res.cloudinary.com/dm1yyjg7i/image/upload/v1772319737/ghost-error_b0qhga.png"
            alt="Rate limit error"
            className="w-24 h-24 object-contain"
          />
          <p className="text-sm text-storymixer-grey">
            You&apos;ve hit the rate limit. Try again in a few minutes.
          </p>
        </div>
      )
    }

    if (imageError) {
      return (
        <div className="flex flex-col items-center justify-center text-center gap-3 min-h-55">
          <img
            src="https://res.cloudinary.com/dm1yyjg7i/image/upload/v1772320567/ghost-no-image_mqxffb.png"
            alt="Illustration unavailable"
            className="w-24 h-24 object-contain"
          />
          <p className="text-sm text-storymixer-grey">No Image Available</p>
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center justify-center text-center gap-3 min-h-55">
        <img
          src="https://res.cloudinary.com/dm1yyjg7i/image/upload/v1772320567/ghost-no-image_mqxffb.png"
          alt="Illustration unavailable"
          className="w-24 h-24 object-contain"
        />
        <p className="text-sm text-storymixer-grey">No Image Available</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <Button onClick={() => navigate({ to: '/' })} variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          More stories
        </Button>
        <Button
          onClick={() => navigate({ to: '/my-stories' })}
          variant="ghost"
          size="sm"
        >
          <BookOpen className="w-4 h-4 mr-2" />
          My stories
        </Button>
      </div>
      <h2 className="text-lg font-semibold mb-4">{story.title}</h2>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <p className="text-base sm:text-lg md:basis-2/3">{storyText}</p>
        <div className="border border-storymixer-grey rounded p-4 md:basis-1/3 md:shrink-0 w-full md:w-auto max-w-md md:max-w-none mx-auto md:mx-0">
          {renderImageContent()}
        </div>
      </div>

      <div className="border-t border-border pt-8 mt-16">
        <p className="text-xs text-storymixer-grey mb-4 uppercase tracking-wide">
          Your inputs
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {story.inputs.map((input) => (
            <div key={input.id} className="text-xs">
              <p className="font-semibold text-storymixer-grey mb-1">
                {input.label}
              </p>
              <p className="text-foreground text-sm">{formValues[input.id]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
