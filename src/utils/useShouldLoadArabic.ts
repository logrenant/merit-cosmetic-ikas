import { useEffect, useState } from 'react';

interface LocationData {
  country_code?: string;
  isLoading: boolean;
  error?: string;
}

const ARABIC_SPEAKING_COUNTRIES = [
  { iso2: 'AE', iso3: 'ARE' },
  { iso2: 'BH', iso3: 'BHR' },
  { iso2: 'DZ', iso3: 'DZA' },
  { iso2: 'DJ', iso3: 'DJI' },
  { iso2: 'EG', iso3: 'EGY' },
  { iso2: 'ER', iso3: 'ERI' },
  { iso2: 'IQ', iso3: 'IRQ' },
  { iso2: 'JO', iso3: 'JOR' },
  { iso2: 'KW', iso3: 'KWT' },
  { iso2: 'LB', iso3: 'LBN' },
  { iso2: 'LY', iso3: 'LBY' },
  { iso2: 'MR', iso3: 'MRT' },
  { iso2: 'MA', iso3: 'MAR' },
  { iso2: 'OM', iso3: 'OMN' },
  { iso2: 'PS', iso3: 'PSE' },
  { iso2: 'QA', iso3: 'QAT' },
  { iso2: 'SA', iso3: 'SAU' },
  { iso2: 'SO', iso3: 'SOM' },
  { iso2: 'SD', iso3: 'SDN' },
  { iso2: 'SY', iso3: 'SYR' },
  { iso2: 'TN', iso3: 'TUN' },
  { iso2: 'YE', iso3: 'YEM' },
  { iso2: 'EH', iso3: 'ESH' },
  { iso2: 'TD', iso3: 'TCD' },
  { iso2: 'KM', iso3: 'COM' },
  { iso2: 'NL', iso3: 'NLD' },
  { iso2: 'US', iso3: 'USA' }
];

export const useShouldLoadArabic = () => {
  const [location, setLocation] = useState<LocationData>({ isLoading: true });

  useEffect(() => {
    const cached = sessionStorage.getItem('user-location-country-code');
    if (cached) {
      console.log('🌎 [useShouldLoadArabic] Cached location detected:', cached);
      setLocation({ country_code: cached, isLoading: false });
      return;
    }

    const fetchLocation = async () => {
      try {
        console.log('🌎 [useShouldLoadArabic] Fetching location from ipapi.co...');
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();

        if (data.country_code) {
          console.log('🌎 [useShouldLoadArabic] Geolocation API response:', data);
          sessionStorage.setItem('user-location-country-code', data.country_code);
          setLocation({ country_code: data.country_code, isLoading: false });
        } else {
          console.log('🌎 [useShouldLoadArabic] Geolocation API error: No country_code found', data);
          setLocation({ isLoading: false, error: 'No country_code' });
        }
      } catch (err) {
        console.error('🌎 [useShouldLoadArabic] Location fetch failed:', err);
        setLocation({ isLoading: false, error: 'Request failed' });
      }
    };

    fetchLocation();
  }, []);

  const shouldLoadArabic =
    !location.isLoading &&
    location.country_code !== undefined &&
    ARABIC_SPEAKING_COUNTRIES.some(
      (c) => c.iso2 === location.country_code || c.iso3 === location.country_code
    );
    
  // Log the final result
  useEffect(() => {
    if (!location.isLoading) {
      console.log('🌎 [useShouldLoadArabic] Final result:', {
        countryCode: location.country_code,
        shouldLoadArabic,
        isArabicCountry: location.country_code ? 
          ARABIC_SPEAKING_COUNTRIES.some(c => c.iso2 === location.country_code || c.iso3 === location.country_code) : 
          false,
        arabicCountriesList: ARABIC_SPEAKING_COUNTRIES.map(c => c.iso2),
        error: location.error
      });
    }
  }, [location.isLoading, location.country_code, shouldLoadArabic, location.error]);

  return {
    shouldLoadArabic,
    countryCode: location.country_code,
    isLoading: location.isLoading,
    error: location.error
  };
};
