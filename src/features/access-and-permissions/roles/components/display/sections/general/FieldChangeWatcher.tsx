import React, { useRef } from 'react';
import { Form } from 'antd';
import type { FieldChangeWatcherProps } from '../../../../models';

export const FieldChangeWatcher: React.FC<FieldChangeWatcherProps> = ({ fieldName, onChange }) => {
  const changeTriggeredRef = useRef(false);

  if (!onChange) return null;

  return (
    <Form.Item noStyle shouldUpdate={(prev, curr) => prev?.[fieldName] !== curr?.[fieldName]}>
      {() => {
        if (!changeTriggeredRef.current) {
          changeTriggeredRef.current = true;
          requestAnimationFrame(() => {
            onChange();
            changeTriggeredRef.current = false;
          });
        }
        return null;
      }}
    </Form.Item>
  );
};
