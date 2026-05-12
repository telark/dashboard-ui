export interface ServiceRegistryEntry {
  name: string;
  baseURLPattern: string | RegExp;
}

export type ServiceName = 'exporter' | 'discovery' | 'auth' | 'enrichment';
