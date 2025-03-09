import React, { useState  } from 'react';
import axios from 'axios';
import {
  // Alert,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Modal,
  Box,
  Button,
  CircularProgress,
  TextField
} from '@mui/material';
import TranslateIcon from '@mui/icons-material/Translate';
import ArticleIcon from '@mui/icons-material/Article';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import TranslationComponent from "./components/Translate";
import NewsSummarizer from "./components/Summarize";

const Search = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [translatedText, setTranslatedText] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // State to store search query
  
  const handleSearch = async () => {
    setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5001/api/search`, {
          params: { q: searchQuery }, // Pass searchData as query param
        });
        // console.log(response.data.articles);
        setArticles(response.data.articles); // Update state with response
        // if(response.data.articles.length === 0){
        //   setError("No News found. Please try a different search query.");
        // }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching articles:", error);
        // setError("Failed to fetch articles. Please try again later.");
        setLoading(false);
      }
    };
  
   
  
  // Open modal with selected article
  const handleOpenModal = (article) => {
    setSelectedArticle(article);
  };

  // Close modal
  const handleCloseModal = () => {
    setSelectedArticle(null);
    setSummary('');
    setTranslatedText(null);
  };



  // Handle translation
  const handleTranslate = (title, description) => {
    setTranslatedText({ title, description });
  };

  // Speech synthesis configuration function
  const speechSynthesisConfig = (utterance) => {
    utterance.volume = 1; // Max volume
    utterance.rate = 1; // Normal speed
    utterance.pitch = 1; // Normal pitch
    utterance.lang = 'en-US'; // Set language to English (US)
  };
   
    // Close summarizer
    const handleCloseSummarizer = () => {
      setSummary(null);
    };
  // Handle summarization
  const handleSummarize = async (articleText) => {
    setLoadingSummary(true);
    try {
      const summaryResult = await NewsSummarizer(articleText);
      setSummary(summaryResult);
    } catch (error) {
      setSummary("Failed to generate summary.");
    } finally {
      setLoadingSummary(false);
    }
  };
  // Text-to-Speech function
  const handleSpeakAloud = (title, description) => {
    const readingText = [title, description]; // Array containing chunks of the text (title and description)

    const synthesis = speechSynthesis;
    let index = 0;

    const speakNextChunk = () => {
      if (index < readingText.length) {
        let utterance = new SpeechSynthesisUtterance(readingText[index]);
        speechSynthesisConfig(utterance);

        index++; // Increment the index to move to the next chunk

        // Add event listener to speak the next chunk after the current one finishes
        utterance.onend = () => {
          speakNextChunk(); // Call recursively to speak the next chunk
        };

        // Speak the current chunk
        synthesis.speak(utterance);
      }
    };

    // Start speaking from the first chunk
    speakNextChunk();
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  // if (error) {
  //   return (
  //     <Container sx={{ mt: 4 }}>
  //       <Alert severity="error">{error}</Alert>
  //     </Container>
  //   );
  // }

  return (
    <Container sx={{ mt: 4 }}>

<Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        News Search
      </Typography>

      {/* Search Box and Button */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search news..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </Box>
      </Box>
      <Grid container spacing={3}>
        {articles.map((article, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: 6,
                },
              }}
              onClick={() => handleOpenModal(article)}
            >
              {article.image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={article.image}
                  alt={article.title}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {article.description}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {article.source.name} - {new Date(article.publishedAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal for full article details */}
      <Modal open={!!selectedArticle} onClose={handleCloseModal}>
  <Box
    sx={{
      width: { xs: '90vw', sm: 600 }, // Responsive width
      maxWidth: '95vw', // Small gap on both sides on mobile
      bgcolor: 'white',
      p: 4,
      mx: 'auto',
      mt:4,
      boxShadow: 24,
      borderRadius: 2,
      maxHeight: '90vh', // Ensures it doesn't go off-screen
      overflowY: 'auto', // Makes it scrollable if content overflows
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }}
  >
    {selectedArticle && (
      <>
        <Button onClick={handleCloseModal} sx={{ alignSelf: 'flex-end', mb: 2 }}>X</Button>
        {selectedArticle.image && (
          <CardMedia
            component="img"
            height="300"
            image={selectedArticle.image}
            alt={selectedArticle.title}
            sx={{ borderRadius: 1  , mb:2}} // Adds slight rounding for better UI
          />
        )}
        <Typography variant="h5" gutt>
          {selectedArticle.title}
          </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          {selectedArticle.source.name} - {new Date(selectedArticle.publishedAt).toLocaleString()}
        </Typography>
        <Typography variant="body1" paragraph>
  {selectedArticle.description}{" "}
  <a
    href={selectedArticle.url}
    target="_blank"
    rel="noopener noreferrer"
    style={{ marginLeft: "5px" }}
  >
    Read more
  </a>
</Typography>

       

        {/* Buttons */}
        <Box mt={3} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {/* Translate Button */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<TranslateIcon />}
            onClick={() => handleTranslate(selectedArticle.title, selectedArticle.description)}
          >
            Translate
          </Button>

          {/* Summarize Button */}
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ArticleIcon />}
            onClick={() => handleSummarize(selectedArticle.description)}
          >
            AI Summary
          </Button>

          {/* Speak Aloud Button */}
          <Button
            variant="contained"
            color="success"
            startIcon={<VolumeUpIcon />}
            onClick={() => handleSpeakAloud(selectedArticle.title, selectedArticle.description)}
          >
            Speak Aloud
          </Button>
        </Box>

       {/* Summary Section */}
{loadingSummary && (
  <Box
    mt={2}
    p={2}
    bgcolor="#f5f5f5"
    borderRadius={2}
    position="relative"
    boxShadow={3}
  >
    <CircularProgress sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
  </Box>
)}

{summary && (
  <Box
    mt={2}
    p={3}
    bgcolor="#ffffff"
    borderRadius={2}
    position="relative"
    boxShadow={3}
  > 
    <Button
      onClick={handleCloseSummarizer}
      sx={{
        position: "absolute",
        top: 8,
        right: 8,
        minWidth: "30px",
        height: "30px",
        borderRadius: "50%",
        backgroundColor: "#ff0000",
        color: "#ffffff",
        "&:hover": {
          backgroundColor: "#cc0000",
        },
      }}
    >
      X
    </Button>

    <Typography variant="h6" fontWeight="bold" color="primary">
      Summary:
    </Typography>
    <Typography variant="body2" sx={{ mt: 1, color: "#333" }}>
      {summary}
    </Typography>
  </Box>
)}



              {/* Translated text */}
              {translatedText && (
                <Box mt={2}>
                  <TranslationComponent title={translatedText.title} description={translatedText.description} />
                </Box>
              )}
        
      </>
    )}
  </Box>
</Modal>
    </Container>
  );
};

export default Search;