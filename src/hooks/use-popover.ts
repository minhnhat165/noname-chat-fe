'use client';

import { useState } from 'react';

export const usePopover = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const hide = () => {
    setIsOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
  };
  return { isOpen, hide, handleOpenChange };
};
