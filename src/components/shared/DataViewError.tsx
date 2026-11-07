import React from 'react';
import { Button, Empty, Typography } from 'antd';
import { AiOutlineApi, AiOutlineExclamationCircle } from 'react-icons/ai';
import { EMPTY_ACTION_STYLE, EMPTY_CLASS } from '../../constants';
import { CONNECTIVITY_CONSTANTS } from '../../constants/pages/connectivity';
import { connectivityIssueFrom } from '../../api/client/health-interceptor';
import type { ConnectivityIssue } from '../../api/client/health-interceptor';
import { DATA_VIEW_ERROR_CONSTANTS as DVE } from './dataViewError.constants';

export type DataViewErrorVariant = 'card' | 'table' | 'fullPage';

export interface DataViewErrorProps {
  variant: DataViewErrorVariant;
  message: string;
  title?: string;
  onRetry: () => void;
  /** Optional override; when omitted the message itself is classified. */
  connectivity?: ConnectivityIssue;
}

const UNREACHABLE = CONNECTIVITY_CONSTANTS.UNREACHABLE;

const DataViewError: React.FC<DataViewErrorProps> = ({
  variant,
  message,
  title = DVE.LABELS.DEFAULT_TITLE,
  onRetry,
  connectivity,
}) => {
  // Classified here rather than at each call site, so every feature that renders
  // an error state gets the same treatment for transient connectivity issues.
  const copy =
    (connectivity ?? connectivityIssueFrom(message))
      ? {
          Icon: AiOutlineApi,
          title: UNREACHABLE.TITLE,
          text: UNREACHABLE.MESSAGE,
          retry: UNREACHABLE.RETRY_BUTTON,
        }
      : { Icon: AiOutlineExclamationCircle, title, text: message, retry: DVE.LABELS.RETRY_BUTTON };

  // The page empty state, not a card: in a page it centers below the toolbar like an
  // empty list, and fullPage callers fill the pane with it.
  const empty = (
    <Empty
      className={EMPTY_CLASS.PAGE}
      image={<copy.Icon size={DVE.LAYOUT.ICON_SIZE} />}
      description={
        <>
          <Typography.Title level={2}>{copy.title}</Typography.Title>
          <Typography.Text>{copy.text}</Typography.Text>
        </>
      }
    >
      <Button type="primary" onClick={onRetry} style={EMPTY_ACTION_STYLE}>
        {copy.retry}
      </Button>
    </Empty>
  );

  return variant === 'fullPage' ? (
    <div style={{ flex: 1, minHeight: '100%', padding: DVE.LAYOUT.PADDING, display: 'flex' }}>
      {empty}
    </div>
  ) : (
    empty
  );
};

export default DataViewError;
