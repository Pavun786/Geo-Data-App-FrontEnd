'use client'
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import Link from 'next/link';
import 'mapbox-gl/dist/mapbox-gl.css';
import {API} from '../../../Global'

mapboxgl.accessToken = process.env.ACCESS_KEY;

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
        const response = await axios.get(`${API}/route/files/${id}`);
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
