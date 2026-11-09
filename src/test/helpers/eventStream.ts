import { http, HttpResponse } from 'msw';
import { server } from '../server';

const encoder = new TextEncoder();

const CONNECTED_BLOCK = ': connected\n\n';

/** Answers `url` with a server-sent stream that stays open, sending blocks on demand. */
export const mockEventStream = (url: string, opening: string = CONNECTED_BLOCK) => {
  const streams: ReadableStreamDefaultController<Uint8Array>[] = [];
  server.use(
    http.get(url, () => {
      const body = new ReadableStream<Uint8Array>({
        start(controller) {
          streams.push(controller);
          controller.enqueue(encoder.encode(opening));
        },
      });
      return new HttpResponse(body, { headers: { 'Content-Type': 'text/event-stream' } });
    }),
  );
  return {
    connections: () => streams.length,
    send: (block: string) => streams.at(-1)?.enqueue(encoder.encode(block)),
    close: () => streams.at(-1)?.close(),
  };
};
