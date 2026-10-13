// A hidden tab makes no requests; it polls once on return, so nothing shown is stale.
export const pollWhileVisible = (poll: () => void, intervalMs: number): (() => void) => {
  let timer: ReturnType<typeof setInterval> | undefined;
  const restart = () => {
    clearInterval(timer);
    timer = document.hidden ? undefined : setInterval(poll, intervalMs);
  };
  const onVisibilityChange = () => {
    if (!document.hidden) poll();
    restart();
  };
  restart();
  document.addEventListener('visibilitychange', onVisibilityChange);
  return () => {
    clearInterval(timer);
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
};
