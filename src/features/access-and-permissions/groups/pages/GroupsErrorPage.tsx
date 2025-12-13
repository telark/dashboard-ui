import React, { memo } from 'react';

interface GroupsErrorPageProps {
  error: string;
}

const GroupsErrorPage: React.FC<GroupsErrorPageProps> = memo(({ error }) => {
  return (
    <div
      style={{
        background: '#fff',
        minHeight: 'calc(100vh - 60px)',
        padding: '48px 32px 32px',
        marginTop: '60px',
      }}
    >
      <div>Error: {error}</div>
    </div>
  );
});

GroupsErrorPage.displayName = 'GroupsErrorPage';

export default GroupsErrorPage;
