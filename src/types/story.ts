export interface Story {
  id: string
  title: string
  image?: string
  inputs: StoryInput[]
  template: StoryTemplatePart[]
}

export interface StoryInput {
  id: string
  label: string
  type:
    | 'noun'
    | 'verbPast'
    | 'verbPresent'
    | 'adjective'
    | 'adverb'
    | 'exclamation'
    | 'custom'
  placeholder?: string
}

export type StoryTemplatePart = string | { inputId: string }

export interface SavedStory {
  id: string
  storyId: string
  title: string
  storyText: string
  formValues: Record<string, string>
  createdAt: number
}
