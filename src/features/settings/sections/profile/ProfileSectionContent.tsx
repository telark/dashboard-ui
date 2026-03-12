import React, { memo, useCallback } from 'react';
import { message } from 'antd';
import { SETTINGS_CONSTANTS } from '../../constants';
import { useProfileUser } from './hooks/useProfileUser';
import { useEditProfile } from './hooks/useEditProfile';
import ProfilePhotoCard from './components/ProfilePhotoCard';
import ProfileDetailsCard from './components/ProfileDetailsCard';
import EditProfilePanel from './components/EditProfilePanel';
import { updateUser } from '../../../access-and-permissions/users/clients';
import { setCurrentUser } from '../../../auth/utils/session/user';
import { PROFILE_SECTION_CONSTANTS } from './constants';
import type { UserAvatar } from '../../../access-and-permissions/users/models';

const { CONTENT } = SETTINGS_CONSTANTS;
const { LABELS } = PROFILE_SECTION_CONSTANTS;

const ProfileSectionContent: React.FC = memo(() => {
  const { currentUser, refetch } = useProfileUser();
  const handleAvatarChange = useCallback(
    async (avatar: UserAvatar) => {
      if (!currentUser?.id) return;
      try {
        const response = await updateUser(currentUser.id, { avatar });
        if (response?.data) {
          setCurrentUser(response.data);
          await refetch(response.data);
          message.success(LABELS.AVATAR_UPDATE_SUCCESS);
        } else {
          message.error(LABELS.AVATAR_UPDATE_ERROR);
        }
      } catch {
        message.error(LABELS.AVATAR_UPDATE_ERROR);
      }
    },
    [currentUser, refetch],
  );
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
      <ProfilePhotoCard user={currentUser} onAvatarChange={handleAvatarChange} />
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
