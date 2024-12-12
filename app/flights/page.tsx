import { Layout } from '@/components/Layout';
import { FlightList } from '@/components/FlightList';

export default function Flights() {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-4">
        <h1 className="text-4xl font-bold mb-4">Flights</h1>
        <FlightList />
      </div>
    </Layout>
  );
}
