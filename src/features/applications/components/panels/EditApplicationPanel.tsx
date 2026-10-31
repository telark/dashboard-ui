import React from 'react';
import { Form, Input } from 'antd';
import type { FormInstance } from 'antd';
import { SlideOutPanel } from '../../../../components/display/panels/slide-out';
import LabeledInput from '../../../../components/display/inputs/LabeledInput';
import { BUTTON_TEXTS, INPUT_LIMITS, SPACING } from '../../../../constants';
import { textChanged } from '../../../shared';
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
  const displayName = Form.useWatch('displayName', form);
  const description = Form.useWatch('description', form);
  const hasChanges =
    textChanged(application?.displayName, displayName) ||
    textChanged(application?.description, description);

  if (!application) {
    return null;
  }

  return (
    <SlideOutPanel
      open={open}
      onClose={onClose}
      title={APPLICATIONS_UI.EDIT_PAGE.PANEL_TITLE}
      formContent={
        <>
          <Form.Item
            name="name"
            label={APPLICATIONS_UI.EDIT_PAGE.NAME_LABEL}
            style={{ marginBottom: SPACING.MD }}
          >
            <Input disabled />
          </Form.Item>
          <LabeledInput
            name="displayName"
            label={APPLICATIONS_UI.EDIT_PAGE.DISPLAY_NAME_LABEL}
            maxLength={INPUT_LIMITS.APP_DISPLAY_NAME.MAX}
            placeholder={APPLICATIONS_UI.EDIT_PAGE.DISPLAY_NAME_LABEL}
            required
            marginBottom={12}
          />
          <LabeledInput
            name="description"
            label={APPLICATIONS_UI.EDIT_PAGE.DESCRIPTION_LABEL}
            maxLength={INPUT_LIMITS.APP_DESCRIPTION.MAX}
            placeholder={APPLICATIONS_UI.EDIT_PAGE.DESCRIPTION_LABEL}
            marginBottom={0}
          />
        </>
      }
      onSubmit={handleSubmit}
      onCancel={onClose}
      submitButtonText={BUTTON_TEXTS.SAVE_CHANGES}
      loading={submitting}
      disabled={!hasChanges}
      form={form}
    />
  );
};

EditApplicationPanel.displayName = 'EditApplicationPanel';

export default EditApplicationPanel;
