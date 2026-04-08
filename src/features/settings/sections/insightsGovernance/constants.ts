export type ProviderKey = 'ollama' | 'gemini' | 'groq' | 'claude' | 'chatgpt';

export const INSIGHTS_GOVERNANCE_CONSTANTS = {
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
    NAMESPACES_TITLE: 'Excluded namespaces',
    NAMESPACES_DESCRIPTION:
      'Choose namespaces to exclude from discovery and platform insights. System namespaces are pre-selected by default.',
    NAMESPACES_SELECTOR_PLACEHOLDER: 'Select namespaces…',
    NAMESPACES_SAVE_BUTTON: 'Save namespaces',
    PLATFORM_TITLE: 'Platform behavior',
    PLATFORM_DESCRIPTION: 'Polling and snapshot retention settings.',
    FETCH_INTERVAL_MINUTES_LABEL: 'Fetch interval (minutes)',
    SNAPSHOTS_MAX_PER_APP_LABEL: 'Snapshots max per app',
    PLATFORM_SAVE_INTERVAL_BUTTON: 'Save interval',
    PLATFORM_SAVE_SNAPSHOTS_BUTTON: 'Save snapshots',
  },
  MESSAGES: {
    API_KEY_REQUIRED: 'API key is required.',
    VALIDATION_FAILED: 'Validation failed.',
    VALIDATION_SUCCESS: 'API key validated.',
    SAVE_SUCCESS: 'Settings saved.',
    SAVE_FAILED: 'Failed to save settings.',
    NAMESPACES_LOAD_FAILED: 'Failed to load namespaces.',
    NAMESPACES_SAVE_SUCCESS: 'Namespaces saved.',
    NAMESPACES_SAVE_FAILED: 'Failed to save namespaces.',
    PLATFORM_SAVE_INTERVAL_SUCCESS: 'Interval saved.',
    PLATFORM_SAVE_INTERVAL_FAILED: 'Failed to save interval.',
    PLATFORM_SAVE_SNAPSHOTS_SUCCESS: 'Snapshots saved.',
    PLATFORM_SAVE_SNAPSHOTS_FAILED: 'Failed to save snapshots.',
  },
  COLORS: {
    ERROR_TEXT: '#b91c1c',
    SUCCESS_TEXT: '#15803d',
  },
} as const;

