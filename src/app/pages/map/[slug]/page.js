// // pages/map.js

// "use client"
// import { useEffect, useRef, useState } from 'react';
// import mapboxgl from 'mapbox-gl';
// import axios from 'axios';
// import Link from 'next/link';

// mapboxgl.accessToken = 'pk.eyJ1IjoicGF2dW43ODYiLCJhIjoiY2x3OHNjOTJsMmhtczJqcGhqbng2MmNoaSJ9.Hh17KzDoz_MzG6DC3DQdzw';

// export default function Map() {
//   const mapContainer = useRef(null);
//   const map = useRef(null);
//   const [lng, setLng] = useState(-70.9);
//   const [lat, setLat] = useState(42.35);
//   const [zoom, setZoom] = useState(9);

//   useEffect(() => {
//     if (map.current) return; // initialize map only once
//     map.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: 'mapbox://styles/mapbox/streets-v11',
//       center: [lng, lat],
//       zoom: zoom,
//     });

//     // Fetch and render uploaded files
//     const fetchFiles = async () => {
//       const response = await axios.get('http://localhost:3001/files');
//       const files = response.data;

//       files.forEach((file) => {
//         if (file.type === 'application/vnd.google-earth.kml+xml' || file.type === 'application/geo+json') {
//           map.current.addSource(file._id, {
//             type: 'geojson',
//             data: `http://localhost:3001/uploads/${file.filename}`,
//           });

//           map.current.addLayer({
//             id: file._id,
//             type: 'line',
//             source: file._id,
//             layout: {},
//             paint: {
//               'line-color': '#888',
//               'line-width': 2,
//             },
//           });
//         } else if (file.type === 'image/tiff') {
//           // Add TIFF rendering logic (requires a raster layer and possibly additional processing)
//         }
//       });
//     };

//     fetchFiles();
//   }, []);

//   return (
//     <div>
//       <nav>
//         <Link href="/">Home</Link>
//         <Link href="/upload">Upload Files</Link>
//         <Link href="/map">View Map</Link>
//       </nav>
//       <main>
//         <h1>Map</h1>
//         <div ref={mapContainer} style={{ width: '100%', height: '500px' }} />
//       </main>
//       <footer>© 2024 My Geo-Data App</footer>
//     </div>
//   );
// }

 
// "use client";

// // pages/file/[id].js
// import { useRouter } from 'next/router';
// import { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import mapboxgl from 'mapbox-gl';
// import Link from 'next/link';
// import 'mapbox-gl/dist/mapbox-gl.css';

// mapboxgl.accessToken = 'pk.eyJ1IjoicGF2dW43ODYiLCJhIjoiY2x3OHNjOTJsMmhtczJqcGhqbng2MmNoaSJ9.Hh17KzDoz_MzG6DC3DQdzw';

// const FilePage = ({params}) => {
//  // const router = useRouter();
//  // const { id } = router.query;
//  const id = params.slug;
//   const [file, setFile] = useState(null);
//   const mapContainer = useRef(null);
//   const map = useRef(null);
//   const popup = useRef(new mapboxgl.Popup({ offset: 15 }));

//   useEffect(() => {
//     if (!id) return;
//     const fetchFile = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3001/files/${id}`);
//         setFile(response.data);
//       } catch (error) {
//         console.error('Error fetching file:', error);
//       }
//     };
//     fetchFile();
//   }, [id]);

//   useEffect(() => {
//     if (!file || !mapContainer.current || map.current) return;

//     map.current = new mapboxgl.Map({
//       container: mapContainer.current,
//       style: 'mapbox://styles/mapbox/streets-v11',
//       center: [0, 0],
//       zoom: 2,
//     });

//     if (file.geojson) {
//       map.current.on('load', () => {
//         map.current.addSource('geojson', {
//           type: 'geojson',
//           data: file.geojson,
//         });

//         map.current.addLayer({
//           id: 'geojson-layer',
//           type: 'line',
//           source: 'geojson',
//           layout: {
//             'line-join': 'round',
//             'line-cap': 'round',
//           },
//           paint: {
//             'line-color': '#888',
//             'line-width': 2,
//           },
//         });

