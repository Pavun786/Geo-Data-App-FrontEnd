// pages/index.js
// "use client"
// import { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import mapboxgl from 'mapbox-gl';
// import MapboxDraw from '@mapbox/mapbox-gl-draw';
// import Link from 'next/link';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

// mapboxgl.accessToken = 'pk.eyJ1IjoicGF2dW43ODYiLCJhIjoiY2x3OHNjOTJsMmhtczJqcGhqbng2MmNoaSJ9.Hh17KzDoz_MzG6DC3DQdzw';

// export default function Home() {
//   const [files, setFiles] = useState([]);
//   const [selectedFiles, setSelectedFiles] = useState({});
//   const [shapes, setShapes] = useState(null);
//   const mapContainer = useRef(null);
//   const map = useRef(null);
//   const draw = useRef(null);

//   useEffect(() => {
//     const fetchFiles = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/files');
//         setFiles(response.data);
//       } catch (error) {
//         console.error('Error fetching files:', error);
//       }
//     };

//     const fetchShapes = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/shapes');
//         setShapes(response.data?.shapes || { type: 'FeatureCollection', features: [] });
//       } catch (error) {
//         console.error('Error fetching shapes:', error);
//       }
//     };

//     fetchFiles();
//     fetchShapes();
//   }, []);

//   useEffect(() => {
//   if (!mapContainer.current) return;

//   map.current = new mapboxgl.Map({
//     container: mapContainer.current,
//     style: 'mapbox://styles/mapbox/streets-v11',
//     center: [0, 0],
//     zoom: 2,
//   });

//   map.current.on('style.load', () => {
//     // Add Mapbox Draw instance and other operations here
//     draw.current = new MapboxDraw({
//       displayControlsDefault: false,
//       controls: {
//         polygon: true,
//         trash: true,
//       },
//     });
//     map.current.addControl(draw.current);

//     if (shapes) {
//       draw.current.set(shapes);
//     }

//     map.current.on('draw.create', saveDrawnShapes);
//     map.current.on('draw.update', saveDrawnShapes);
//     map.current.on('draw.delete', saveDrawnShapes);
//   });

//   return () => {
//     if (map.current) {
//       map.current.remove();
//     }
//   };
// }, [shapes]);

  

// useEffect(() => {
//     if (!map.current || !mapContainer.current) return;
  
//     files.forEach((file) => {
//       if (!file.geojson) {
//         console.error(`No GeoJSON data found for file: ${file.filename}`);
//         return;
//       }
  
//       if (map.current.getSource(file._id)) {
//         map.current.getSource(file._id).setData(file.geojson);
//         map.current.setLayoutProperty(file._id, 'visibility', selectedFiles[file._id] ? 'visible' : 'none');
//       } else {
//         // map.current.addSource(file._id, {
//         //   type: 'geojson',
//         //   data: file.geojson,
//         // });
  
//         map.current.addLayer({
//           id: file._id,
//           type: 'line',
//           source: file._id,
//           layout: {
//             'line-join': 'round',
//             'line-cap': 'round',
//             'visibility': selectedFiles[file._id] ? 'visible' : 'none',
//           },
//           paint: {
//             'line-color': '#888',
//             'line-width': 2,
//           },
//         });
//       }
//     });
//   }, [files, selectedFiles]);
  
//   const handleCheckboxChange = (id) => {
//     setSelectedFiles((prev) => ({ ...prev, [id]: !prev[id] }));
//   };

//   const saveDrawnShapes = async () => {
//     const drawnShapes = draw.current.getAll();
//     try {
//       await axios.post('http://localhost:3001/shapes', { shapes: drawnShapes });
//     } catch (error) {
//       console.error('Error saving shapes:', error);
//     }
//   };

