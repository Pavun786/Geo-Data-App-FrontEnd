
// 'use client'
// import { useRouter } from 'next/navigation';

//  function ProtectedRoute({children}) {

//     const router = useRouter()
//     const isAuth = localStorage.getItem("token")
//     const navigate=()=>{
//        router.push("/")
//    }
//     return (
//     <>
//      { isAuth ? children : navigate()}
//     </>
//   )
// }
// export default ProtectedRoute;

'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        setIsAuthenticated(true);
      } else {
        router.push('/');
      }
    }
  }, [router]);

  if (isAuthenticated === null) {
    return <p>Loading...</p>;
  }

  return isAuthenticated ? children : null;
}

export default ProtectedRoute;



