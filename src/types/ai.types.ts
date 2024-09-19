export type AvailableCommandType =
  | 'auto_categoriation'
  | 'generate_bookmark_fields'
  | 'embeddings_body_chunks'
  | 'folder_recommendations'
  | 'generate_search_types'
  | 'embeddings_user_prompt_for_search'

export type ProviderType = 'openai' | 'groq' | 'anthropic'

export type AiGenerationModeType = 'auto' | 'tool' | 'json' | 'grammar'

export interface AiCommandOptionInterface {
  command: AvailableCommandType
  provider: ProviderType
  model: string
  prompts?: string[]
  temperature?: number
  match_threshold?: number
  match_count?: number
}

export interface AiModelInterface {
  provider: ProviderType
  model: string
  modelVersion: string
  inputPriceRate: number
  outputPriceRate: number
  contextWindow: number
  maxOutputTokens: number
  hasSeperator?: boolean
  disabled?: boolean
}

export type SearchType = 'date' | 'semantic'

export interface SearchTypeInterface {
  type: SearchType
  value: string | string[]
}
