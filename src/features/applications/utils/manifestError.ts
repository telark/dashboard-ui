import { APPLICATIONS_UI } from '../constants';

const UI = APPLICATIONS_UI.SECTIONS.SNAPSHOTS;
const NOT_FOUND_STATUS = '404';

export interface ManifestErrorCopy {
  title: string;
  description: string;
  /** Raw message from the API layer, kept for the details disclosure. */
  detail: string;
  notFound: boolean;
}

/**
 * Turns the transport error ("Request failed with status code 404") into copy a
 * user can act on. The raw text is preserved rather than dropped, so support and
 * developers can still see what actually failed.
 */
export function getManifestErrorCopy(rawError: string): ManifestErrorCopy {
  const notFound = rawError.includes(NOT_FOUND_STATUS);
  return {
    title: notFound ? UI.MANIFEST_NOT_FOUND_TITLE : UI.MANIFEST_ERROR_TITLE,
    description: notFound ? UI.MANIFEST_NOT_FOUND_DESCRIPTION : UI.MANIFEST_ERROR_DESCRIPTION,
    detail: rawError,
    notFound,
  };
}
