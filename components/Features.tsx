import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Features = () => {
  return (
    <section className="container mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold mb-8">Why Choose CryptoVoyage?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Secure Payments</CardTitle>
          </CardHeader>
          <CardContent>
            We ensure secure and seamless cryptocurrency transactions for your travel bookings.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Wide Range of Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            Explore a vast selection of crypto-friendly destinations worldwide.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Exclusive Experiences</CardTitle>
          </CardHeader>
          <CardContent>
            Discover unique and unforgettable experiences tailored for crypto enthusiasts.
          </CardContent>
        </Card>
      </div>
    </section>
  );
};