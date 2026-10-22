import React, { memo, useEffect, useMemo, useState } from 'react';
import { Input, Typography } from 'antd';
import SettingsCard from '../../../components/SettingsCard';
import { DEFAULT_COLORS, HAIRLINE, FONT_SIZE, SPACING } from '../../../../../constants';
import { ABOUT_SECTION_CONSTANTS } from '../constants';

const { LABELS, LICENSES_LIST } = ABOUT_SECTION_CONSTANTS;

interface LicenseEntry {
  name: string;
  version: string;
  license: string;
}

const rowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: SPACING.MD,
  padding: `${SPACING.SM}px 0`,
  borderBottom: HAIRLINE.BORDER_SUBTLE,
  fontSize: FONT_SIZE.MD,
};

const nameCellStyle: React.CSSProperties = {
  color: DEFAULT_COLORS.TEXT_PRIMARY,
  flex: 1,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const LicensesCard: React.FC = memo(() => {
  const [licenses, setLicenses] = useState<LicenseEntry[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let canceled = false;
    fetch(LICENSES_LIST.JSON_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json() as Promise<LicenseEntry[]>;
      })
      .then((data) => {
        if (!canceled) setLicenses(data);
      })
      .catch(() => {
        if (!canceled) setLoadFailed(true);
      });
    return () => {
      canceled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (licenses == null) return [];
    const query = search.trim().toLowerCase();
    if (query.length === 0) return licenses;
    return licenses.filter((entry) => entry.name.toLowerCase().includes(query));
  }, [licenses, search]);

  return (
    <SettingsCard
      title={LABELS.LICENSES_CARD_TITLE}
      description={LABELS.LICENSES_CARD_DESCRIPTION}
      headerAction={
        <Typography.Link href={LICENSES_LIST.NOTICES_URL} target="_blank" rel="noopener noreferrer">
          {LABELS.LICENSES_FULL_TEXT_LINK}
        </Typography.Link>
      }
    >
      <Input
        allowClear
        placeholder={LABELS.LICENSES_SEARCH_PLACEHOLDER}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: SPACING.MD }}
      />
      {loadFailed ? (
        <div style={{ color: DEFAULT_COLORS.TEXT_MUTED, fontSize: FONT_SIZE.MD }}>
          {LABELS.LICENSES_LOAD_ERROR}
        </div>
      ) : (
        <div>
          {filtered.length === 0 && licenses != null ? (
            <div
              style={{
                color: DEFAULT_COLORS.TEXT_MUTED,
                fontSize: FONT_SIZE.MD,
                padding: `${SPACING.SM}px 0`,
              }}
            >
              {LABELS.LICENSES_EMPTY}
            </div>
          ) : (
            filtered.map((entry) => (
              <div key={`${entry.name}@${entry.version}`} style={rowStyle}>
                <span style={nameCellStyle}>
                  {entry.name}
                  <span style={{ color: DEFAULT_COLORS.TEXT_MUTED }}> {entry.version}</span>
                </span>
                <span style={{ color: DEFAULT_COLORS.TEXT_MUTED, flexShrink: 0 }}>
                  {entry.license}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </SettingsCard>
  );
});

LicensesCard.displayName = 'LicensesCard';

export default LicensesCard;
