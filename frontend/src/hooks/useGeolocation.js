import { useState, useEffect } from 'react';

export function useGeolocation() {
  const [location, setLocation] = useState({
    city: 'Brooklyn, NY',
    lat: 40.6782,
    lng: -73.9442,
    loading: false,
    error: null,
  });

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocation(prev => ({ ...prev, error: 'Geolocation is not supported by browser' }));
      return;
    }

    setLocation(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          city: 'Brooklyn, NY (Detected)',
          lat: latitude,
          lng: longitude,
          loading: false,
          error: null,
        });
      },
      (error) => {
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: 'Location access denied. Defaulting to Brooklyn, NY.',
        }));
      }
    );
  };

  return { ...location, detectLocation };
}
