import { http, HttpResponse, type JsonBodyType } from 'msw';
import { server } from '../server';

/** Serves a file the app fetches from its own origin, outside the API (a generated JSON, say). */
export const mockStaticAsset = (path: string, body: JsonBodyType, status = 200): void => {
  server.use(http.get(path, () => HttpResponse.json(body, { status })));
};
