import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const TravelPackages = () => {
  return (
    <section className="container mx-auto px-6 py-20">
      <h2 className="text-4xl font-bold mb-8">Explore Travel Packages</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Standard Travel</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1">
            <div className="flex-1">
              <p className="text-lg text-muted-foreground mb-4">
                Perfect for budget-conscious travelers
              </p>
              <ul className="list-disc list-inside mb-6">
                <li>Economy class flights</li>
                <li>3-4 star accommodations</li>
                <li>Standard travel insurance</li>
                <li>24/7 customer support</li>
              </ul>
              <p className="text-sm text-muted-foreground mb-4">
                Pay with popular cryptocurrencies: BTC, ETH, USDT
              </p>
            </div>
            <Button className="w-full mt-auto">Search Standard Options</Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Luxury Travel</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1">
            <div className="flex-1">
              <p className="text-lg text-muted-foreground mb-4">
                Enhanced comfort and exclusive experiences
              </p>
              <ul className="list-disc list-inside mb-6">
                <li>Business class flights</li>
                <li>5-star luxury hotels</li>
                <li>Premium travel insurance</li>
                <li>Priority customer service</li>
                <li>Access to exclusive events</li>
              </ul>
              <p className="text-sm text-muted-foreground mb-4">
                Additional crypto payment options available
              </p>
            </div>
            <Button className="w-full mt-auto">Explore Luxury Options</Button>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Ultra-Luxury Experience</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1">
            <div className="flex-1">
              <p className="text-lg text-muted-foreground mb-4">
                The ultimate in luxury travel
              </p>
              <ul className="list-disc list-inside mb-6">
                <li>Private jet options</li>
                <li>Ultra-luxury resorts & villas</li>
                <li>Personal travel concierge</li>
                <li>Customized experiences</li>
                <li>VIP access to exclusive venues</li>
                <li>Luxury vehicle rentals</li>
              </ul>
              <p className="text-sm text-muted-foreground mb-4">
                Accepts all major cryptocurrencies
              </p>
            </div>
            <Button className="w-full mt-auto">Discover Ultra-Luxury</Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
