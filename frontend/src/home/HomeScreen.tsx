import React, { useEffect, useState } from 'react';
import axios from '../../config/axiosConfig';

const HomeScreen: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await axios.get('/admin/user');
        setUsername(data.data.username || null);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1>Welcome to the Home Screen</h1>
      {username ? <p>Hello, {username}!</p> : <p>You are not logged in.</p>}
    </div>
  );
};

export default HomeScreen;