//   return (
//     <div>
//       <nav>
//         <Link href="/">Home</Link>
//         <Link href="/upload">Upload Files</Link>
//         <Link href="/files">View Files</Link>
//       </nav>
//       <main>
//         <h1>Files</h1>
//         <div>
//           {files.map((file) => (
//             <div key={file._id}>
//               <input
//                 type="checkbox"
//                 checked={!!selectedFiles[file._id]}
//                 onChange={() => handleCheckboxChange(file._id)}
//               />
//               {file.filename}
//             </div>
//           ))}
//         </div>
//         <div ref={mapContainer} style={{ width: '100%', height: '500px' }} />
//       </main>
//       <footer>© 2024 My Geo-Data App</footer>
//     </div>
//   );
// }



//==========================================================================

'use client'
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import Link from 'next/link';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

mapboxgl.accessToken = 'pk.eyJ1IjoicGF2dW43ODYiLCJhIjoiY2x3OHNjOTJsMmhtczJqcGhqbng2MmNoaSJ9.Hh17KzDoz_MzG6DC3DQdzw';

export default function Home() {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [shapes, setShapes] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const draw = useRef(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:3001/files');
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };
    fetchFiles();
    fetchShapes();
  }, []);


   const fetchShapes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/shapes');
        setShapes(response.data);
      } catch (error) {
        console.error('Error fetching shapes:', error);
      }
    };


  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 2,
    });

    map.current.on('style.load', () => {
      draw.current = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
      });
      map.current.addControl(draw.current);

      if (shapes) {
        draw.current.set(shapes);
      }

      map.current.on('draw.create', saveDrawnShapes);
      map.current.on('draw.update', saveDrawnShapes);
      map.current.on('draw.delete', saveDrawnShapes);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [shapes]);

  useEffect(() => {
    if (!map.current || !mapContainer.current) return;

    files.forEach((file) => {
      if (!file.geojson) {
        console.error(`No GeoJSON data found for file: ${file.filename}`);
        return;
      }

      if (map.current.getSource(file._id)) {
        map.current.getSource(file._id).setData(file.geojson);
        map.current.setLayoutProperty(file._id, 'visibility', selectedFiles[file._id] ? 'visible' : 'none');
      } else {
        map.current.addLayer({
        //   id: file._id,
        //   type: 'line',
        //   source: {
        //     type: 'geojson',
        //     data: file.geojson,
        //   },
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
            'visibility': selectedFiles[file._id] ? 'visible' : 'none',
          },
          paint: {
            'line-color': '#888',
            'line-width': 2,
          },
        });
      }
    });
  }, [files, selectedFiles]);

  const handleCheckboxChange = (id) => {
    setSelectedFiles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const saveDrawnShapes = async () => {
    const drawnShapes = draw.current.getAll();
    try {
      await axios.post('http://localhost:3001/shapes', { shapes: drawnShapes });
    } catch (error) {
      console.error('Error saving shapes:', error);
    }
  };

  const handleShapeSelect = (shapeId) => {
    setSelectedShape(shapeId);
  };

  return (
    <div>
    <nav>
      <Link href="/">Home</Link>
      <Link href="/upload">Upload Files</Link>
      <Link href="/files">View Files</Link>
    </nav>
    <main>
      <h1>Files</h1>
      <div>
        {files.map((file) => (
          <div key={file._id}>
            <input
              type="checkbox"
              checked={!!selectedFiles[file._id]}
              onChange={() => handleCheckboxChange(file._id)}
            />
            {file.filename}
          </div>
        ))}
      </div>
      <button onClick={()=>fetchShapes()}>Saved Shapes</button>
      <ul>
        {Array.isArray(shapes) && shapes.map((shape) => (
          <li key={shape.id} onClick={() => handleShapeSelect(shape.id)}>
            {shape.name}
          </li>
        ))}
      </ul>
      <button onClick={saveDrawnShapes}>Save Shapes</button>
      <div ref={mapContainer} style={{ width: '100%', height: '500px' }} />
    </main>
    <footer>© 2024 My Geo-Data App</footer>
  </div>
  );
}

