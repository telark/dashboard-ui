import React, { useEffect, useState, useRef } from 'react';
import type { Role } from '../../../features/access-and-permissions/roles/models';
import { formatValidity } from '../../../features/access-and-permissions/roles/utils/validity/format';
import { TIME_CONFIGS } from '../../../constants';

interface ValidityDisplayProps {
  validity: Role['validity'];
  record: Role;
}

const ValidityDisplay: React.FC<ValidityDisplayProps> = ({ validity, record }) => {
  const [formattedValidity, setFormattedValidity] = useState(() => formatValidity(validity, record));
  const validityRef = useRef(validity);
  const recordRef = useRef(record);

  // Keep refs in sync with props
  useEffect(() => {
    validityRef.current = validity;
    recordRef.current = record;
  }, [validity, record]);

  // Update every minute
  useEffect(() => {
    const update = () => {
      setFormattedValidity(formatValidity(validityRef.current, recordRef.current));
    };
    update();
    const interval = setInterval(update, TIME_CONFIGS.UPDATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return <span>{formattedValidity}</span>;
};

ValidityDisplay.displayName = 'ValidityDisplay';

export default React.memo(ValidityDisplay);

