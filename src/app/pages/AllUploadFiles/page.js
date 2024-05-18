// pages/files.js
"use client"
// pages/files.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import "../styles/globals.css"
import Paper from '@mui/material/Paper';
import {API} from '../../Global'

const FilesList = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await axios.get(`${API}/route/files`);
      setFiles(response.data);
    };
    fetchFiles();
  }, []);

  return (
    <div>
      <main>
        <h1>Files List</h1>
        <ul>
          {files.map((file,index) => (
          <Paper elevation={10} className='paper'>
            <li key={file._id}>
              <Link className='link' href={`/pages/map/${file._id}`}>
                {index+1}. {file.filename}
              </Link>

            </li>
            </Paper>
          ))}
        </ul>
      </main>
      
    </div>
  );
};

export default FilesList;
