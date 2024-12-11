interface UserProfileProps {
  user: {
    name: string;
    email: string;
    // Add more user fields
  };
}

export const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div className="bg-white shadow rounded-md p-4">
      <h2 className="text-2xl font-bold mb-4">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
      {/* Display more user information */}
    </div>
  );
};
