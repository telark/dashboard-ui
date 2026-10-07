import React from 'react';
import { Tag, Tooltip } from 'antd';
import { CARD_LAYOUT, CARD_MORE_LABEL, TAG_CLASS } from '../../../constants';

// The first `max` tags, then one "+N" pill whose tooltip lists the rest.
const CardTagList: React.FC<{ tags: string[]; max?: number }> = ({
  tags,
  max = CARD_LAYOUT.MAX_TARGET_TAGS,
}) => {
  const hidden = tags.slice(max);

  return (
    <>
      {tags.slice(0, max).map((tag) => (
        <Tag
          key={tag}
          className={`${TAG_CLASS.XSMALL} ${TAG_CLASS.AS_IS} ${TAG_CLASS.TRUNCATE}`}
          title={tag}
        >
          {tag}
        </Tag>
      ))}
      {hidden.length > 0 && (
        <Tooltip title={hidden.join(', ')}>
          <span style={{ display: 'inline-flex' }}>
            <Tag className={`${TAG_CLASS.XSMALL} ${TAG_CLASS.AS_IS}`}>
              {CARD_MORE_LABEL(hidden.length)}
            </Tag>
          </span>
        </Tooltip>
      )}
    </>
  );
};

export default CardTagList;
