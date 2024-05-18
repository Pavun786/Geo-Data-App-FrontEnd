"use client"
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import "../styles/globals.css"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useRouter } from 'next/navigation';
import {API} from '../../Global'

const Upload = () => {
  const [file, setFile] = useState(null);
  const router = useRouter()

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API}/route/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully');
      router.push("/pages/AllUploadFiles")

    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  return (
    <div className='upload-container'>
      <main>
        <h1>Upload File</h1>
        <input type="file" onChange={handleFileChange} />
       <Button variant="contained" onClick={handleUpload}>Upload</Button>
      </main>
     
    </div>
  );
};

export default Upload;
