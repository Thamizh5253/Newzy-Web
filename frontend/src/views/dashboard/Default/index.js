import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import NewsImage from '../../../ui-component/Logo.webp'; // Ensure you have an image in your project
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

  const navigate = useNavigate();

  const handleReadNow = () => {
    navigate('/utils/top-headlines');
  };
  return (
    <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100vh', justifyContent: 'center' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <img src={NewsImage} alt="News" style={{ width: '20%', borderRadius: '10px', marginBottom: '20px' }} />
        <Typography variant="h2" fontWeight={700} color="primary" gutterBottom>
          Welcome to Newzy
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          Stay updated with the latest news from around the world. Your source for trusted journalism.
        </Typography>
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button variant="contained" color="primary" size="large" onClick={handleReadNow}>
            Read Now
          </Button>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default Dashboard;
