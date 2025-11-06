import type { Record } from './shared';

export interface TimelineRailProps {
  cutHeight: number;
}

export interface TimelineMarkerProps {
  status: string;
  isLast: boolean;
  markerLeft: number;
  maskHeight: number;
}

export interface TimelineItemProps {
  item: Record;
  index: number;
  lastIndex: number;
  markerLeft: number;
}

export interface TimelineViewProps {
  items: Record[];
  withRecording?: boolean;
}

export interface TimelineDrawerProps {
  open: boolean;
  onClose: () => void;
  visibleItems: Record[];
  isLoading: boolean;
  hasMoreItems: boolean;
  totalItems: number;
  onLoadMore: () => void;
}

export interface RecordingIndicatorProps {
  markerLeft: number;
}
