import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig/axiosConfig';

const HomeScreen: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // const response = await fetch('http://localhost:3000/api/user', {
        //   credentials: 'include', // Include cookies in the request
        // });
        // const data = await response.json();
        // setUsername(data.username);
        const data = await axios.get('/api/user');
        setUsername(data.username);
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