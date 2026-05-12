import React from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import type { FormInstance } from 'antd';
import { SlideOutPanel } from '../../../../../components/display/panels/slide-out';
import LabeledInput from '../../../../../components/display/inputs/LabeledInput';
import { APPLICATIONS_UI } from '../../constants/texts';
import type { Application } from '../../models';
import { useEditApplicationPanel } from '../../hooks/panels/useEditApplicationPanel';

export interface EditApplicationPanelProps {
  open: boolean;
  onClose: () => void;
  application: Application | null;
  form: FormInstance;
}

const EditApplicationPanel: React.FC<EditApplicationPanelProps> = ({
  open,
  onClose,
  application,
  form,
}) => {
  const { submitting, handleSubmit } = useEditApplicationPanel({ application });

  if (!application) {
    return null;
  }

  return (
    <SlideOutPanel
      open={open}
      onClose={onClose}
      title={APPLICATIONS_UI.EDIT_PAGE.PANEL_TITLE}
      subtitle={APPLICATIONS_UI.EDIT_PAGE.SUBTITLE}
      formContent={
        <>
          <Form.Item
            name="name"
            label={APPLICATIONS_UI.EDIT_PAGE.NAME_LABEL}
            style={{ marginBottom: 12 }}
          >
            <Input disabled size="small" style={{ height: 36, borderRadius: 8, fontSize: 14 }} />
          </Form.Item>
          <LabeledInput
            name="displayName"
            label={APPLICATIONS_UI.EDIT_PAGE.DISPLAY_NAME_LABEL}
            placeholder={APPLICATIONS_UI.EDIT_PAGE.DISPLAY_NAME_LABEL}
            required
            marginBottom={12}
          />
          <LabeledInput
            name="description"
            label={APPLICATIONS_UI.EDIT_PAGE.DESCRIPTION_LABEL}
            placeholder={APPLICATIONS_UI.EDIT_PAGE.DESCRIPTION_LABEL}
            marginBottom={0}
          />
        </>
      }
      onSubmit={handleSubmit}
      onCancel={onClose}
      submitButtonText={APPLICATIONS_UI.EDIT_PAGE.SAVE}
      submitButtonIcon={<EditOutlined />}
      loading={submitting}
      form={form}
    />
  );
};

EditApplicationPanel.displayName = 'EditApplicationPanel';

export default EditApplicationPanel;
