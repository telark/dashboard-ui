import { http, HttpResponse } from 'msw';
import { waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SESSION_CHECK_EVENT } from '../../constants';
import { mockEventStream } from '../../test/helpers/eventStream';
import { server } from '../../test/server';
import logger from '../../logging';
import { keepEventStream } from './eventStream';

const URL = '/stream-under-test';

describe('keepEventStream', () => {
  let stop: AbortController | undefined;
  afterEach(() => stop?.abort());

  const follow = () => {
    const controller = new AbortController();
    stop = controller;
    const onEvent = vi.fn<(name: string, data: string) => void>();
    const onConnected = vi.fn<(connected: boolean) => void>();
    const running = keepEventStream(URL, { onEvent, onConnected }, controller.signal);
    return { controller, onEvent, onConnected, running };
  };

  it('parses events and counts as connected once the server says so', async () => {
    const stream = mockEventStream(URL);
    const { controller, onEvent, onConnected, running } = follow();

    await waitFor(() => expect(onConnected).toHaveBeenCalledWith(true));
    stream.send('event: changed\ndata: one\ndata: two\n\n');
    stream.send('data: no event name\n\nevent: no-data\n\nevent: crlf\r\ndata: three\r\n\r\n');

    await waitFor(() => expect(onEvent).toHaveBeenCalledWith('crlf', 'three'));
    expect(onEvent).toHaveBeenCalledTimes(2);
    expect(onEvent).toHaveBeenCalledWith('changed', 'one\ntwo');

    controller.abort();
    await running;
  });

  it.each([401, 403])('stops and asks for a session check on a %i', async (status) => {
    server.use(http.get(URL, () => new HttpResponse(null, { status })));
    const heard = vi.fn();
    globalThis.addEventListener(SESSION_CHECK_EVENT, heard, { once: true });
    const warn = vi.spyOn(logger, 'warn');

    const { onConnected, running } = follow();

    await running;
    expect(heard).toHaveBeenCalledTimes(1);
    expect(onConnected).toHaveBeenCalledWith(false);
    expect(warn).toHaveBeenCalledWith(expect.anything(), URL, status);
  });

  it('reconnects after a refused open, and stops on abort', async () => {
    const stream = mockEventStream(URL);
    server.use(http.get(URL, () => new HttpResponse(null, { status: 500 }), { once: true }));
    vi.spyOn(Math, 'random').mockReturnValue(0);

    const { controller, onConnected, running } = follow();

    await waitFor(() => expect(onConnected).toHaveBeenCalledWith(false));
    await waitFor(() => expect(onConnected).toHaveBeenCalledWith(true));
    expect(stream.connections()).toBe(1);

    controller.abort();
    await running;
  });

  it('reports a failed connection and ends cleanly when aborted while waiting', async () => {
    server.use(http.get(URL, () => HttpResponse.error()));
    const warn = vi.spyOn(logger, 'warn');

    const { controller, onConnected, running } = follow();

    await waitFor(() => expect(onConnected).toHaveBeenCalledWith(false));
    expect(warn).toHaveBeenCalled();
    controller.abort();
    await expect(running).resolves.toBeUndefined();
  });

  it('counts a stream that ended as disconnected', async () => {
    const stream = mockEventStream(URL);
    const { controller, onConnected, running } = follow();

    await waitFor(() => expect(onConnected).toHaveBeenCalledWith(true));
    stream.close();

    await waitFor(() => expect(onConnected).toHaveBeenCalledWith(false));
    controller.abort();
    await running;
  });
});
