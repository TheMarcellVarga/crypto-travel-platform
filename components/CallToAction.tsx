import { Button } from '@/components/ui/button';

export const CallToAction = () => {
  return (
    <section className="bg-primary text-primary-foreground py-20">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Start Your Crypto Travel Adventure?</h2>
        <p className="text-xl mb-8">Sign up now and unlock a world of possibilities!</p>
        <Button size="lg">Get Started</Button>
      </div>
    </section>
  );
};