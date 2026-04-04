import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Form, Input, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../../../store';
import { APP_ROUTES } from '../../../../../constants';
import LoadingDetailsView from '../../../../../components/display/views/LoadingDetailsView';
import ErrorView from '../../../../../components/display/views/ErrorView';
import { APPLICATION_DETAILS_CONSTANTS } from '../../constants';
import { useApplicationDetails } from '../../hooks';
import { APPLICATIONS_UI } from '../../constants/texts';
import { CreatePlanLayout, SectionCard } from '../../../../protection-plans/components/create';
import { LabeledInput } from '../../../../../components/display/inputs';
import { updateApplicationThunk } from '../../store';
import type { ApplicationUpdatePayload } from '../../models';

const EditApplicationPage: React.FC = () => {
  const { name: nameParam } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const name = nameParam ?? '';
  const { details, loading, error } = useApplicationDetails(nameParam);

  useEffect(() => {
    if (!details || details.name !== name) return;
    form.setFieldsValue({
      name: details.name,
      displayName: details.displayName,
      description: details.description ?? '',
    });
  }, [details, form, name]);

  const breadcrumbItems = useMemo(
    () => [
      {
        label: APPLICATIONS_UI.BREADCRUMBS.ROOT,
        onClick: () => navigate(APP_ROUTES.APPLICATIONS),
      },
      {
        label: details?.displayName || details?.name || name,
        onClick: () => navigate(APP_ROUTES.APPLICATION_DETAILS.replace(':name', name)),
      },
      { label: APPLICATIONS_UI.BREADCRUMBS.EDIT },
    ],
    [details?.displayName, details?.name, name, navigate],
  );

  const handleFinish = useCallback(
    async (values: unknown) => {
      const v = values as { displayName: string; description?: string };
      const payload: ApplicationUpdatePayload = {
        displayName: v.displayName,
        description: v.description,
      };
      setSubmitting(true);
      try {
        await dispatch(updateApplicationThunk({ name, payload })).unwrap();
        message.success(APPLICATIONS_UI.EDIT_PAGE.SUCCESS_MESSAGE);
        navigate(APP_ROUTES.APPLICATION_DETAILS.replace(':name', name));
      } catch {
        message.error(APPLICATIONS_UI.EDIT_PAGE.ERROR_GENERIC);
      } finally {
        setSubmitting(false);
      }
    },
    [dispatch, name, navigate],
  );

  if (loading && !details) {
    return <LoadingDetailsView />;
  }

  if (error) {
    return (
      <ErrorView error={error} errorMessagePrefix={APPLICATION_DETAILS_CONSTANTS.MESSAGES.ERROR} />
    );
  }

  if (!details) {
    return <LoadingDetailsView />;
  }

  return (
    <CreatePlanLayout
      breadcrumbItems={breadcrumbItems}
      subtitle={APPLICATIONS_UI.EDIT_PAGE.SUBTITLE}
      submitLabel={APPLICATIONS_UI.EDIT_PAGE.SAVE}
      onSubmit={handleFinish}
      form={form}
      submitting={submitting}
    >
      <SectionCard
        title={APPLICATIONS_UI.EDIT_PAGE.SECTION_BASIC}
        description={APPLICATIONS_UI.EDIT_PAGE.SECTION_BASIC_DESC}
      >
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
      </SectionCard>
    </CreatePlanLayout>
  );
};

export default EditApplicationPage;
