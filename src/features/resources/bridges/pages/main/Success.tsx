import React from 'react';
import { BridgeCard } from '../../components';

interface SuccessProps {
  bridges: any[];
}

const Success: React.FC<SuccessProps> = React.memo(({ bridges }) => {
  return (
    <>
      {bridges.map((bridge, index) => (
        <BridgeCard key={bridge?.name ?? index} {...bridge} />
      ))}
    </>
  );
});

Success.displayName = 'Success';

export default Success;
