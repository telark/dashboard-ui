import log from 'loglevel';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { logErrorOnce } from './dedupe';
import { LOG_LEVEL_NAMES } from './levels';
import logger from './logger';

const logged = () => {
  const error = vi.spyOn(log, 'error').mockImplementation(() => undefined);
  return { error, text: () => String(error.mock.lastCall?.[0]) };
};

describe('logger', () => {
  afterEach(() => {
    logger.setLevel(LOG_LEVEL_NAMES.WARN);
  });

  it.each<[string, unknown, string]>([
    ['an error', new Error('boom'), 'boom'],
    ['an object', { code: 7 }, '"code": 7'],
    ['a value', 42, '42'],
  ])('appends %s to the message', (_, error, fragment) => {
    const spy = logged();

    logger.error('failed', error);

    expect(spy.text()).toContain('failed');
    expect(spy.text()).toContain(fragment);
  });

  it('survives an object it cannot stringify', () => {
    const spy = logged();
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;

    logger.error('failed', cyclic);

    expect(spy.text()).toContain('Unable to stringify');
  });

  it.each(['trace', 'debug', 'info', 'warn'] as const)('forwards %s to loglevel', (level) => {
    const spy = vi.spyOn(log, level).mockImplementation(() => undefined);

    logger[level]('message', 'extra');

    expect(spy).toHaveBeenCalledWith(expect.stringContaining('message'), 'extra');
  });

  it('reports the level it was set to', () => {
    logger.setLevel(LOG_LEVEL_NAMES.ERROR);

    expect(logger.getLevel()).toBe(LOG_LEVEL_NAMES.ERROR);
  });

  it('turns every level on and off', () => {
    logger.enableAll();
    expect(logger.getLevel()).toBe(LOG_LEVEL_NAMES.TRACE);

    logger.disableAll();
    expect(logger.getLevel()).toBe(LOG_LEVEL_NAMES.SILENT);
  });
});

describe('logErrorOnce', () => {
  it('logs one error per scope and window, and again once it changes', () => {
    const spy = logged();
    const scope = `scope-${Math.random()}`;

    logErrorOnce(scope, 'failed', new Error('one'));
    logErrorOnce(scope, 'failed', new Error('one'));
    expect(spy.error).toHaveBeenCalledTimes(1);

    logErrorOnce(scope, 'failed', 'two');
    expect(spy.error).toHaveBeenCalledTimes(2);

    logErrorOnce(scope, 'failed', 'two', -1);
    expect(spy.error).toHaveBeenCalledTimes(3);
  });
});
