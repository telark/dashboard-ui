import React, { memo } from 'react';
import { SETTINGS_CONSTANTS } from '../../constants';
import { useProfileUser } from './hooks/useProfileUser';
import { useEditProfile } from './hooks/useEditProfile';
import ProfilePhotoCard from './components/ProfilePhotoCard';
import ProfileDetailsCard from './components/ProfileDetailsCard';
import EditProfilePanel from './components/EditProfilePanel';

const { CONTENT } = SETTINGS_CONSTANTS;

const ProfileSectionContent: React.FC = memo(() => {
  const { currentUser, refetch } = useProfileUser();
  const {
    panelOpen,
    openEditPanel,
    closeEditPanel,
    form,
    submitting,
    hasFormErrors,
    hasChanges,
    handleSubmit,
    handleValuesChange,
    handleFieldsChange,
    initialValues,
    fullnameRules,
    emailRules,
  } = useEditProfile({ currentUser, refetch });

  return (
    <>
      <ProfilePhotoCard user={currentUser} />
      <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
        <ProfileDetailsCard user={currentUser} onEditClick={openEditPanel} />
      </div>
      <EditProfilePanel
        open={panelOpen}
        onClose={closeEditPanel}
        form={form}
        onSubmit={handleSubmit}
        onValuesChange={handleValuesChange}
        onFieldsChange={handleFieldsChange}
        submitting={submitting}
        hasFormErrors={hasFormErrors}
        hasChanges={hasChanges}
        initialValues={initialValues}
        fullnameRules={fullnameRules}
        emailRules={emailRules}
        username={currentUser?.username ?? ''}
      />
    </>
  );
});

ProfileSectionContent.displayName = 'ProfileSectionContent';

export default ProfileSectionContent;
