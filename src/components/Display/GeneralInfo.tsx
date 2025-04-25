import React from 'react';
import {
  ApartmentOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import TimeAgo from '../time/TimeAgo';
import { DEFAULT_COLORS } from '../../constants';
import { Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { GeneralInfoInterface } from '../../interfaces/common';

interface GeneralInfoExtension extends GeneralInfoInterface {
  totalResources: number;
}

const GeneralInfo: React.FC<GeneralInfoExtension> = ({
  name,
  creationTime,
  lastUpdateTime,
  status,
  totalResources,
}) => (
  <table
    style={{
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'center',
      tableLayout: 'fixed',
      marginBottom: '-20px',
    }}
  >
    <thead>
      <tr>
        <th style={{ padding: '10px', fontWeight: 'bold' }}>
          <ApartmentOutlined style={{ marginRight: '8px' }} />
          Name
        </th>
        <th style={{ padding: '10px', fontWeight: 'bold' }}>
          <ClockCircleOutlined style={{ marginRight: '8px' }} />
          Creation Date
        </th>
        <th style={{ padding: '10px', fontWeight: 'bold' }}>
          <ClockCircleOutlined style={{ marginRight: '8px' }} />
          Last Modification
        </th>
        <th style={{ padding: '10px', fontWeight: 'bold' }}>
          <SyncOutlined style={{ marginRight: '8px' }} />
          Status
        </th>
        <th style={{ padding: '10px', fontWeight: 'bold' }}>
          <AppstoreOutlined style={{ marginRight: '8px' }} />
          Total Resources
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style={{ padding: '10px', borderBottom: '1px solid #f0f0f0' }}>
          {name || 'Grouper Name'}
        </td>
        <td style={{ padding: '10px', borderBottom: '1px solid #f0f0f0' }}>
          <TimeAgo date={creationTime} />
        </td>
        <td style={{ padding: '10px', borderBottom: '1px solid #f0f0f0' }}>
          <TimeAgo date={lastUpdateTime} />
        </td>
        <td
          style={{
            padding: '10px',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'center', // Center the content horizontally
            alignItems: 'center', // Center the content vertically
          }}
        >
          <Button
            type="default"
            style={{
              color: status === 'Active' ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.DEFAULT,
              borderColor: status === 'Active' ? DEFAULT_COLORS.SUCCESS : DEFAULT_COLORS.DEFAULT,
              borderRadius: '25px',
              padding: '0 12px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              width: '80px', // Fixed width for the button
              justifyContent: 'center', // Center the text inside the button
            }}
          >
            {status === 'Active' ? (
              <CheckCircleOutlined style={{ marginRight: '4px' }} />
            ) : (
              <CloseCircleOutlined style={{ marginRight: '4px' }} />
            )}
            {status}
          </Button>
        </td>
        <td style={{ padding: '10px', borderBottom: '1px solid #f0f0f0' }}>
          <strong>{totalResources}</strong>
        </td>
      </tr>
    </tbody>
  </table>
);

export default GeneralInfo;
