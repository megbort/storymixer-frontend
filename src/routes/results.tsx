import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { useEffect, useRef, useState } from 'react'
import { STORIES } from '@/data/stories'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { getGuestStories, getStorySaveKey } from '@/lib/guestStories'

const getImageStorageKey = (storyId: string, storyText: string) =>
  `storyMixer:image:${storyId}:${storyText}`

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
  const [isQuotaError, setIsQuotaError] = useState(false)
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

    const createdStories = getGuestStories()

    const storySaveKey = getStorySaveKey(storyId, storyText)
    if (localStorage.getItem(storySaveKey)) {
      hasSaved.current = true
      return
    }

    if (
      createdStories.some(
        (existing) =>
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

          const prompt = `Create a fun and whimsical illustration for this story: "${storyText}"`

          const response = await openai.images.generate({
            model: 'gpt-image-1-mini',
            prompt,
            size: '1024x1024',
            quality: 'low',
          })

          const imageBase64 = response.data?.[0]?.b64_json
          if (!imageBase64) {
            throw new Error('No image generated from API')
          }

          const dataUrl = `data:image/png;base64,${imageBase64}`
          sessionStorage.setItem(imageStorageKey, dataUrl)
          setImageDataUrl(dataUrl)
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Failed to generate image'
          const isQuota = message.toLowerCase().includes('quota')
          setIsQuotaError(isQuota)
          setImageError(message)
        } finally {
          setIsImageLoading(false)
        }
      }

      generateImage()
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

    if (isQuotaError) {
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
              <p className="text-foreground text-sm">
                {formValues[input.id]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
