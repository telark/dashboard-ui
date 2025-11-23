
export interface SyncGrouperResponse {
  status: number;
  operation: string;
  message: string;
  data: {
    name: string;
    phase: string; // Completed | NotStarted | Failed
    syncEffect: string; // Changed | NoUpdate | NewlyCreated | Deleted | NotFound
  };
}

