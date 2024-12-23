import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const FAQs = () => {
  return (
    <section className="bg-muted py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold mb-8">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How does CryptoVoyage work?</AccordionTrigger>
            <AccordionContent>
              CryptoVoyage allows you to book travel accommodations, flights, and experiences using cryptocurrencies. Simply browse our offerings, select your desired options, and complete your booking using your preferred cryptocurrency.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Which cryptocurrencies do you accept?</AccordionTrigger>
            <AccordionContent>
              We currently accept Bitcoin (BTC), Ethereum (ETH), and several other major cryptocurrencies. Check our payment options during checkout for the full list of accepted currencies.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Are my crypto transactions secure?</AccordionTrigger>
            <AccordionContent>
              Yes, we use state-of-the-art blockchain technology to ensure all transactions are secure and transparent. We also partner with reputable crypto payment processors to provide additional security.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>What if I need to cancel or change my booking?</AccordionTrigger>
            <AccordionContent>
              Our cancellation and change policies vary depending on the specific booking. Please refer to the terms and conditions for each reservation. In general, we strive to provide flexible options for our customers.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>Do you offer customer support?</AccordionTrigger>
            <AccordionContent>
              Yes, we provide 24/7 customer support for all our users. Premium and Crypto Elite members have access to priority support channels and personalized assistance.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};