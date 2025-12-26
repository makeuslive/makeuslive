/**
 * 20+ Global Greetings - Sorted by number of speakers
 * Shared between Loading Screen and Hero section for seamless animation
 */
export const GLOBAL_GREETINGS = [
  { text: 'Hello', lang: 'English', script: 'Latin' },
  { text: '你好', lang: 'Mandarin', script: 'Hanzi' },
  { text: 'नमस्ते', lang: 'Hindi', script: 'Devanagari' },
  { text: 'Hola', lang: 'Spanish', script: 'Latin' },
  { text: 'مرحبا', lang: 'Arabic', script: 'Arabic' },
  { text: 'Bonjour', lang: 'French', script: 'Latin' },
  { text: 'হ্যালো', lang: 'Bengali', script: 'Bengali' },
  { text: 'Olá', lang: 'Portuguese', script: 'Latin' },
  { text: 'Привет', lang: 'Russian', script: 'Cyrillic' },
  { text: 'Halo', lang: 'Indonesian', script: 'Latin' },
  { text: 'سلام', lang: 'Urdu', script: 'Arabic' },
  { text: 'Hallo', lang: 'German', script: 'Latin' },
  { text: 'こんにちは', lang: 'Japanese', script: 'Hiragana' },
  { text: 'నమస్కారం', lang: 'Telugu', script: 'Telugu' },
  { text: 'Merhaba', lang: 'Turkish', script: 'Latin' },
  { text: '안녕하세요', lang: 'Korean', script: 'Hangul' },
  { text: 'Ciao', lang: 'Italian', script: 'Latin' },
  { text: 'สวัสดี', lang: 'Thai', script: 'Thai' },
  { text: 'Xin chào', lang: 'Vietnamese', script: 'Latin' },
  { text: 'Γεια σου', lang: 'Greek', script: 'Greek' },
  { text: 'שלום', lang: 'Hebrew', script: 'Hebrew' },
  { text: 'Sawubona', lang: 'Zulu', script: 'Latin' },
] as const

export type Greeting = typeof GLOBAL_GREETINGS[number]
