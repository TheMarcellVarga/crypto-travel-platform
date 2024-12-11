import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-gray-800">
            <Link href="/">Crypto Travel</Link>
          </div>
          <div className="flex space-x-4">
            <Link href="/accommodations">
              <Button variant="link">Accommodations</Button>
            </Link>
            <Link href="/flights">
              <Button variant="link">Flights</Button>
            </Link>
            <Link href="/experiences">
              <Button variant="link">Experiences</Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
