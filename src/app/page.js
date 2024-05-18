'use client'
import React from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useFormik } from "formik";
import Link from 'next/link';
import "./pages/styles/globals.css";
import * as yup from "yup";
import { useRouter } from 'next/navigation';
import { API } from "./Global";

const LoginValidationSchema = yup.object({
    Email: yup.string().required(),
    Password: yup.string().required()
});

function Login() {
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            Email: "",
            Password: ""
        },
        validationSchema: LoginValidationSchema,
        onSubmit: async (values) => {
            const data = await fetch(`${API}/auth/login`, {
                method: "POST",
                body: JSON.stringify(values),
                headers: { "Content-type": "application/json" },
            });

            if (data.status === 500) {
                alert("Unauthorized");
            } else {
                const result = await data.json();
                localStorage.setItem("token", result.token);
                router.push("/pages/upload");
            }
        }
    });

    return (
        <div>
            <h3 className='register'>Login</h3>
            <form className='register-container' onSubmit={formik.handleSubmit}>
                <TextField
                    id="outlined-basic"
                    label="Email"
                    variant="outlined"
                    value={formik.values.Email}
                    onChange={formik.handleChange}
                    name="Email"
                    onBlur={formik.handleBlur}
                    error={formik.touched.Email && formik.errors.Email}
                    helperText={formik.touched.Email && formik.errors.Email ? formik.errors.Email : null}
                />
                <TextField
                    id="outlined-basic"
                    label="Password"
                    variant="outlined"
                    value={formik.values.Password}
                    onChange={formik.handleChange}
                    name="Password"
                    onBlur={formik.handleBlur}
                    error={formik.touched.Password && formik.errors.Password}
                    helperText={formik.touched.Password && formik.errors.Password ? formik.errors.Password : null}
                />
                <Button type="submit" variant="contained">Submit</Button>
                <p>If you don&apos;t have an account <Link href="/pages/Register">Click-Here</Link></p>
            </form>
        </div>
    );
}

export default Login;