//         const bounds = new mapboxgl.LngLatBounds();
//         file.geojson.features.forEach((feature) => {
//           if (feature.geometry.type === 'Point') {
//             const [lng, lat] = feature.geometry.coordinates;
//             new mapboxgl.Marker()
//             .setLngLat([lng, lat])
//             .addTo(map.current)
//             .getElement()
//             .addEventListener('mouseenter', () => {
//                 popup.current.setLngLat([lng, lat]).setHTML(feature.properties.description || 'No information').addTo(map.current);
//               })
//             .addEventListener('mouseleave', () => {
//                 popup.current.remove();
//               });  
//             bounds.extend([lng, lat]);
//           } else if (feature.geometry.type === 'LineString' || feature.geometry.type === 'Polygon') {
//             feature.geometry.coordinates.forEach((coordinate) => {
//               bounds.extend(coordinate);
//             });
//           }
//         });
//         map.current.fitBounds(bounds, { padding: 20 });
//       });
//     }
    
//     return () => {
//       if (map.current) {
//         map.current.remove();
//       }
//     }
//   }, [file]);

//   return (
//     <div>
//       <nav>
//         <Link href="/">Home</Link>
//         <Link href="/upload">Upload Files</Link>
//         <Link href="/files">View Files</Link>
//       </nav>
//       <main>
//         <h1>File Details</h1>
//         {file ? (
//           <div>
//             <p>Filename: {file.filename}</p>
//             <p>Type: {file.type}</p>
//             <div ref={mapContainer} style={{ width: '100%', height: '500px' }} />
//           </div>
//         ) : (
//           <p>Loading...</p>
//         )}
//       </main>
//       <footer>© 2024 My Geo-Data App</footer>
//     </div>
//   );
// };

// export default FilePage;

// pages/file/[id].js


//--------------------------------------------------------------------------------------------

'use client'
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import Link from 'next/link';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoicGF2dW43ODYiLCJhIjoiY2x3OHNjOTJsMmhtczJqcGhqbng2MmNoaSJ9.Hh17KzDoz_MzG6DC3DQdzw';

const FilePage = ({params}) => {
 
  const id = params.slug;
  const [file, setFile] = useState(null);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const popup = useRef(new mapboxgl.Popup({ offset: 15 }));

  useEffect(() => {
    if (!id) return;

    const fetchFile = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/files/${id}`);
        setFile(response.data);
      } catch (error) {
        console.error('Error fetching file:', error);
      }
    };

    fetchFile();
  }, [id]);

  useEffect(() => {
    if (!file || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0],
      zoom: 2,
    });

    map.current.on('error', (event) => {
      console.error('Map error:', event.error);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [file]);

  useEffect(() => {
    if (!file || !map.current) return;

    const addPopupToMarker = (marker, lngLat, content) => {
      marker.getElement().addEventListener('mouseenter', () => {
        popup.current.setLngLat(lngLat).setHTML(content).addTo(map.current);
      });
      marker.getElement().addEventListener('mouseleave', () => {
        popup.current.remove();
      });
    };

    const addMarkersToMap = async () => {
      const bounds = new mapboxgl.LngLatBounds();
      for (const feature of file.geojson.features) {
        if (feature.geometry.type === 'Point') {
          const [lng, lat] = feature.geometry.coordinates;
          const address = await getAddressFromCoordinates(lat, lng);
          const marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map.current);
          const content = `<strong>${address}</strong><br>${feature.properties.description || 'No information'}`;
          addPopupToMarker(marker, [lng, lat], content);
          bounds.extend([lng, lat]);
        } else if (feature.geometry.type === 'LineString' || feature.geometry.type === 'Polygon') {
          for (const coordinate of feature.geometry.coordinates) {
            bounds.extend(coordinate);
          }
        }
      }
      map.current.fitBounds(bounds, { padding: 20 });
    };

    const getAddressFromCoordinates = async (lat, lng) => {
      try {
        const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`);
        if (response.data.features.length > 0) {
          return response.data.features[0].place_name;
        }
      } catch (error) {
        console.error('Error fetching address:', error);
      }
      return 'Address not found';
    };

    addMarkersToMap();

    return () => {
      popup.current.remove();
    };
  }, [file]);

  return (
    <div>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/upload">Upload Files</Link>
        <Link href="/files">View Files</Link>
      </nav>
      <main>
        <h1>File Details</h1>
        {file ? (
          <div>
            <p>Filename: {file.filename}</p>
            <p>Type: {file.type}</p>
            <div ref={mapContainer} style={{ width: '100%', height: '500px' }} />
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </main>
      <footer>© 2024 My Geo-Data App</footer>
    </div>
  );
};

export default FilePage;


//------------------------------------------------------------------------
