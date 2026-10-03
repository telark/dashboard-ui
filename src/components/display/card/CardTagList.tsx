import React from 'react';
import { Tooltip } from 'antd';
import { CARD_LAYOUT, CARD_MORE_LABEL } from '../../../constants';
import RowTag from '../table/RowTag';

// The first `max` tags, then one "+N" pill whose tooltip lists the rest.
const CardTagList: React.FC<{ tags: string[]; max?: number }> = ({
  tags,
  max = CARD_LAYOUT.MAX_TARGET_TAGS,
}) => {
  const hidden = tags.slice(max);

  return (
    <>
      {tags.slice(0, max).map((tag) => (
        <RowTag
          key={tag}
          text={tag}
          capitalize={false}
          fontSize={CARD_LAYOUT.TAG_FONT_SIZE_PX}
          truncate
        />
      ))}
      {hidden.length > 0 && (
        <Tooltip title={hidden.join(', ')}>
          <span style={{ display: 'inline-flex' }}>
            <RowTag
              text={CARD_MORE_LABEL(hidden.length)}
              capitalize={false}
              fontSize={CARD_LAYOUT.TAG_FONT_SIZE_PX}
            />
          </span>
        </Tooltip>
      )}
    </>
  );
};

export default CardTagList;
