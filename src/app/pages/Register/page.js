'use client'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from "formik";
import * as yup from "yup";
import "../styles/globals.css"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {API} from '../../Global'

const RegisterValidationSchema = yup.object({
    Username:yup.string().required(),
    Email:yup.string().required(),
    Password:yup.string().required(),
   
       
   });

function Register(){
    
   const router = useRouter()

    const formik = useFormik({
        initialValues:{
            Username:"",
            Email:"",
            Password:"",
           
        },
   
        validationSchema:RegisterValidationSchema,

       onSubmit:async (values)=>{
        console.log(values)
       
        try {
            const signup = await fetch(`${API}/auth/register`, {
              method: "POST",
              body: JSON.stringify(values),
              headers: { "Content-type": "application/json" },
            });
            
            if (signup.status !== 200) {
              const errorResponse = await signup.json();
              alert(errorResponse.message);
            } else {
              const result = await signup.json();
              console.log(result);
              if (typeof window !== 'undefined') {
                localStorage.setItem('token', result.token);
              }
              router.push("/");
            }
          } catch (error) {
            console.error('Error during registration:', error);
            alert('Registration failed, please try again.');
          }
           
       }
    });
     
    return(
        <div >
            <h3 className='register'>Register</h3>
            <form className='register-container'onSubmit={formik.handleSubmit}>
          <TextField id="outlined-basic" 
          label="Username" 
          variant="outlined" 
          value={formik.values.Username}
            onChange={formik.handleChange}
            name="Username"
            onBlur={formik.handleBlur} 
            //here error & helpertext is Meterial UI feature word..
            error={formik.touched.Username && formik.errors.Username}
            helperText={formik.touched.Username && formik.errors.Username ? formik.errors.Username : null}/>

          <TextField 
          id="outlined-basic" 
          label="Email" 
          variant="outlined"
          value={formik.values.Email}
            onChange={formik.handleChange}
            name="Email" 
            onBlur={formik.handleBlur} 
            //here error & helpertext is Meterial UI feature word..
            error={formik.touched.Email && formik.errors.Email}
            helperText={formik.touched.Email && formik.errors.Email ? formik.errors.Email : null}/>

          <TextField id="outlined-basic" 
          label="Password" 
          variant="outlined"
          value={formik.values.Password}
            onChange={formik.handleChange}
            name="Password" 
            onBlur={formik.handleBlur} 
            //here error & helpertext is Meterial UI feature word..
            error={formik.touched.Password && formik.errors.Password}
            helperText={formik.touched.Password && formik.errors.Password ? formik.errors.Password : null}/>

          <Button type="submit" variant="contained">submit</Button>
          
          <p> If you have an account <Link href="/">Click-Here</Link> </p>
     
          </form>
        </div>
    )
 }

 export default Register;
 