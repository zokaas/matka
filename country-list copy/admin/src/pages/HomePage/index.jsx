import React, { useState } from 'react';
import axios from 'axios';
import './styles.css';

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);

  const checkIfCountryExists = async (name, lang) => {
    try {
      const query = `filters[${lang}][$eq]=${encodeURIComponent(name)}`;
      const response = await axios.get(`/api/country-lists?${query}`);
      return response.data.data.length > 0;
    } catch (error) {
      console.error(`Error checking if country exists (${lang}): ${name}`, error);
      return false;
    }
  };

  const getCountryTranslations = (country) => ({
    en: country.name?.common,
    se: country.translations?.swe?.common,
    fi: country.translations?.fin?.common,
    nl: country.translations?.nld?.common,
  });

  const populateCountryList = async () => {
    setLoading(true);
    setMessage('');
    setProgress(0);

    try {
      const response = await axios.get(
        'https://restcountries.com/v3.1/all?fields=name,translations'
      );
      const countries = response.data;
      const total = countries.length;

      for (let i = 0; i < total; i++) {
        const country = countries[i];
        const { en, se, fi, nl } = getCountryTranslations(country);

        const [existsEnglish, existsSwedish, existsFinnish, existsDutch] = await Promise.all([
          en ? checkIfCountryExists(en, 'en') : false,
          se ? checkIfCountryExists(se, 'se') : false,
          fi ? checkIfCountryExists(fi, 'fi') : false,
          nl ? checkIfCountryExists(nl, 'nl') : false,
        ]);

        const newData = {};
        if (en && !existsEnglish) newData.en = en;
        if (se && !existsSwedish) newData.se = se;
        if (fi && !existsFinnish) newData.fi = fi;
        if (nl && !existsDutch) newData.nl = nl;

        if (Object.keys(newData).length > 0) {
          try {
            await axios.post(`/api/country-lists`, { data: newData });
          } catch (error) {
            console.error(`Failed to post ${en} to Strapi:`, error);
          }
        }

        setProgress(Math.round(((i + 1) / total) * 100));
      }

      setMessage('Country data population completed.');
    } catch (error) {
      console.error('Error fetching countries from REST Countries API:', error);
      setMessage('Error fetching countries. Please check the console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="plugin-container">
      <header className="plugin-header">
        <h1>Welcome to the Country List Plugin</h1>
      </header>
      <main className="plugin-content">
        <p>
          This plugin fetches and stores a list of countries with their names in Swedish, Finnish, and Dutch.
          By clicking the button below, you can fetch the latest list of countries in your Strapi application.
        </p>
        <button className="fetch-button" onClick={populateCountryList} disabled={loading}>
          {loading ? 'Fetching the countries...' : 'Fetch Countries'}
        </button>

        {loading && (
          <div className="progress-bar-wrapper">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
            <div className="progress-label">{progress}%</div>
          </div>
        )}

        {message && <p className="plugin-message">{message}</p>}
      </main>
    </div>
  );
};

export default HomePage;
