import React, { memo, useCallback } from 'react';
import { SETTINGS_CONSTANTS } from '../../constants';
import { useProfileUser } from './hooks/useProfileUser';
import ProfilePhotoCard from './components/ProfilePhotoCard';
import ProfileDetailsCard from './components/ProfileDetailsCard';

const { CONTENT } = SETTINGS_CONSTANTS;

const ProfileSectionContent: React.FC = memo(() => {
  const currentUser = useProfileUser();
  const handleEditProfile = useCallback(() => {}, []);

  return (
    <>
      <ProfilePhotoCard user={currentUser} />
      <div style={{ marginTop: CONTENT.GAP_BETWEEN_CARDS }}>
        <ProfileDetailsCard user={currentUser} onEditClick={handleEditProfile} />
      </div>
    </>
  );
});

ProfileSectionContent.displayName = 'ProfileSectionContent';

export default ProfileSectionContent;
