import React, { useEffect, useState } from 'react';
import { Form, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { APP_ROUTES, Icons, BUTTON_TEXTS } from '../../../../constants';
import { COMPONENT_STYLES } from '../../../../constants/layout/ui';
import Header from '../../../../components/display/sections/Header';
import { GROUPS_CONSTANTS as GC } from '../constants';
import LabeledInput from '../../../../components/display/inputs/LabeledInput';
import LabeledSelect from '../../../../components/display/inputs/LabeledSelect';
import Section from '../../../../components/display/sections/Section';
import { PrimaryButton } from '../../../../components/display/buttons';
import AnimatedPageWrapper from '../../../../components/animation/AnimatedPageWrapper';
import { PageContainer, NotFound } from '../../../../components/shared';
import { RootState, AppDispatch } from '../../../../store';
import { fetchGroupDetailsThunk, updateGroupThunk } from '../store';

const GroupIcon = Icons.Group;

interface EditGroupFormValues {
  name: string;
  description: string;
  category: string;
}

const EditGroup: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { details, loading } = useSelector((state: RootState) => state.groups);
  const [form] = Form.useForm<EditGroupFormValues>();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchGroupDetailsThunk(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (details) {
      form.setFieldsValue({
        name: details.name,
        description: details.description,
        category: details.category,
      });
    }
  }, [details, form]);

  const handleFinish = async (values: EditGroupFormValues) => {
    if (!id) return;
    setSubmitting(true);
    try {
      await dispatch(
        updateGroupThunk({
          id,
          group: {
            name: values.name,
            description: values.description,
            category: values.category,
          },
        }),
      ).unwrap();
      message.success(GC.LABELS.MESSAGES.UPDATED(values.name));
      navigate(`${APP_ROUTES.GROUPS}/${id}/view`);
    } catch {
      message.error('Failed to update group');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Header subtitle={GC.LABELS.EDIT_SUBTITLE} breadcrumbs={[]} icon={<GroupIcon />} />
        <div>Loading...</div>
      </PageContainer>
    );
  }

  if (!details) {
    return <NotFound message={GC.LABELS.NOT_FOUND} />;
  }

  const group = details;

  const breadcrumbs = [
    { label: GC.LABELS.BREADCRUMBS.GROUPS, to: APP_ROUTES.GROUPS },
    { label: group.name },
    { label: GC.LABELS.BREADCRUMBS.EDIT },
  ];

  return (
    <PageContainer>
      <Header subtitle={GC.LABELS.EDIT_SUBTITLE} breadcrumbs={breadcrumbs} icon={<GroupIcon />} />

      <AnimatedPageWrapper>
        <div
          style={{
            ...COMPONENT_STYLES.WORKLOAD_INSTANCES.containerCard,
            padding: 16,
            width: '100%',
          }}
        >
          <Form<EditGroupFormValues> layout="vertical" form={form} onFinish={handleFinish}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 18,
                width: '100%',
              }}
            >
              <Section
                title={GC.LABELS.FORM.SECTION_TITLE}
                subtitle={GC.LABELS.FORM.SECTION_SUBTITLE}
                content={
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    <LabeledInput
                      name="name"
                      label={GC.LABELS.FORM.FIELDS.NAME_LABEL}
                      required
                      placeholder={GC.LABELS.FORM.FIELDS.NAME_PLACEHOLDER}
                      marginBottom={18}
                    />
                    <LabeledInput
                      name="description"
                      label={GC.LABELS.FORM.FIELDS.DESCRIPTION_LABEL}
                      required
                      placeholder={GC.LABELS.FORM.FIELDS.DESCRIPTION_PLACEHOLDER}
                      marginBottom={18}
                    />
                    <LabeledSelect
                      name="category"
                      label={GC.LABELS.FORM.FIELDS.CATEGORY_LABEL}
                      placeholder={GC.LABELS.FORM.FIELDS.CATEGORY_PLACEHOLDER}
                      required
                      options={[
                        { label: 'Engineering', value: 'Engineering' },
                        { label: 'Operations', value: 'Operations' },
                        { label: 'Quality Assurance', value: 'Quality Assurance' },
                        { label: 'Security', value: 'Security' },
                        { label: 'Management', value: 'Management' },
                        { label: 'Support', value: 'Support' },
                      ]}
                      marginBottom={6}
                    />
                  </div>
                }
              />
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Form.Item style={{ marginTop: 0, marginBottom: 0 }}>
                  <PrimaryButton
                    action="Update Group"
                    loading={submitting}
                    loadingLabel={BUTTON_TEXTS.LOADING}
                    onClick={() => form.submit()}
                    icon={<GroupIcon size={16} />}
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </AnimatedPageWrapper>
    </PageContainer>
  );
};

export default EditGroup;
