import { Button, LoadingOverlay } from '@mantine/core';
import Link from 'next/link';
import { useState } from 'react';

import { registerAPI } from '~/api/api';

const Index = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');

  const login = async () => {
    setIsLoading(true);
    await registerAPI(username, password);
    setIsLoading(false);
  };

  return (
    <div className="login">
      <div className="login__modal" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
        {isLoading ? (
          <div className="login__modal-loading">
            <LoadingOverlay  visible/>
          </div>
        ) : (
          <>
            <h1>Regiser</h1>
            <h3>Username</h3>
            <input
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              placeholder="Username"
            />
            <h3>Password</h3>
            <input
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="********"
            />
            <Button
              onClick={login}
              style={{ marginTop: '16px' }}
              disabled={!username || !password}
            >Register</Button>
            <h5>
              Already have an account?{' '}
              <Link href="/login">
                <p>Login</p>
              </Link>
            </h5>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
