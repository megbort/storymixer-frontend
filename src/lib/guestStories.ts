import type { SavedStory } from '@/types/story'

export const GUEST_STORY_LIFETIME_DAYS = 5

const STORIES_KEY = 'storyMixer:createdStories'
const LIFETIME_MS = GUEST_STORY_LIFETIME_DAYS * 24 * 60 * 60 * 1000

export const getStorySaveKey = (storyId: string, storyText: string) =>
  `storyMixer:saved:${storyId}:${storyText}`

const isExpired = (story: SavedStory, now: number) =>
  typeof story.createdAt === 'number' && now - story.createdAt > LIFETIME_MS

export function getGuestStories(): SavedStory[] {
  const stories: SavedStory[] = JSON.parse(
    localStorage.getItem(STORIES_KEY) || '[]',
  )
  const now = Date.now()
  const expired = stories.filter((story) => isExpired(story, now))

  if (expired.length === 0) {
    return stories
  }

  expired.forEach((story) =>
    localStorage.removeItem(getStorySaveKey(story.storyId, story.storyText)),
  )
  const kept = stories.filter((story) => !isExpired(story, now))
  localStorage.setItem(STORIES_KEY, JSON.stringify(kept))
  return kept
}
