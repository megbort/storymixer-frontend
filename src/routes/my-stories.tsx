import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { getGuestStories } from '@/lib/guestStories'
import type { SavedStory } from '@/types/story'

export const Route = createFileRoute('/my-stories')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const [stories, setStories] = useState<SavedStory[]>([])

  useEffect(() => {
    setStories(getGuestStories())
  }, [])

  const handleDeleteStory = (storyId: string) => {
    setStories((prev) => prev.filter((story) => story.id !== storyId))
    const saved = localStorage.getItem('storyMixer:createdStories')
    if (saved) {
      const updated = JSON.parse(saved).filter(
        (story: SavedStory) => story.id !== storyId,
      )
      localStorage.setItem('storyMixer:createdStories', JSON.stringify(updated))
    }
  }

  const handleDeleteAll = () => {
    setStories([])
    localStorage.removeItem('storyMixer:createdStories')
  }

  const handleViewStory = (story: SavedStory) => {
    navigate({
      to: '/results',
      search: {
        storyId: story.storyId,
        formValues: story.formValues,
        isNewStory: false,
      },
    })
  }

  return (
    <div>
      <Button
        onClick={() => navigate({ to: '/' })}
        variant="ghost"
        size="sm"
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      {stories.length === 0 ? (
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">My Stories</h1>
          <p className="text-storymixer-grey-alt">No stories created yet.</p>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">My Stories</h1>
            <Button onClick={handleDeleteAll} variant="destructive" size="sm">
              <Trash2 className="w-4 h-4" />
              Delete All
            </Button>
          </div>
          <div className="space-y-3">
            {stories
              .slice()
              .sort((a, b) => b.createdAt - a.createdAt)
              .map((story) => (
                <div
                  key={story.id}
                  className="p-4 border border-storymixer-grey rounded-lg flex items-center justify-between"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 text-foreground">
                      {story.title}
                    </h3>
                    <p className="text-storymixer-grey-alt text-sm line-clamp-2 mb-2">
                      {story.storyText}
                    </p>
                    <p className="text-xs text-storymixer-grey">
                      {new Date(story.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="ml-4 shrink-0 flex gap-2">
                    <Button
                      onClick={() => handleViewStory(story)}
                      variant="default"
                    >
                      View Story
                    </Button>
                    <Button
                      onClick={() => handleDeleteStory(story.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
