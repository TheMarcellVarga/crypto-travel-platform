import { Layout } from '@/components/Layout';
import { AccommodationList } from '@/components/AccommodationList';

export default function Accommodations() {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-4">
        <h1 className="text-4xl font-bold mb-4">Accommodations</h1>
        <AccommodationList />
      </div>
    </Layout>
  );
}
