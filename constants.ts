import type { Hand, TagType } from './types';

export const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

export const TOTAL_COMBOS = 1326;

export const HANDS_13x13: Hand[][] = RANKS.map((rank1, i) =>
  RANKS.map((rank2, j) => {
    if (i < j) { // Suited
      return { id: `${rank1}${rank2}s`, display: `${rank1}${rank2}s`, type: 'suited', combos: 4 };
    } else if (i > j) { // Off-suit
      return { id: `${rank2}${rank1}o`, display: `${rank2}${rank1}o`, type: 'offsuit', combos: 12 };
    } else { // Pair
      return { id: `${rank1}${rank2}`, display: `${rank1}${rank2}`, type: 'pair', combos: 6 };
    }
  })
);

export const HANDS_FLAT: Hand[] = HANDS_13x13.flat();

export const PRELOADED_RANGES: Record<string, string[]> = {
  'Clear mode': [],
  'resteal': ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AQs', 'AJs', 'ATs', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'AKo', 'AQo'],
  'bb v sb': ['AA', 'KK', 'QQ', 'JJ', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'K9s', 'K8s', 'K7s', 'K6s', 'Q9s', 'J9s', 'AQo', 'AJo', 'ATo', 'KQo'],
  'SB vs BTN': ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', 'AKs', 'AQs', 'AJs', 'ATs', 'KQs', 'KJs', 'AKo', 'AQo'],
  'Store range ...': [],
  'Defend CC': ['99', '88', '77', '66', '55', 'AJs', 'ATs', 'A9s', 'KJs', 'KTs', 'QJs', 'QTs', 'JTs', 'J9s', 'T9s', '98s', 'AQo', 'AJo', 'ATo', 'KQo', 'KJo'],
  'BTN vs OR fish': ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'KQs', 'KJs', 'KTs', 'QJs', 'JTs', 'T9s', 'AKo', 'AQo', 'AJo', 'KQo'],
  'Dfn BB GTO 2.5': ['AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s', 'KQs', 'KJs', 'KTs', 'K9s', 'QJs', 'QTs', 'JTs', 'AKo', 'AQo', 'AJo', 'ATo', 'KQo', 'KJo'],
  'Call3B': ['QQ', 'JJ', 'TT', '99', 'AKs', 'AQs', 'AJs', 'KQs', 'AKo', 'AQo'],
  'Fishes': [],
};

export const TAG_COLORS: { [key in Exclude<TagType, 0>]: string } = {
  1: 'bg-sky-500',
  2: 'bg-emerald-500',
  3: 'bg-amber-400',
  4: 'bg-violet-500',
  5: 'bg-rose-500',
};

export const BROADWAY_RANKS = ['A', 'K', 'Q', 'J', 'T'];
