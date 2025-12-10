import React from 'react';
import { Form } from 'antd';
import { PrimaryButton } from '../../buttons';
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
    subtitle,
    sectionTitle,
    sectionSubtitle,
    formContent,
    onSubmit,
    onCancel,
    submitButtonText,
    submitButtonIcon,
    loading = false,
    disabled = false,
    initialValues = {},
    cancelButtonText = 'Cancel',
    width = 480,
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

    return (
      <AnimationWrapper
        open={open}
        onClose={onClose}
        title={title}
        subtitle={subtitle}
        width={width}
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

          {/* Footer Actions */}
          <div style={SLIDE_OUT.FOOTER}>
            <button
              type="button"
              onClick={handleCancel}
              style={SLIDE_OUT.CANCEL_BUTTON}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = SLIDE_OUT.CANCEL_BUTTON_HOVER_BACKGROUND;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = SLIDE_OUT.CANCEL_BUTTON_DEFAULT_BACKGROUND;
              }}
            >
              {cancelButtonText}
            </button>
            <PrimaryButton
              action={submitButtonText}
              loading={loading}
              loadingLabel={BUTTON_TEXTS.LOADING}
              onClick={() => form.submit()}
              icon={submitButtonIcon}
              disabled={disabled || loading}
            />
          </div>
        </Form>
      </AnimationWrapper>
    );
  },
);

SlideOutPanel.displayName = 'SlideOutPanel';

export default SlideOutPanel;
