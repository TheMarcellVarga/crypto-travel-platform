import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Testimonials } from "@/components/Testimonials";
import { CallToAction } from "@/components/CallToAction";
import { TravelPackages } from "@/components/TravelPackages";
import { FAQs } from "@/components/FAQs";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Features />
      <Testimonials />
      <TravelPackages />
      <FAQs />
      <CallToAction />
    </Layout>
  );
}
