import React from 'react';
import { Form } from 'antd';
import Section from '../../sections/Section';
import AnimationWrapper from './AnimationWrapper';
import { BUTTON_TEXTS, SLIDE_OUT } from '../../../../constants';
import type { SlideOutPanelProps } from '../../../../interfaces/layout/panels';
import { useSlideOutPanelForm } from '../../../../hooks/panel';

const SlideOutPanel: React.FC<SlideOutPanelProps> = React.memo(
  ({
    open,
    onClose,
    title,
    sectionTitle,
    formContent,
    contentOnly = false,
    onSubmit = async () => {},
    onCancel = () => {},
    submitButtonText = '',
    submitButtonIcon,
    loading = false,
    disabled = false,
    initialValues = {},
    cancelButtonText = BUTTON_TEXTS.CANCEL,
    width = 480,
    offsetX = 0,
    headerExtra,
    form: externalForm,
    onValuesChange,
    onFieldsChange,
  }) => {
    const { form, handleFinish, handleCancel } = useSlideOutPanelForm({
      open,
      initialValues,
      onSubmit,
      onClose,
      onCancel,
      form: externalForm,
      skip: contentOnly,
    });

    if (contentOnly) {
      return (
        <AnimationWrapper
          open={open}
          onClose={onClose}
          title={title}
          width={width}
          offsetX={offsetX}
          headerExtra={headerExtra}
        >
          {formContent}
        </AnimationWrapper>
      );
    }

    return (
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues}
        onValuesChange={onValuesChange}
        onFieldsChange={onFieldsChange}
      >
        <AnimationWrapper
          open={open}
          onClose={onClose}
          title={title}
          width={width}
          offsetX={offsetX}
          headerExtra={headerExtra}
          footer={{
            onCancel: handleCancel,
            onPrimary: () => form.submit(),
            cancelLabel: cancelButtonText,
            primaryLabel: submitButtonText,
            primaryLoading: loading,
            primaryLoadingLabel: BUTTON_TEXTS.LOADING,
            primaryDisabled: disabled || loading,
            primaryIcon: submitButtonIcon,
          }}
        >
          <div style={SLIDE_OUT.FORM_CONTENT}>
            {sectionTitle ? <Section title={sectionTitle} content={formContent} /> : formContent}
          </div>
        </AnimationWrapper>
      </Form>
    );
  },
);

SlideOutPanel.displayName = 'SlideOutPanel';

export default SlideOutPanel;
