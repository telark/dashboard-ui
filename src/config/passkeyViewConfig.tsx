import { BsKey } from 'react-icons/bs';
import { AiOutlineCalendar, AiOutlineClockCircle } from 'react-icons/ai';
import type { Passkey } from '../interfaces/auth';
import type { ViewDetailsConfig } from '../components/display/shared/views/ViewDetails';
import { StatusTag } from '../components/tags';
import { DEFAULT_COLORS, ICONS, PASSKEYS_PAGE_CONSTANTS as PPC } from '../constants';
import TimeAgo from '../components/time/TimeAgo';

export const createPasskeyViewConfig = (passkey: Passkey): ViewDetailsConfig => {
  return {
    fields: [
      {
        key: 'deviceName',
        label: 'Device Name',
        value: passkey.deviceName,
        icon: <BsKey />,
        type: 'text',
      },
      {
        key: 'deviceType',
        label: 'Device Type',
        value: (
          <StatusTag
            label={
              passkey.deviceType === PPC.VALUES.DEVICE_TYPE_PLATFORM
                ? PPC.LABELS.DEVICE_TYPE_PLATFORM
                : PPC.LABELS.DEVICE_TYPE_CROSS_PLATFORM
            }
            icon={<BsKey />}
            color={
              passkey.deviceType === PPC.VALUES.DEVICE_TYPE_PLATFORM
                ? DEFAULT_COLORS.SUCCESS
                : '#3b82f6'
            }
          />
        ),
        icon: <BsKey />,
        type: 'custom',
      },
      {
        key: 'creationTimestamp',
        label: 'Created At',
        value: passkey.creationTimestamp ? (
          <TimeAgo date={passkey.creationTimestamp} />
        ) : (
          <span style={{ color: '#999' }}>{PPC.LABELS.NEVER_USED}</span>
        ),
        icon: <AiOutlineCalendar />,
        type: 'custom',
      },
      {
        key: 'lastUsedTimestamp',
        label: 'Last Used',
        value: passkey.lastUsedTimestamp ? (
          <TimeAgo date={passkey.lastUsedTimestamp} />
        ) : (
          <span style={{ color: '#999' }}>{PPC.LABELS.NEVER_USED}</span>
        ),
        icon: <AiOutlineClockCircle />,
        type: 'custom',
      },
    ],
  };
};

