import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

export const Header = () => {
  return (
    <header className={cn(
      "border-b",
      "bg-background text-foreground"
    )}>
      <nav className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">
            <Link href="/" className="hover:text-primary">Crypto Travel</Link>
          </div>
          <div className="flex space-x-4">
            <Link href="/accommodations">
              <Button variant="ghost">Accommodations</Button>
            </Link>
            <Link href="/flights">
              <Button variant="ghost">Flights</Button>
            </Link>
            <Link href="/experiences">
              <Button variant="ghost">Experiences</Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};
