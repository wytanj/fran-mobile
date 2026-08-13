import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';
import { colors } from '../theme';

/**
 * Fran icon set — drawn for this brand rather than borrowed.
 *
 * The wordmark is heavy, lowercase and geometric with fat rounded terminals,
 * so the glyphs follow the same rules:
 *   · 24pt grid, 2.6 stroke, round caps and joins
 *   · two or three elements per glyph, never more
 *   · solid fills where a shape should carry weight
 *   · one shared vocabulary — a teardrop, a rounded diamond, a circle — reused
 *     across glyphs so the set reads as a family instead of a collection
 *
 * Selection is signalled by colour and the tab capsule, so there is one glyph
 * per concept: no outline/filled pairs to keep in sync.
 */

const WEIGHT = 2.6;
/** Lighter weight for detail inside an already-stroked container */
const WEIGHT_INNER = 2.2;

/**
 * Optical sizing. The grid is fixed at 24, so a glyph rendered at 12pt halves
 * its stroke and the inner detail turns to mush. Small renders get a heavier
 * relative stroke to hold their weight.
 */
function weightsFor(size: number) {
  const scale = size < 15 ? 1.32 : size < 19 ? 1.14 : 1;
  return { w: WEIGHT * scale, wi: WEIGHT_INNER * scale };
}

type Paint = { color: string; w: number; wi: number };

const line = (c: string, w: number) =>
  ({
    stroke: c,
    strokeWidth: w,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    fill: 'none',
  }) as const;

const solid = (c: string) => ({ fill: c }) as const;

/** Teardrop, point up — flame, droplet */
const DROP_UP =
  'M12 2.8C12 2.8 19.2 9.9 19.2 14.6C19.2 18.6 16 21.4 12 21.4C8 21.4 4.8 18.6 4.8 14.6C4.8 9.9 12 2.8 12 2.8Z';
/** Same drop inverted — map pin */
const DROP_DOWN =
  'M12 21.2C12 21.2 4.8 14.1 4.8 9.4C4.8 5.4 8 2.6 12 2.6C16 2.6 19.2 5.4 19.2 9.4C19.2 14.1 12 21.2 12 21.2Z';
/** Two opposite corners pulled to a point */
const LEAF = 'M4.4 19.6C4.4 11.2 11.2 4.4 19.6 4.4C19.6 12.8 12.8 19.6 4.4 19.6Z';
/** Four-point spark with pinched waists */
const SPARK =
  'M12 2.4C12.7 8.3 15.7 11.3 21.6 12C15.7 12.7 12.7 15.7 12 21.6C11.3 15.7 8.3 12.7 2.4 12C8.3 11.3 11.3 8.3 12 2.4Z';
const STAR =
  'M12 2.8L14.7 9.1L21.5 9.7L16.4 14.2L17.9 20.9L12 17.3L6.1 20.9L7.6 14.2L2.5 9.7L9.3 9.1Z';

/** Shared face scaffold for the satisfaction scale */
function Face({ color, w, mouth }: Omit<Paint, 'wi'> & { mouth: React.ReactNode }) {
  return (
    <>
      <Circle cx={12} cy={12} r={8.7} {...line(color, w)} />
      <Circle cx={9} cy={9.9} r={1.3} {...solid(color)} />
      <Circle cx={15} cy={9.9} r={1.3} {...solid(color)} />
      {mouth}
    </>
  );
}

