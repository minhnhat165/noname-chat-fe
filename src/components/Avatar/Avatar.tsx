import { HTMLAttributes, forwardRef } from 'react';
import { Shape, Size } from '@/types/style';

import Image from 'next/image';
import { cn } from '@/utils';

type AvatarSize = Size | 'xLarge';
const sizes: Record<AvatarSize, string> = {
  small: 'w-8 h-8',
  medium: 'w-12 h-12',
  large: 'w-16 h-16',
  xLarge: 'w-24 h-24',
};

const sizeNumbers: Record<AvatarSize, number> = {
  small: 32,
  medium: 48,
  large: 64,
  xLarge: 96,
};

const shapes: Record<Shape, string> = {
  circle: 'rounded-full',
  square: 'rounded-lg',
};

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: AvatarSize;
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
        <Image
          priority={false}
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={`${sizeNumbers[size] * 2}px`}
        />
      </div>
    );
  },
);

Avatar.displayName = 'Avatar';

export { Avatar };
