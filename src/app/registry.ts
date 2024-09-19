import { anthropic } from '@ai-sdk/anthropic'
import { createOpenAI } from '@ai-sdk/openai'
import { experimental_createProviderRegistry as createProviderRegistry } from 'ai'

export const registry = createProviderRegistry({
  anthropic,
  openai: createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    compatibility: 'strict',
  }),
  groq: createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: process.env.GROQ_API_KEY,
  }),
})
