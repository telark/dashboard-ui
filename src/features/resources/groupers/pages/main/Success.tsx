import React from 'react';
import { GrouperCard } from '../../components';

interface SuccessProps {
  groupers: any[];
}

const Success: React.FC<SuccessProps> = React.memo(({ groupers }) => {
  return (
    <>
      {groupers.map((grouper, index) => (
        <GrouperCard key={grouper?.name ?? index} {...grouper} />
      ))}
    </>
  );
});

Success.displayName = 'Success';

export default Success;
