'use client';
import toast, { Toaster } from 'react-hot-toast';

type Props = {};

export const Toast = (props: Props) => {
  return (
    <div onClick={() => toast.dismiss()}>
      <Toaster position="top-right" reverseOrder={false} toastOptions={{ duration: 5000 }} />
    </div>
  );
};
