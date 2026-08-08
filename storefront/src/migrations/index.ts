import * as migration_20260808_222323_initial from './20260808_222323_initial';

export const migrations = [
  {
    up: migration_20260808_222323_initial.up,
    down: migration_20260808_222323_initial.down,
    name: '20260808_222323_initial'
  },
];
