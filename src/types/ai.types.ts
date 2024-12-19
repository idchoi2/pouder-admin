export type AvailableCommandType =
  | 'auto_categoriation'
  | 'generate_bookmark_fields'
  | 'embeddings_body_chunks'
  | 'folder_recommendations'
  | 'generate_search_types'
  | 'embeddings_user_prompt_for_search'
  | 'summarize_body_contents'
  | 'get_keywords_from_body_contents'
  | 'get_keywords_from_ask'
  | 'get_search_type'
  | 'ask_bookmarks'

export type ProviderType = 'openai' | 'groq' | 'anthropic' | 'google'

export type AiGenerationModeType = 'auto' | 'tool' | 'json' | 'grammar'

export interface AiCommandOptionInterface {
  command: AvailableCommandType
  provider: ProviderType
  model: string
  prompts: string[]
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

export type UsageType = 'complete' | 'embedding' | 'summarize' | 'keywords'
