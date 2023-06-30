'use client';

import { useEffect } from 'react';
import { useSettingStore } from '@/stores/setting';
import { useWindowSize } from 'usehooks-ts';

export interface SettingProps {}

export const Setting = (props: SettingProps) => {
  const { width } = useWindowSize();
  const { setScreen } = useSettingStore();
  useEffect(() => {
    // detect breakpoint
    if (width < 640) {
      setScreen('mobile');
    } else if (width < 768) {
      setScreen('tablet');
    } else {
      setScreen('desktop');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);
  return <></>;
};
