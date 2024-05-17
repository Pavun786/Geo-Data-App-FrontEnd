// components/Map.js

'use client'
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import axios from 'axios';

mapboxgl.accessToken = 'pk.eyJ1IjoicGF2dW43ODYiLCJhIjoiY2x3OHNjOTJsMmhtczJqcGhqbng2MmNoaSJ9.Hh17KzDoz_MzG6DC3DQdzw';

const Map = () => {
  const mapContainerRef = useRef(null);
  const draw = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    const fetchMarkers = async () => {
      const response = await axios.get('http://localhost:3001/markers');
      setMarkers(response.data);
    };

    fetchMarkers();

    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40],
      zoom: 9
    });

    draw.current = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        point: true,
        trash: false
      }
    });

    mapInstance.addControl(draw.current);

    mapInstance.on('draw.create', updateMarkers);
    mapInstance.on('draw.delete', updateMarkers);
    mapInstance.on('draw.update', updateMarkers);
    mapInstance.on('click', (e) => {
      const features = mapInstance.queryRenderedFeatures(e.point, {
        layers: ['gl-draw-point-inactive.hot', 'gl-draw-point-inactive.cold']
      });

      if (features.length) {
        setSelectedMarker(features[0]);
      } else {
        setSelectedMarker(null);
      }
    });

    setMap(mapInstance);

    return () => mapInstance.remove();
  }, []);

  useEffect(() => {
    if (map && markers.length > 0) {
      markers.forEach(marker => {
        draw.current.add(marker);
      });
    }
  }, [map, markers]);

  async function updateMarkers(e) {
    if (e.type === 'draw.create') {
      const newMarker = e.features[0];
      console.log(newMarker)
      await axios.post('http://localhost:3001/markers', newMarker);
    } else if (e.type === 'draw.delete') {
      const deletedMarkerId = e.features[0].properties.id;
      await axios.delete(`http://localhost:3001/markers/${deletedMarkerId}`);
    } else if (e.type === 'draw.update') {
      const updatedMarker = e.features[0];
      await axios.put(`http://localhost:3001/markers/${updatedMarker.properties.id}`, updatedMarker);
    }

    const response = await axios.get('http://localhost:3001/markers');
    setMarkers(response.data);
  }

  const handleSave = async () => {
    if (selectedMarker) {
      const updatedMarker = { ...selectedMarker };
      await axios.put(`http://localhost:3001/markers/${updatedMarker.properties.id}`, updatedMarker);
      const response = await axios.get('http://localhost:3001/markers');
      setMarkers(response.data);
    }
  };

  const handleDelete = async () => {
    if (selectedMarker) {
      const markerId = selectedMarker.properties.id;
      await axios.delete(`http://localhost:3001/markers/${markerId}`);
      setSelectedMarker(null);
      const response = await axios.get('http://localhost:3001/markers');
      setMarkers(response.data);
    }
  };

  return (
    <div>
      <div ref={mapContainerRef} style={{ width: '100%', height: '500px' }} />
      <div style={{ marginTop: '10px' }}>
        <button onClick={handleSave} disabled={!selectedMarker}>Save Marker</button>
        <button onClick={handleDelete} disabled={!selectedMarker}>Delete Marker</button>
      </div>
    </div>
  );
};

export default Map;
