import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const Pricing = () => {
  return (
    <section className="container mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold mb-8">Choose Your Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-4">0.01 ETH/month</p>
            <ul className="list-disc list-inside mb-6">
              <li>Access to basic accommodations</li>
              <li>Standard flight bookings</li>
              <li>24/7 customer support</li>
            </ul>
            <Button className="w-full">Choose Basic</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-4">0.05 ETH/month</p>
            <ul className="list-disc list-inside mb-6">
              <li>Access to luxury accommodations</li>
              <li>Priority flight bookings</li>
              <li>Exclusive experiences</li>
              <li>24/7 VIP customer support</li>
            </ul>
            <Button className="w-full">Choose Premium</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Crypto Elite</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-4">0.1 ETH/month</p>
            <ul className="list-disc list-inside mb-6">
              <li>Access to ultra-luxury accommodations</li>
              <li>Private jet bookings</li>
              <li>Customized travel experiences</li>
              <li>Personal travel concierge</li>
              <li>Exclusive crypto networking events</li>
            </ul>
            <Button className="w-full">Choose Crypto Elite</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};