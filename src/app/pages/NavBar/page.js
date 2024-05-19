'use client';
import Link from 'next/link';
import "../styles/globals.css";
import { useRouter } from 'next/navigation';
import { Button } from '@mui/material';
import { useState, useEffect } from 'react';

const NavBar = () => {
  const router = useRouter();
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      setToken(storedToken);
    }
  }, []);

  const LoggingOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
      router.push('/');
    }
  };

  return (
    <div>
      <nav>
        <Link href="/pages/upload">Home</Link>
        <Link href="/pages/AllUploadFiles">Uploaded Files</Link>
        <Link href="/pages/DrawShapes">Draw Shapes</Link>
        <Link href="/pages/Pointer">Make Pointer</Link>
        <Link href="/pages/Distance-Pointes">Distance-Finder</Link>
        <div className='log-btn'>
          {token ? (
            <Button onClick={LoggingOut} className='btn'>
              Logout
            </Button>
          ) : (
            "Login"
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
