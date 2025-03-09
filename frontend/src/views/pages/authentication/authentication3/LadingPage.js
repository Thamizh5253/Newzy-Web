import React from 'react';
import { AppBar, Toolbar, Button, Typography, Container, Grid, Card, CardContent, Box } from '@mui/material';
import { Article, Translate, Summarize, VolumeUp, Login, HowToReg, ArrowForward } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F5F5F5' }}>
      
      {/* Navbar */}
      <AppBar position="static" sx={{ bgcolor: "#1976D2" }}>
        <Toolbar>
          <Typography variant="h2" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1, color: 'white' }}>
            Newzy
          </Typography>
          <Button
            component={Link} to="/pages/login/login3"
            sx={{
              mx: 1,
              px: 3,
              py: 1,
              borderRadius: '8px',
              background: 'white',
              color: "#1976D2",
              '&:hover': { background: '#E3F2FD' }
            }}
            startIcon={<Login />}
          >
            Login
          </Button>
          <Button
            component={Link} to="/pages/register/register3"
            sx={{
              px: 3,
              py: 1,
              borderRadius: '8px',
              background: 'white',
              color: "#1976D2",
              '&:hover': { background: '#E3F2FD' }
            }}
            startIcon={<HowToReg />}
          >
            Register
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#1976D2' }}>
          Stay Informed with Newzy
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', margin: '0 auto' }}>
          Get real-time news updates, AI-powered summaries, regional language translations, and text-to-speech features all in one place.
        </Typography>
      </Container>

      {/* Features Section */}
      <Container sx={{ mt: 8, mb: 8 }}>
        <Grid container spacing={4}>
          {[ 
            { icon: <Article />, title: "Real-Time News", desc: "Access the latest news from trusted sources in real-time." },
            { icon: <Translate />, title: "Regional Language Translator", desc: "Read news in your preferred language with our built-in translator." },
            { icon: <Summarize />, title: "AI Summarizer", desc: "Get concise summaries of lengthy articles using advanced AI." },
            { icon: <VolumeUp />, title: "Text-to-Speech", desc: "Listen to news articles on the go with our text-to-speech feature." }
          ].map((feature, index) => (
            <Grid item xs={12} md={3} key={index}>
              <Card 
                sx={{
                  textAlign: 'center', 
                  p: 3, 
                  boxShadow: 3,
                  borderRadius: '12px',
                  transition: '0.3s',
                  '&:hover': { boxShadow: 6 } 
                }}
              >
                <CardContent>
                  <Box sx={{ fontSize: 60, color: '#1976D2', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Get Started Button */}
      <Box textAlign="center" sx={{ mb: 6 }}>
        <Button
          component={Link} to="/pages/login/login3"
          variant="contained"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: '8px',
            fontSize: '1rem',
            background: '#1976D2',
            color: 'white',
            '&:hover': { background: '#1565C0' }
          }}
          endIcon={<ArrowForward />}
        >
          Get Started
        </Button>
      </Box>

     

      {/* Footer */}
      <Box sx={{ mt: 'auto' }}>
        <AppBar position="static" sx={{ bgcolor: "#1976D2", py: 2 }}>
          <Toolbar sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: "white" }}>
              © 2025 Newzy - News Aggregator. All rights reserved.
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    </Box>
  );
}

export default LandingPage;