// pages/upload.js
"use client"
// pages/upload.js
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const Upload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    }
  };

  return (
    <div>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/upload">Upload Files</Link>
        <Link href="/files">View Files</Link>
      </nav>
      <main>
        <h1>Upload File</h1>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </main>
      <footer>© 2024 My Geo-Data App</footer>
    </div>
  );
};

export default Upload;
