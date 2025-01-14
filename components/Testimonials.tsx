import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Testimonials = () => {
  return (
    <section className="bg-muted py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-8">What Our Customers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Avatar className="w-12 h-12">
                <AvatarImage src="/avatars/alice.jpg" alt="Alice" />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">Alice Crypto</CardTitle>
            </CardHeader>
            <CardContent>
              "CryptoVoyage made my dream vacation a reality. Booking with
              crypto was seamless!"
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Avatar className="w-12 h-12">
                <AvatarImage src="/avatars/bob.jpg" alt="Bob" />
                <AvatarFallback>B</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">Bob Blockchain</CardTitle>
            </CardHeader>
            <CardContent>
              "I love how easy it is to use my crypto for travel. The
              experiences are top-notch!"
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Avatar className="w-12 h-12">
                <AvatarImage src="/avatars/carol.jpg" alt="Carol" />
                <AvatarFallback>C</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">Carol Coinbase</CardTitle>
            </CardHeader>
            <CardContent>
              "The variety of destinations and the security of transactions make
              CryptoVoyage my go-to travel platform."
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
