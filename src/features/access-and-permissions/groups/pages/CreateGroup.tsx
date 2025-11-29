import React, { useMemo } from 'react';
import { Form, Input } from 'antd';
import { Icons, BUTTON_TEXTS } from '../../../../constants';
import { COMPONENT_STYLES } from '../../../../constants/layout/ui';
import Header from '../../../../components/display/sections/Header';
import { GROUPS_CONSTANTS as GC } from '../constants';
import { APP_ROUTES } from '../../../../constants';
import LabeledInput from '../../../../components/display/inputs/LabeledInput';
import LabeledSelect from '../../../../components/display/inputs/LabeledSelect';
import Section from '../../../../components/display/sections/Section';
import { PrimaryButton } from '../../../../components/display/buttons';
import AnimatedPageWrapper from '../../../../components/animation/AnimatedPageWrapper';
import { PageContainer } from '../../../../components/shared';
import { useGroupActions, useGroups } from '../hooks';
import { useCategories } from '../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
import type { GroupFormData } from '../models';
import { mapCategoriesToOptions } from '../../categories/utils';
import { createNameValidator, sanitizeName } from '../../../shared';
import { DEFAULT_NAME_VALIDATION_CONFIG } from '../../../shared/constants';
import type { Group } from '../models';

const GroupIcon = Icons.Group;

const CreateGroup: React.FC = () => {
  const [form] = Form.useForm<GroupFormData>();
  const { handleCreate, submitting } = useGroupActions();
  const { groups } = useGroups();
  const { categories } = useCategories(CATEGORIES_CONSTANTS.SCOPES.GROUPS);

  const categoryOptions = useMemo(() => mapCategoriesToOptions(categories), [categories]);

  const defaultCategoryId = useMemo(() => {
    return categories[0]?.id || '';
  }, [categories]);

  const nameValidationConfig = useMemo(
    () => ({
      ...DEFAULT_NAME_VALIDATION_CONFIG,
      minLength: GC.LABELS.FORM.FIELDS.NAME_VALIDATION.MIN_LENGTH,
      maxLength: GC.LABELS.FORM.FIELDS.NAME_VALIDATION.MAX_LENGTH,
      duplicateErrorMessage: GC.LABELS.FORM.FIELDS.NAME_VALIDATION.DUPLICATE_ERROR,
      invalidCharsErrorMessage: GC.LABELS.FORM.FIELDS.NAME_VALIDATION.INVALID_CHARS_ERROR,
      lengthErrorMessage: GC.LABELS.FORM.FIELDS.NAME_VALIDATION.LENGTH_ERROR,
    }),
    [],
  );

  const nameValidator = useMemo(
    () => createNameValidator(groups, (group: Group) => group.name, nameValidationConfig, false),
    [groups, nameValidationConfig],
  );

  const normalizeName = useMemo(
    () => (value: string) => sanitizeName(value, nameValidationConfig),
    [nameValidationConfig],
  );

  const handleFinish = async (values: GroupFormData) => {
    await handleCreate(values);
  };

  return (
    <PageContainer>
      <Header
        subtitle={GC.LABELS.CREATE_SUBTITLE}
        breadcrumbs={[
          { label: GC.LABELS.BREADCRUMBS.GROUPS, to: APP_ROUTES.GROUPS },
          { label: GC.LABELS.BREADCRUMBS.CREATE },
        ]}
        icon={<GroupIcon />}
      />

      <AnimatedPageWrapper>
        <div
          style={{
            ...COMPONENT_STYLES.WORKLOAD_INSTANCES.containerCard,
            padding: 16,
            width: '100%',
          }}
        >
          <Form<GroupFormData>
            layout="vertical"
            form={form}
            onFinish={handleFinish}
            initialValues={{
              name: '',
              description: '',
              categoryID: defaultCategoryId,
            }}
          >
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
                    <Form.Item
                      name="name"
                      label={GC.LABELS.FORM.FIELDS.NAME_LABEL}
                      required
                      normalize={normalizeName}
                      rules={[
                        {
                          required: true,
                          message: `Please enter ${GC.LABELS.FORM.FIELDS.NAME_LABEL.toLowerCase()}`,
                        },
                        { validator: nameValidator },
                      ]}
                      style={{ marginBottom: 18 }}
                      className="form-item-compact"
                      validateTrigger="onChange"
                    >
                      <Input placeholder={GC.LABELS.FORM.FIELDS.NAME_PLACEHOLDER} allowClear />
                    </Form.Item>
                    <LabeledInput
                      name="description"
                      label={GC.LABELS.FORM.FIELDS.DESCRIPTION_LABEL}
                      required
                      placeholder={GC.LABELS.FORM.FIELDS.DESCRIPTION_PLACEHOLDER}
                      marginBottom={18}
                    />
                    <LabeledSelect
                      name="categoryID"
                      label={GC.LABELS.FORM.FIELDS.CATEGORY_LABEL}
                      placeholder={GC.LABELS.FORM.FIELDS.CATEGORY_PLACEHOLDER}
                      required
                      options={categoryOptions}
                      marginBottom={6}
                    />
                  </div>
                }
              />
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Form.Item style={{ marginTop: 0, marginBottom: 0 }}>
                  <PrimaryButton
                    action="Create Group"
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

export default CreateGroup;
