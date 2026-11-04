'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const useHydrated = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
