import { Button } from '@/components/ui/button';

export const Hero = () => {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-bold mb-4">Welcome to CryptoVoyage</h1>
        <p className="text-xl mb-8">Discover the world with the power of cryptocurrency</p>
        <Button size="lg">Start Your Journey</Button>
      </div>
    </section>
  );
};