import React from 'react';
import { Form } from 'antd';
import Section from '../../sections/Section';
import AnimationWrapper from './AnimationWrapper';
import { BUTTON_TEXTS, SLIDE_OUT } from '../../../../constants';
import type { SlideOutPanelProps } from '../../../../interfaces/layout/panels';
import { useSlideOutPanelForm } from '../../../../hooks/panel';
import { PanelFooter } from '../shared';

const SlideOutPanel: React.FC<SlideOutPanelProps> = React.memo(
  ({
    open,
    onClose,
    title,
    subtitle,
    sectionTitle,
    sectionSubtitle,
    formContent,
    contentOnly = false,
    onSubmit = async () => {},
    onCancel = () => {},
    submitButtonText = '',
    submitButtonIcon,
    loading = false,
    disabled = false,
    initialValues = {},
    cancelButtonText = 'Cancel',
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
    });

    if (contentOnly) {
      return (
        <AnimationWrapper
          open={open}
          onClose={onClose}
          title={title}
          subtitle={subtitle}
          width={width}
          offsetX={offsetX}
          headerExtra={headerExtra}
        >
          {formContent}
        </AnimationWrapper>
      );
    }

    return (
      <AnimationWrapper
        open={open}
        onClose={onClose}
        title={title}
        subtitle={subtitle}
        width={width}
        offsetX={offsetX}
        headerExtra={headerExtra}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={initialValues}
          onValuesChange={onValuesChange}
          onFieldsChange={onFieldsChange}
          style={SLIDE_OUT.FORM}
        >
          <div style={SLIDE_OUT.FORM_CONTENT}>
            {sectionTitle ? (
              <Section title={sectionTitle} subtitle={sectionSubtitle} content={formContent} />
            ) : (
              formContent
            )}
          </div>

          <PanelFooter
            onCancel={handleCancel}
            onPrimary={() => form.submit()}
            cancelLabel={cancelButtonText}
            primaryLabel={submitButtonText}
            primaryLoading={loading}
            primaryLoadingLabel={BUTTON_TEXTS.LOADING}
            primaryDisabled={disabled || loading}
            primaryIcon={submitButtonIcon}
          />
        </Form>
      </AnimationWrapper>
    );
  },
);

SlideOutPanel.displayName = 'SlideOutPanel';

export default SlideOutPanel;