const GLYPHS = {
  // ─── Navigation ────────────────────────────────────────────────────────────
  /** Aperture — a lens ring with its needle */
  discover: ({ color, w, wi }: Paint) => (
    <>
      <Circle cx={12} cy={12} r={8.7} {...line(color, w)} />
      <Line x1={8.6} y1={15.4} x2={15.4} y2={8.6} {...line(color, w)} />
      <Circle cx={12} cy={12} r={2.2} {...solid(color)} />
    </>
  ),
  /** Glow — the beauty-profile spark */
  glow: ({ color, w, wi }: Paint) => (
    <>
      <Path d={SPARK} {...solid(color)} />
      <Circle cx={19.6} cy={4.4} r={1.7} {...solid(color)} />
    </>
  ),
  /** Ticket, tear line and all — the motif the voucher cards are built on */
  ticket: ({ color, w, wi }: Paint) => (
    <>
      <Rect x={2.6} y={6.4} width={18.8} height={11.2} rx={3.6} {...line(color, w)} />
      <Circle cx={15.4} cy={9.4} r={0.95} {...solid(color)} />
      <Circle cx={15.4} cy={12} r={0.95} {...solid(color)} />
      <Circle cx={15.4} cy={14.6} r={0.95} {...solid(color)} />
    </>
  ),
  person: ({ color, w, wi }: Paint) => (
    <>
      <Circle cx={12} cy={8.4} r={3.6} {...solid(color)} />
      <Path d="M4.6 20.6C4.6 16.5 8 14.2 12 14.2C16 14.2 19.4 16.5 19.4 20.6" {...line(color, w)} />
    </>
  ),
  heart: ({ color, w, wi }: Paint) => (
    <Path
      d="M12 20.2C12 20.2 4 14.4 4 8.9C4 6.2 6.1 4.4 8.5 4.4C10.1 4.4 11.3 5.2 12 6.5C12.7 5.2 13.9 4.4 15.5 4.4C17.9 4.4 20 6.2 20 8.9C20 14.4 12 20.2 12 20.2Z"
      {...solid(color)}
    />
  ),
  book: ({ color, w, wi }: Paint) => (
    <>
      <Path d="M5 5.2C5 5.2 8.2 4.2 12 5.4C15.8 4.2 19 5.2 19 5.2V18.8C19 18.8 15.8 17.8 12 19C8.2 17.8 5 18.8 5 18.8V5.2Z" {...line(color, w)} />
      <Line x1={12} y1={5.6} x2={12} y2={18.8} {...line(color, wi)} />
    </>
  ),

  // ─── Rewards ───────────────────────────────────────────────────────────────
  /** Points — a fat rounded diamond, the set's anchor shape */
  gem: ({ color, w, wi }: Paint) => (
    <Rect
      x={5.35}
      y={5.35}
      width={13.3}
      height={13.3}
      rx={3.5}
      transform="rotate(45 12 12)"
      {...solid(color)}
    />
  ),
  flame: ({ color, w, wi }: Paint) => <Path d={DROP_UP} {...solid(color)} />,
  droplet: ({ color, w, wi }: Paint) => (
    <>
      <Path d={DROP_UP} {...line(color, w)} />
      <Circle cx={9.7} cy={15.6} r={1.8} {...solid(color)} />
    </>
  ),
  /** Streak freeze — three bars, no fussy crystal detail */
  snowflake: ({ color, w, wi }: Paint) => (
    <>
      <Line x1={4.2} y1={12} x2={19.8} y2={12} {...line(color, w)} />
      <Line x1={8.1} y1={5.25} x2={15.9} y2={18.75} {...line(color, w)} />
      <Line x1={15.9} y1={5.25} x2={8.1} y2={18.75} {...line(color, w)} />
    </>
  ),
  gift: ({ color, w, wi }: Paint) => (
    <>
      <Circle cx={8.9} cy={6.6} r={2.5} {...line(color, w)} />
      <Circle cx={15.1} cy={6.6} r={2.5} {...line(color, w)} />
      <Rect x={3.6} y={9.4} width={16.8} height={11} rx={3} {...line(color, w)} />
      <Line x1={12} y1={9.4} x2={12} y2={20.4} {...line(color, w)} />
    </>
  ),
  /** Tag — the gem outlined, with an eyelet */
  tag: ({ color, w, wi }: Paint) => (
    <>
      <Rect
        x={6.2}
        y={6.2}
        width={11.6}
        height={11.6}
        rx={3.2}
        transform="rotate(45 12 12)"
        {...line(color, w)}
      />
      <Circle cx={15.2} cy={8.8} r={1.7} {...solid(color)} />
    </>
  ),

  // ─── Beauty categories ─────────────────────────────────────────────────────
  /** Lipstick, tilted — reads as beauty retail, not a generic palette */
  lipstick: ({ color, w, wi }: Paint) => (
    <>
      <Rect
        x={9.5}
        y={3.2}
        width={5.2}
        height={8.2}
        rx={2.2}
        transform="rotate(13 12 8)"
        {...solid(color)}
      />
      <Rect x={8.1} y={11.2} width={7.8} height={2.1} rx={1.05} {...solid(color)} />
      <Rect x={8.7} y={13.3} width={6.6} height={8.1} rx={1.9} {...solid(color)} />
    </>
  ),
  comb: ({ color, w, wi }: Paint) => (
    <>
      <Rect x={3.6} y={5.4} width={16.8} height={3.4} rx={1.7} {...solid(color)} />
      {[5.2, 9.0, 12.8, 16.6].map((x) => (
        <Rect key={x} x={x} y={8.8} width={2.6} height={7.2} rx={1.3} {...solid(color)} />
      ))}
    </>
  ),
  leaf: ({ color, w, wi }: Paint) => <Path d={LEAF} {...solid(color)} />,

  // ─── Commerce ──────────────────────────────────────────────────────────────
  receipt: ({ color, w, wi }: Paint) => (
    <>
      <Rect x={5.2} y={2.6} width={13.6} height={18.8} rx={3.2} {...line(color, w)} />
      <Line x1={8.6} y1={8.4} x2={15.4} y2={8.4} {...line(color, wi)} />
      <Line x1={8.6} y1={12} x2={15.4} y2={12} {...line(color, wi)} />
      <Circle cx={15.6} cy={17.2} r={1.6} {...solid(color)} />
      <Line x1={8.6} y1={17.2} x2={11.6} y2={17.2} {...line(color, wi)} />
    </>
  ),
  document: ({ color, w, wi }: Paint) => (
    <>
      <Rect x={5.2} y={2.6} width={13.6} height={18.8} rx={3.2} {...line(color, w)} />
      <Line x1={8.6} y1={8} x2={15.4} y2={8} {...line(color, wi)} />
      <Line x1={8.6} y1={12} x2={15.4} y2={12} {...line(color, wi)} />
      <Line x1={8.6} y1={16} x2={15.4} y2={16} {...line(color, wi)} />
    </>
  ),
  store: ({ color, w, wi }: Paint) => (
    <>
      <Path d="M2.6 10.2L5.6 4.6H18.4L21.4 10.2" {...line(color, w)} />
      <Rect x={4.2} y={10.2} width={15.6} height={10.4} rx={2.6} {...line(color, w)} />
    </>
  ),
  /** The drop again, inverted — a pin that belongs to the same family */
  pin: ({ color, w, wi }: Paint) => (
    <>
      <Path d={DROP_DOWN} {...line(color, w)} />
      <Circle cx={12} cy={9.4} r={2.3} {...solid(color)} />
    </>
  ),
  qr: ({ color, w, wi }: Paint) => (
    <>
      <Rect x={2.6} y={2.6} width={7.4} height={7.4} rx={2.2} {...line(color, wi)} />
      <Rect x={14} y={2.6} width={7.4} height={7.4} rx={2.2} {...line(color, wi)} />
      <Rect x={2.6} y={14} width={7.4} height={7.4} rx={2.2} {...line(color, wi)} />
      <Rect x={14} y={14} width={3.2} height={3.2} rx={1} {...solid(color)} />
      <Rect x={18.2} y={18.2} width={3.2} height={3.2} rx={1} {...solid(color)} />
    </>
  ),
  phone: ({ color, w, wi }: Paint) => (
    <>
      <Rect x={6.6} y={2.6} width={10.8} height={18.8} rx={3.2} {...line(color, w)} />
      <Rect x={10} y={5.6} width={4} height={1.8} rx={0.9} {...solid(color)} />
      <Circle cx={12} cy={17.8} r={1.5} {...solid(color)} />
    </>
  ),

  // ─── Chrome ────────────────────────────────────────────────────────────────
  check: ({ color, w, wi }: Paint) => <Path d="M4.9 12.9L9.8 17.8L19.1 6.6" {...line(color, w)} />,
  checkCircle: ({ color, w, wi }: Paint) => (
    <>
      <Circle cx={12} cy={12} r={8.7} {...line(color, w)} />
      <Path d="M7.9 12.4L10.9 15.4L16.1 9" {...line(color, wi)} />
    </>
  ),
  chevronRight: ({ color, w, wi }: Paint) => <Path d="M9.6 4.9L16.7 12L9.6 19.1" {...line(color, w)} />,
  chevronLeft: ({ color, w, wi }: Paint) => (
    <G transform="rotate(180 12 12)">
      <Path d="M9.6 4.9L16.7 12L9.6 19.1" {...line(color, w)} />
    </G>
  ),
  chevronDown: ({ color, w, wi }: Paint) => (
    <G transform="rotate(90 12 12)">
      <Path d="M9.6 4.9L16.7 12L9.6 19.1" {...line(color, w)} />
    </G>
  ),
  chevronUp: ({ color, w, wi }: Paint) => (
    <G transform="rotate(-90 12 12)">
      <Path d="M9.6 4.9L16.7 12L9.6 19.1" {...line(color, w)} />
    </G>
  ),
  arrowRight: ({ color, w, wi }: Paint) => (
    <>
      <Line x1={3.8} y1={12} x2={19} y2={12} {...line(color, w)} />
      <Path d="M14.4 7.4L19.6 12L14.4 16.6" {...line(color, w)} />
    </>
  ),
  plus: ({ color, w, wi }: Paint) => (
    <>
      <Line x1={12} y1={5} x2={12} y2={19} {...line(color, w)} />
      <Line x1={5} y1={12} x2={19} y2={12} {...line(color, w)} />
    </>
  ),
  minus: ({ color, w, wi }: Paint) => <Line x1={5} y1={12} x2={19} y2={12} {...line(color, w)} />,
  close: ({ color, w, wi }: Paint) => (
    <>
      <Line x1={6.4} y1={6.4} x2={17.6} y2={17.6} {...line(color, w)} />
      <Line x1={17.6} y1={6.4} x2={6.4} y2={17.6} {...line(color, w)} />
    </>
  ),
  closeCircle: ({ color, w, wi }: Paint) => (
    <>
      <Circle cx={12} cy={12} r={8.7} {...line(color, w)} />
      <Line x1={9} y1={9} x2={15} y2={15} {...line(color, wi)} />
      <Line x1={15} y1={9} x2={9} y2={15} {...line(color, wi)} />
    </>
  ),
  clock: ({ color, w, wi }: Paint) => (
    <>
      <Circle cx={12} cy={12} r={8.7} {...line(color, w)} />
      <Path d="M12 7.2V12L15.6 13.9" {...line(color, wi)} />
    </>
  ),
  alert: ({ color, w, wi }: Paint) => (
    <>
      <Circle cx={12} cy={12} r={8.7} {...line(color, w)} />
      <Line x1={12} y1={6.9} x2={12} y2={13.3} {...line(color, wi)} />
      <Circle cx={12} cy={17} r={1.35} {...solid(color)} />
    </>
  ),
  info: ({ color, w, wi }: Paint) => (
    <>
      <Circle cx={12} cy={12} r={8.7} {...line(color, w)} />
      <Circle cx={12} cy={7} r={1.35} {...solid(color)} />
      <Line x1={12} y1={10.9} x2={12} y2={17.2} {...line(color, wi)} />
    </>
  ),
  help: ({ color, w, wi }: Paint) => (
    <>
      <Circle cx={12} cy={12} r={8.7} {...line(color, w)} />
      <Path
        d="M9.3 9.3C9.3 7 10.9 5.7 12.4 5.7C14.3 5.7 15.6 7 15.6 8.7C15.6 10.9 12 11.3 12 13.9"
        {...line(color, wi)}
      />
      <Circle cx={12} cy={17.4} r={1.35} {...solid(color)} />
    </>
  ),
  lock: ({ color, w, wi }: Paint) => (
    <>
      <Path d="M8.2 10.4V7.8C8.2 5.7 9.9 4 12 4C14.1 4 15.8 5.7 15.8 7.8V10.4" {...line(color, w)} />
      <Rect x={4.6} y={10.4} width={14.8} height={10.6} rx={3} {...solid(color)} />
    </>
  ),
  /** Two offset rounded squares — copy, without the fussy clipboard */
  copy: ({ color, w, wi }: Paint) => (
    <>
      <Rect x={8.6} y={3.4} width={12} height={12} rx={3} {...line(color, w)} />
      <Rect x={3.4} y={8.6} width={12} height={12} rx={3} {...line(color, w)} />
    </>
  ),
  search: ({ color, w, wi }: Paint) => (
    <>
      <Circle cx={10.4} cy={10.4} r={6.4} {...line(color, w)} />
      <Line x1={15.3} y1={15.3} x2={20.4} y2={20.4} {...line(color, w)} />
    </>
  ),
  shield: ({ color, w, wi }: Paint) => (
    <>
      <Path
        d="M12 2.6L20.4 5.9C20.4 13.4 17.1 19.1 12 21.4C6.9 19.1 3.6 13.4 3.6 5.9L12 2.6Z"
        {...line(color, w)}
      />
      <Path d="M8.6 11.6L11.2 14.2L15.6 9.4" {...line(color, wi)} />
    </>
  ),
  logout: ({ color, w, wi }: Paint) => (
    <>
      <Path
        d="M13.6 3.6H6.8C5.2 3.6 3.8 5 3.8 6.6V17.4C3.8 19 5.2 20.4 6.8 20.4H13.6"
        {...line(color, w)}
      />
      <Line x1={10.4} y1={12} x2={20.4} y2={12} {...line(color, w)} />
      <Path d="M17.2 8.8L20.4 12L17.2 15.2" {...line(color, w)} />
    </>
  ),
  chat: ({ color, w, wi }: Paint) => (
    <>
      <Rect x={3.2} y={4.4} width={17.6} height={13.4} rx={4.4} {...line(color, w)} />
      <Path d="M8.6 17.8V21.8L13 17.8" {...line(color, w)} />
      <Circle cx={8.4} cy={11.1} r={1.1} {...solid(color)} />
      <Circle cx={12} cy={11.1} r={1.1} {...solid(color)} />
      <Circle cx={15.6} cy={11.1} r={1.1} {...solid(color)} />
    </>
  ),
  bulb: ({ color, w, wi }: Paint) => (
    <>
      <Circle cx={12} cy={9.6} r={5.7} {...line(color, w)} />
      <Rect x={9.3} y={15.7} width={5.4} height={2.1} rx={1.05} {...solid(color)} />
      <Rect x={10.1} y={18.4} width={3.8} height={2} rx={1} {...solid(color)} />
    </>
  ),
  star: ({ color, w, wi }: Paint) => <Path d={STAR} {...solid(color)} />,
  /** Typography selector — an 'A' in the same fat geometry */
  type: ({ color, w, wi }: Paint) => (
    <>
      <Path d="M4.2 19.4L9.4 5.2L14.6 19.4" {...line(color, w)} />
      <Line x1={6.1} y1={15.2} x2={12.7} y2={15.2} {...line(color, wi)} />
    </>
  ),

  // ─── Satisfaction scale — one scaffold, five mouths ───────────────────────
  faceGrin: ({ color, w, wi }: Paint) => (
    <Face
      color={color}
      w={w}
      mouth={
        <Path
          d="M7.4 13.6C8.6 16.6 10.2 18.1 12 18.1C13.8 18.1 15.4 16.6 16.6 13.6"
          {...line(color, wi)}
        />
      }
    />
  ),
  faceSmile: ({ color, w, wi }: Paint) => (
    <Face
      color={color}
      w={w}
      mouth={
        <Path
          d="M8 14.9C9 16.5 10.4 17.3 12 17.3C13.6 17.3 15 16.5 16 14.9"
          {...line(color, wi)}
        />
      }
    />
  ),
  faceFlat: ({ color, w, wi }: Paint) => (
    <Face
      color={color}
      w={w}
      mouth={<Line x1={8.4} y1={15.8} x2={15.6} y2={15.8} {...line(color, wi)} />}
    />
  ),
  faceFrown: ({ color, w, wi }: Paint) => (
    <Face
      color={color}
      w={w}
      mouth={
        <Path
          d="M8 17.1C9 15.5 10.4 14.7 12 14.7C13.6 14.7 15 15.5 16 17.1"
          {...line(color, wi)}
        />
      }
    />
  ),
  faceDeepFrown: ({ color, w, wi }: Paint) => (
    <Face
      color={color}
      w={w}
      mouth={
        <Path
          d="M7.4 18.1C8.6 15.1 10.2 13.6 12 13.6C13.8 13.6 15.4 15.1 16.6 18.1"
          {...line(color, wi)}
        />
      }
    />
  ),
} satisfies Record<string, (p: Paint) => React.ReactNode>;

/** Third-party marks stay authentic — a redrawn logo is a wrong logo */
const LOGOS = {
  instagram: 'logo-instagram',
  tiktok: 'logo-tiktok',
} satisfies Record<string, keyof typeof Ionicons.glyphMap>;

export type FranIconName = keyof typeof GLYPHS | keyof typeof LOGOS;

export function FranIcon({
  name,
  size = 24,
  color = colors.ink,
  style,
}: {
  name: FranIconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  if (name in LOGOS) {
    return (
      <Ionicons
        name={LOGOS[name as keyof typeof LOGOS]}
        size={size}
        color={color}
        style={style}
      />
    );
  }

  const glyph = GLYPHS[name as keyof typeof GLYPHS];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      {glyph({ color, ...weightsFor(size) })}
    </Svg>
  );
}
