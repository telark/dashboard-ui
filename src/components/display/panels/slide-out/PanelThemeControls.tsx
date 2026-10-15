import React from 'react';
import { Button, ConfigProvider, DatePicker, Form, Input, Select, Switch, Tabs } from 'antd';
import { PANEL_PREWARM } from '../../../../constants';
import { PANEL_THEME } from './AnimationWrapper';

const OPTIONS = [{ value: 0 }];
const TABS = [{ key: '0', label: '0' }];

// The controls most panels use, in the panel theme, out of sight (PanelThemePrewarm).
const PanelThemeControls: React.FC = () => (
  <div inert aria-hidden style={PANEL_PREWARM.CONTAINER}>
    <ConfigProvider theme={PANEL_THEME}>
      <Form layout="vertical" component={false}>
        <Form.Item className="form-item-compact">
          <Input />
        </Form.Item>
        <Select options={OPTIONS} />
        <Select mode="multiple" options={OPTIONS} value={[0]} />
        <Switch />
        <Button />
        <Button type="primary" />
        <DatePicker />
        <Tabs items={TABS} />
      </Form>
    </ConfigProvider>
  </div>
);

export default PanelThemeControls;
