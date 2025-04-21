'use client';

import {Button} from '@/components/ui/button';
import {useRouter} from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-muted">
      <h1 className="text-3xl font-semibold text-primary mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-muted-foreground mb-8 text-center">
        The page you are looking for does not exist.
      </p>
      <Button onClick={() => router.back()} variant="outline">
        Go Back
      </Button>
    </div>
  );
}
