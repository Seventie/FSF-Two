
export enum Page {
  SELECTOR = 'SELECTOR',
  ARITHMETIC = 'ARITHMETIC',
  COUNTING = 'COUNTING',
  SCENARIOS = 'SCENARIOS',
  SHAPES = 'SHAPES',
  COMPARE = 'COMPARE',
}

export enum ArithmeticType {
  ADDITION = 'ADDITION',
  SUBTRACTION = 'SUBTRACTION',
}

export enum CountingMode {
  COUNT_AND_ENTER = 'COUNT_AND_ENTER',
  BUILD_THE_COUNT = 'BUILD_THE_COUNT',
}

export type SyncStatus = 'idle' | 'loading' | 'saving' | 'error';
