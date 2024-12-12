import { Layout } from '@/components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to Crypto Travel</h1>
        <p className="text-xl">Book accommodations, flights, and share experiences using cryptocurrency.</p>
        <br />
        <p className="text-xl italic">Travel to Crypto-friendly destinations</p>
      </div>
    </Layout>
  );
}
