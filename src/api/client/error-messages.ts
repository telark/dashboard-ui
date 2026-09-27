import axios, { type AxiosError } from 'axios';
import { ERROR_CODES, HTTP_STATUS } from '../../constants';
import { CircuitOpenError, connectivityIssueFrom } from './health-interceptor';

const TIMEOUT_STATUS = 408;
const UNPROCESSABLE_ENTITY = 422;

interface ClassifiedNetwork {
  kind: 'network';
}
interface ClassifiedTimeout {
  kind: 'timeout';
}
interface ClassifiedCircuit {
  kind: 'circuit';
}
interface ClassifiedHttp {
  kind: 'http';
  status: number;
  serverMessage: string | null;
}
interface ClassifiedUnknown {
  kind: 'unknown';
}

type Classified =
  ClassifiedNetwork | ClassifiedTimeout | ClassifiedCircuit | ClassifiedHttp | ClassifiedUnknown;

interface ServerErrorPayload {
  message?: string;
}

const extractServerMessage = (data: AxiosError['response']): string | null => {
  const payload = data?.data as ServerErrorPayload | undefined;
  if (!payload || typeof payload !== 'object') return null;
  const message = payload.message;
  if (typeof message === 'string' && message.trim().length > 0) return message;
  return null;
};

const classifyAxios = (error: AxiosError): Classified => {
  if (error.code === ERROR_CODES.TIMEOUT || error.code === 'ECONNABORTED') {
    return { kind: 'timeout' };
  }
  if (!error.response) {
    return { kind: 'network' };
  }
  return {
    kind: 'http',
    status: error.response.status,
    serverMessage: extractServerMessage(error.response),
  };
};

const classify = (error: Error): Classified => {
  if (error instanceof CircuitOpenError) return { kind: 'circuit' };
  if (axios.isAxiosError(error)) return classifyAxios(error);
  // Thunks reject with a string, so views rebuild a bare Error and lose the
  // original type. Recover the connectivity kinds from the text itself.
  const issue = connectivityIssueFrom(error.message);
  if (issue) return { kind: issue.kind === 'service' ? 'circuit' : 'network' };
  return { kind: 'unknown' };
};

const messageForHttp = (entry: ClassifiedHttp): string => {
  switch (entry.status) {
    case HTTP_STATUS.UNAUTHORIZED:
      return 'Your session expired. Please sign in again.';
    case HTTP_STATUS.FORBIDDEN:
      return "You don't have permission to do this.";
    case HTTP_STATUS.NOT_FOUND:
      return "The item you're looking for doesn't exist.";
    case TIMEOUT_STATUS:
      return 'The server took too long to respond. Try again.';
    case UNPROCESSABLE_ENTITY:
      return entry.serverMessage ?? 'Some of the values you entered are not valid.';
    default:
      if (entry.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        return "Something went wrong on our side. We're looking into it.";
      }
      return 'Something went wrong. Please try again.';
  }
};

export const userFacingMessage = (error: Error): string => {
  const entry = classify(error);
  switch (entry.kind) {
    case 'network':
      return 'Cannot reach the server. Check your connection.';
    case 'timeout':
      return 'The server took too long to respond. Try again.';
    case 'circuit':
      return 'Service is temporarily unavailable. Try again in a moment.';
    case 'http':
      return messageForHttp(entry);
    case 'unknown':
    default:
      return 'Something went wrong. Please try again.';
  }
};
