import { useQuery, useQueryClient } from '@tanstack/react-query';

import { Call } from '@/types/call';
import { CallItem } from './call-item';
import { Spin } from 'antd';
import { callApi } from '@/services/call-services';

export interface CallHistoryProps {
  onItemClicked?: (call: Call) => void;
}

export const CallHistory = ({ onItemClicked }: CallHistoryProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ['callHistory'],
    queryFn: callApi.getHistory,
  });
  const queryClient = useQueryClient();
  const messages = data?.data || [];

  return (
    <div className="overflow-y-overlay relative -mx-2 mt-4 max-h-96 min-h-[480px]">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
        <Spin spinning={isLoading} size="large" />
      </div>
      <ul className="flex flex-col gap-1">
        {messages.map((message) => {
          return (
            <li key={message._id} onClick={() => onItemClicked?.(message.call!)}>
              <CallItem
                message={message}
                onDeleted={() => {
                  queryClient.setQueryData(['callHistory'], (old: any) => {
                    return {
                      ...old,
                      data: old.data.filter((item: any) => item._id !== message._id),
                    };
                  });
                }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
