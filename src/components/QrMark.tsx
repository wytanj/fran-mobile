import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../theme';

/** Prototype QR — no native generator. Pattern is derived from the id string. */
export function QrMark({ value, size }: { value: string; size: number }) {
  const cells = 21;
  const bits: boolean[] = [];
  for (let i = 0; i < cells * cells; i++) {
    const c = value.charCodeAt(i % value.length) + i * 7;
    bits.push(c % 3 !== 0);
  }
  const inFinder = (r: number, c: number, rr: number, cc: number) =>
    r >= rr && r < rr + 7 && c >= cc && c < cc + 7;
  const isFinder = (r: number, c: number) =>
    inFinder(r, c, 0, 0) || inFinder(r, c, 0, cells - 7) || inFinder(r, c, cells - 7, 0);
  const finderOn = (r: number, c: number) => {
    const local = (rr: number, cc: number) => {
      const lr = r - rr;
      const lc = c - cc;
      const ring = lr === 0 || lr === 6 || lc === 0 || lc === 6;
      const core = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
      return ring || core;
    };
    if (inFinder(r, c, 0, 0)) return local(0, 0);
    if (inFinder(r, c, 0, cells - 7)) return local(0, cells - 7);
    if (inFinder(r, c, cells - 7, 0)) return local(cells - 7, 0);
    return false;
  };

  return (
    <View style={[styles.box, { width: size, height: size }]}>
      {Array.from({ length: cells }).map((_, r) => (
        <View key={r} style={styles.row}>
          {Array.from({ length: cells }).map((__, c) => {
            const on = isFinder(r, c) ? finderOn(r, c) : bits[r * cells + c];
            return (
              <View
                key={c}
                style={[styles.cell, { backgroundColor: on ? colors.ink : colors.white }]}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.white, overflow: 'hidden' },
  row: { flex: 1, flexDirection: 'row' },
  cell: { flex: 1 },
});
