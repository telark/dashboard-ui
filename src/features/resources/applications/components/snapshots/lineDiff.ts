export type LineDiffOp = { t: 'equal' | 'add' | 'del'; v: string };

function buildIndexMap(b: string[]): Map<string, number[]> {
  const m = new Map<string, number[]>();
  for (let i = 0; i < b.length; i++) {
    const v = b[i];
    const arr = m.get(v);
    if (arr) arr.push(i);
    else m.set(v, [i]);
  }
  return m;
}

function buildEditPath(a: string[], b: string[]): Array<Map<number, number>> {
  const n = a.length;
  const m = b.length;
  const max = n + m;
  const trace: Array<Map<number, number>> = [];
  const v = new Map<number, number>();
  v.set(1, 0);
  const idx = buildIndexMap(b);

  for (let d = 0; d <= max; d++) {
    const vv = new Map<number, number>();
    for (let k = -d; k <= d; k += 2) {
      const down = k === -d ? -Infinity : (v.get(k - 1) ?? -Infinity) + 1;
      const right = k === d ? -Infinity : (v.get(k + 1) ?? -Infinity);
      let x = down > right ? down : right;
      let y = x - k;
      while (x < n && y < m) {
        const av = a[x];
        const candidates = idx.get(av);
        if (!candidates) break;
        if (b[y] !== av) break;
        x++;
        y++;
      }
      vv.set(k, x);
      if (x >= n && y >= m) {
        trace.push(vv);
        return trace;
      }
    }
    trace.push(vv);
    v.clear();
    for (const [k, x] of vv.entries()) v.set(k, x);
  }
  return trace;
}

export function diffLines(a: string[], b: string[]): LineDiffOp[] {
  const n = a.length;
  const m = b.length;
  const trace = buildEditPath(a, b);
  let x = n;
  let y = m;
  const out: LineDiffOp[] = [];

  for (let d = trace.length - 1; d >= 0; d--) {
    const v = trace[d];
    const k = x - y;
    const prevK =
      k === -d || (k !== d && (v.get(k - 1) ?? -Infinity) < (v.get(k + 1) ?? -Infinity))
        ? k + 1
        : k - 1;
    const prevX = v.get(prevK) ?? 0;
    const prevY = prevX - prevK;

    while (x > prevX && y > prevY) {
      out.push({ t: 'equal', v: a[x - 1] });
      x--;
      y--;
    }

    if (d === 0) break;

    if (x === prevX) {
      out.push({ t: 'add', v: b[y - 1] });
      y--;
    } else {
      out.push({ t: 'del', v: a[x - 1] });
      x--;
    }
  }

  while (x > 0 && y > 0) {
    out.push({ t: 'equal', v: a[x - 1] });
    x--;
    y--;
  }
  while (x > 0) {
    out.push({ t: 'del', v: a[x - 1] });
    x--;
  }
  while (y > 0) {
    out.push({ t: 'add', v: b[y - 1] });
    y--;
  }

  return out.reverse();
}
