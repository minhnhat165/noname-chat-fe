import { Skeleton } from 'antd';

export const RoomItemSkeleton = () => {
  return (
    <div className="flex h-[72px] w-full items-center rounded-lg p-2">
      <div className="h-12 w-12 animate-pulse rounded-full bg-gray-200" />
      <div className="flex flex-1 flex-col justify-between gap-1 px-2">
        <div className="flex">
          <Skeleton.Input
            style={{ width: 100, height: 16, borderRadius: 999999 }}
            active
            size="small"
          />
        </div>
        <Skeleton.Input
          style={{ width: '70%', height: 16, borderRadius: 999999 }}
          active
          size="small"
        />
      </div>
    </div>
  );
};
