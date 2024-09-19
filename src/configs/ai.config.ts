import {
  PROMPT_AUTO_CATEGORIZATION_2,
  PROMPT_AUTO_CATEGORIZATION_3,
  PROMPT_AUTO_CATEGORIZATION_END,
  PROMPT_AUTO_CATEGORIZATION_START,
  PROMPT_AUTO_CATEGORIZATION_TAGS_LANG,
  PROMPT_FOLDER_RECOMMENDATIONS,
  PROMPT_GENERATE_BOOKMARK_FIELDS,
  PROMPT_GENERATE_SEARCH_TYPES_1,
  PROMPT_GENERATE_SEARCH_TYPES_2,
  PROMPT_GENERATE_SEARCH_TYPES_FORMAT,
  PROMPT_GENERATE_SEARCH_TYPES_INPUT,
  PROMPT_GENERATE_SEARCH_TYPES_LANG,
  PROMPT_GENERATE_SEARCH_TYPES_RULES,
  PROMPT_GENERATE_SEARCH_TYPES_START,
} from '@/configs/prompts.config'

import { AiCommandOptionInterface, AiModelInterface } from '@/types/ai.types'

export const AI_COMMAND_OPTIONS: AiCommandOptionInterface[] = [
  {
    command: 'auto_categoriation',
    /* provider: 'groq',
    model: 'llama-3.1-70b-versatile', */
    provider: 'openai',
    model: 'gpt-4o-mini',
    prompts: [
      PROMPT_AUTO_CATEGORIZATION_START,
      PROMPT_AUTO_CATEGORIZATION_2,
      PROMPT_AUTO_CATEGORIZATION_3,
      PROMPT_AUTO_CATEGORIZATION_TAGS_LANG,
      PROMPT_AUTO_CATEGORIZATION_END,
    ],
    temperature: 0.5,
  },
  {
    command: 'generate_bookmark_fields',
    provider: 'openai',
    model: 'gpt-4o-mini',
    prompts: [PROMPT_GENERATE_BOOKMARK_FIELDS],
    temperature: 0.5,
  },
  {
    command: 'embeddings_body_chunks',
    provider: 'openai',
    model: 'text-embedding-3-small',
    prompts: [],
  },
  {
    command: 'folder_recommendations',
    provider: 'openai',
    model: 'gpt-4o-mini',
    prompts: [PROMPT_FOLDER_RECOMMENDATIONS],
    temperature: 1,
  },
  {
    command: 'generate_search_types',
    provider: 'openai',
    model: 'gpt-4o-mini',
    prompts: [
      PROMPT_GENERATE_SEARCH_TYPES_START,
      PROMPT_GENERATE_SEARCH_TYPES_INPUT,
      PROMPT_GENERATE_SEARCH_TYPES_1,
      PROMPT_GENERATE_SEARCH_TYPES_2,
      PROMPT_GENERATE_SEARCH_TYPES_RULES,
      PROMPT_GENERATE_SEARCH_TYPES_LANG,
      PROMPT_GENERATE_SEARCH_TYPES_FORMAT,
    ],
    temperature: 1,
  },
  {
    command: 'embeddings_user_prompt_for_search',
    provider: 'openai',
    model: 'text-embedding-3-small',
    prompts: [],
    match_threshold: 0.6,
    match_count: 10,
  },
]

export const AVAILABLE_AI_MODELS: AiModelInterface[] = [
  {
    provider: 'openai',
    model: 'gpt-4o',
    modelVersion: 'gpt-4o',
    inputPriceRate: 5,
    outputPriceRate: 15,
    contextWindow: 128000,
    maxOutputTokens: 4096,
  },
  {
    provider: 'openai',
    model: 'gpt-4o-mini',
    modelVersion: 'gpt-4o-mini',
    inputPriceRate: 0.15,
    outputPriceRate: 0.6,
    contextWindow: 128000,
    maxOutputTokens: 4096,
  },
  {
    provider: 'openai',
    model: 'text-embedding-3-small',
    modelVersion: 'text-embedding-3-small',
    inputPriceRate: 0.02,
    outputPriceRate: 0,
    contextWindow: 8191,
    maxOutputTokens: 8191,
  },
  {
    provider: 'groq',
    model: 'llama3-groq-70b',
    modelVersion: 'llama3-groq-70b-8192-tool-use-preview',
    inputPriceRate: 0.89,
    outputPriceRate: 0.89,
    contextWindow: 8192,
    maxOutputTokens: 4096,
  },
]

export const ENABLE_FOLDER_GENERATING = false

export const ENABLE_EMBEDDINGS = true

export const ENABLE_EMBEDDINGS_BODY_CONTENTS = false
