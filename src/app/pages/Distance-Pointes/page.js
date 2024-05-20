'use client'
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import {API} from '../../Global'

mapboxgl.accessToken = "pk.eyJ1IjoicGF2dW43ODYiLCJhIjoiY2x3OHNjOTJsMmhtczJqcGhqbng2MmNoaSJ9.Hh17KzDoz_MzG6DC3DQdzw";

const Mapbox = () => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [point1, setPoint1] = useState(null);
    const [point2, setPoint2] = useState(null);
    const [distance, setDistance] = useState(null);
    const [savedPoints, setSavedPoints] = useState([]);
  
    useEffect(() => {
      const fetchPoints = async () => {
        const response = await fetch(`${API}/api/get-points`);
        const data = await response.json();
        setSavedPoints(data);
  
        if (map.current) {
          data.forEach(point => {
            new mapboxgl.Marker().setLngLat(point.point1).addTo(map.current);
            new mapboxgl.Marker().setLngLat(point.point2).addTo(map.current);
          });
        }
      };
  
      fetchPoints();
  
      if (map.current) return; // initialize map only once
  
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.5, 40],
        zoom: 9,
      });
  
      map.current.on('click', (e) => {
        const coordinates = [e.lngLat.lng, e.lngLat.lat];
  
        if (!point1) {
          setPoint1(coordinates);
          new mapboxgl.Marker().setLngLat(coordinates).addTo(map.current);
        } else if (!point2) {
          setPoint2(coordinates);
          new mapboxgl.Marker().setLngLat(coordinates).addTo(map.current);
        }
      });
    }, [point1, point2]);
  
    useEffect(() => {
      if (point1 && point2) {
        const from = turf.point(point1);
        const to = turf.point(point2);
        const options = { units: 'kilometers' };
        const calculatedDistance = turf.distance(from, to, options);
        setDistance(calculatedDistance);
  
        savePoints(point1, point2);
      }
    }, [point1, point2]);
  
    const savePoints = async (p1, p2) => {
      const response = await fetch(`${API}/api/save-points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          point1: p1,
          point2: p2,
        }),
      });
  
      const data = await response.json();
      console.log(data.message);
    };
  
    return (
      <div>
        <div ref={mapContainer} style={{ width: '100%', height: '400px' }} />
        {point1 && <p>Point 1: {point1.join(', ')}</p>}
        {point2 && <p>Point 2: {point2.join(', ')}</p>}
        {distance && <p>Distance: {distance.toFixed(2)} km</p>}
        <div>
          <h2>Saved Points</h2>
          {savedPoints.map((points, index) => (
            <div key={index}>
              <p>Point 1: {points.point1.join(', ')}</p>
              <p>Point 2: {points.point2.join(', ')}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Mapbox;
  