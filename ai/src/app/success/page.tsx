'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const upgradeUser = async () => {
      try {
        const res = await fetch('/api/upgrade', {
          method: 'POST',
        });

        if (res.ok) {
          console.log('User upgraded to Pro successfully!');
          router.push('/'); // ✅ Redirect to your chatbox page
        } else {
          console.error('Failed to upgrade user');
        }
      } catch (error) {
        console.error('Error upgrading user:', error);
      }
    };

    upgradeUser();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold">Upgrading your account...</h1>
    </div>
  );
}
