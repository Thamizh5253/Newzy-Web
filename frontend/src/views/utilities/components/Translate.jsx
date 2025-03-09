import React, { useState } from 'react';
import axios from 'axios';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

const TranslationComponent = ({ title, description }) => {
  const [targetLang, setTargetLang] = useState('hi'); // Default: Hindi
  const [translatedData, setTranslatedData] = useState({ title: '', description: '' });

  const languages = [
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'kn', name: 'Kannada' },
    { code: 'bn', name: 'Bengali' },
    { code: 'mr', name: 'Marathi' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
  ];

  const handleTranslate = async () => {
    try {
      // const titleTranslation = await axios.get('https://api.mymemory.translated.net/get', {
      //   params: { q: title, langpair: `en|${targetLang}` },
      // });

      // const descTranslation = await axios.get('https://api.mymemory.translated.net/get', {
      //   params: { q: description, langpair: `en|${targetLang}` },
      // });
      const titleTranslation = await axios.get('http://localhost:5001/api/translate', {
        params: { q: title, langpair: `en|${targetLang}` },
      });
      
      const descTranslation = await axios.get('http://localhost:5001/api/translate', {
        params: { q: description, langpair: `en|${targetLang}` },
      });
      setTranslatedData({
        title: titleTranslation.data.responseData.translatedText,
        description: descTranslation.data.responseData.translatedText,
      });
    } catch (error) {
      console.error('Error translating:', error);
    }
  };

  return (
    <Box sx={{ mt: 2, p: 2, bgcolor: '#f9f9f9', borderRadius: 2 }}>
      <Typography variant="h6">Translate News</Typography>
      <FormControl fullWidth sx={{ my: 2 }}>
        <InputLabel>Your Language</InputLabel>
        <Select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
          {languages.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              {lang.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleTranslate} fullWidth>
        Translate
      </Button>

      {translatedData.title && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h4" sx={{ color: '#2c3e50' , mb:1 }}>{translatedData.title}</Typography>
          <Typography variant="body2">{translatedData.description}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default TranslationComponent;
