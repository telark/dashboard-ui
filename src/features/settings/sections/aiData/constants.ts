export type ProviderKey = 'ollama' | 'gemini' | 'groq' | 'claude' | 'chatgpt';

export const AI_DATA_CONSTANTS = {
  PROVIDERS: {
    DEFAULT: 'ollama' as ProviderKey,
    OPTIONS: [
      { value: 'ollama' as ProviderKey, label: 'Ollama' },
      { value: 'gemini' as ProviderKey, label: 'Gemini' },
      { value: 'groq' as ProviderKey, label: 'Groq' },
      { value: 'claude' as ProviderKey, label: 'Claude' },
      { value: 'chatgpt' as ProviderKey, label: 'ChatGPT' },
    ],
  },
  LABELS: {
    AI_INSIGHTS_TITLE: 'AI Insights',
    AI_INSIGHTS_DESCRIPTION: 'Enable AI enrichment and validate provider keys.',
    ENABLE_AI_LABEL: 'Enable AI insights',
    PROVIDER_CARD_TITLE: 'Provider',
    PROVIDER_CARD_DESCRIPTION: 'Choose your AI provider.',
    API_KEY_PLACEHOLDER: 'API key',
    VALIDATE_BUTTON: 'Validate',
    KEY_VALID: 'Key is valid.',
    SAVE_TITLE: 'Save',
    SAVE_DESCRIPTION: 'Apply changes to the cluster-wide GlobalConfig.',
    ENABLE_BUTTON: 'Enable',
  },
  MESSAGES: {
    API_KEY_REQUIRED: 'API key is required.',
    VALIDATION_FAILED: 'Validation failed.',
    VALIDATION_SUCCESS: 'API key validated.',
    SAVE_SUCCESS: 'Settings saved.',
    SAVE_FAILED: 'Failed to save settings.',
  },
  COLORS: {
    ERROR_TEXT: '#b91c1c',
    SUCCESS_TEXT: '#15803d',
  },
} as const;
