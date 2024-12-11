import { Layout } from '@/components/Layout';
import { ExperienceList } from '@/components/ExperienceList';

export default function Experiences() {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-4">
        <h1 className="text-4xl font-bold mb-4">Experiences</h1>
        <ExperienceList />
      </div>
    </Layout>
  );
}
