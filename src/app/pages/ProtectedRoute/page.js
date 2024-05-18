

import { useRouter } from 'next/navigation';


 function ProtectedRoute({children}) {

    const router = useRouter()

   const isAuth = localStorage.getItem("token")
   
   const navigate=()=>{
       router.push("/")
   }
    
  return (
    <>
     { isAuth ? children : navigate()}
    </>
  )
}

export default ProtectedRoute;


