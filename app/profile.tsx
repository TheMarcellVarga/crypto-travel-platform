import { Layout } from '@/components/Layout';
import { UserProfile } from '@/components/UserProfile';

export default function Profile() {
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    // Add more user data
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-4">
        <h1 className="text-4xl font-bold mb-4">Profile</h1>
        <UserProfile user={user} />
      </div>
    </Layout>
  );
}
