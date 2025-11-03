export type HandType = 'pair' | 'suited' | 'offsuit';
export type TagType = 0 | 1 | 2 | 3 | 4 | 5;

export interface Hand {
  id: string;
  display: string;
  type: HandType;
  combos: number;
}

export interface HandState {
  isSelected: boolean;
  tag: TagType;
}
