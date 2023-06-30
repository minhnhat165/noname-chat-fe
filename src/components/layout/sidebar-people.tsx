import { Dispatch, SetStateAction } from 'react';
import { UserChecklist } from '../user/user-checklist';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useSidebar } from './sidebar';
import { User } from '@/types/user';

type SidebarPeopleProps = {
  participants: string[];
  data?: User[];
  setParticipants: Dispatch<SetStateAction<string[]>>;
};

export const SidebarPeople = ({ data, participants, setParticipants }: SidebarPeopleProps) => {
  const { setIsStep2CreateGroup } = useSidebar();

  return (
    <div className="h-full bg-white">
      <UserChecklist data={data} participants={participants} setParticipants={setParticipants} />
      <div className="absolute bottom-10 right-4">
        <Button
          type="primary"
          shape="circle"
          icon={<ArrowRightOutlined />}
          size={'large'}
          onClick={() => {
            setIsStep2CreateGroup(true);
          }}
        />
      </div>
    </div>
  );
};

// export const AddMember = () => {
//   const { setIsStep2CreateGroup } = useSidebar();
//   return (
//     <>
//       <UserChecklist participants={participants} setParticipants={setParticipants} />
//       <div className="absolute bottom-10 right-4">
//         <Button
//           type="primary"
//           shape="circle"
//           icon={<ArrowRightOutlined />}
//           size={'large'}
//           onClick={() => {
//             setIsStep2CreateGroup(true);
//           }}
//         />
//       </div>
//     </>
//   );
// };
