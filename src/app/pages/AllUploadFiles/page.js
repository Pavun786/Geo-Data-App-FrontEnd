// pages/files.js
"use client"
// pages/files.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

const FilesList = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await axios.get('http://localhost:3001/files');
      setFiles(response.data);
    };
    fetchFiles();
  }, []);

  return (
    <div>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/upload">Upload Files</Link>
        <Link href="/files">View Files</Link>
      </nav>
      <main>
        <h1>Files List</h1>
        <ul>
          {files.map((file) => (
            <li key={file._id}>
              <Link href={`/pages/map/${file._id}`}>
                {file.filename}
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <footer>© 2024 My Geo-Data App</footer>
    </div>
  );
};

export default FilesList;
