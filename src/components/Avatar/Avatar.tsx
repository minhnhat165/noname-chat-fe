import { HTMLAttributes, forwardRef } from 'react';

import Image from 'next/image';
import { Size } from '@/types/style';
import { cn } from '@/utils';

type Shape = 'circle' | 'square';

const sizes: Record<Size, string> = {
  small: 'h-8 w-8',
  medium: 'h-12 w-12',
  large: 'h-16 w-16',
};

const shapes: Record<Shape, string> = {
  circle: 'rounded-full',
  square: 'rounded-lg',
};

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: Size;
  shape?: Shape;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      src = '/avatar_placeholder.png',
      alt = 'Avatar',
      shape = 'circle',
      size = 'medium',
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-block shrink-0 overflow-hidden',
          shapes[shape],
          sizes[size],
          className,
        )}
        {...props}
      >
        <Image priority src={src} alt={alt} fill className="object-cover" sizes="72px" />
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';

export { Avatar };
