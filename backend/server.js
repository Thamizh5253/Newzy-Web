const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./db");
const http = require("http");
const axios = require('axios');


const UserRegister = require("./Schema/register");
const News = require('./Schema/newshistory');
const { console } = require("inspector");


require("dotenv").config();
const app = express();

// CORS Configuration
app.use(
  cors({
    origin: ["http://localhost:3000","https://gnews.io"],

    methods: ["POST", "GET", "PUT"],
    credentials: true,
  })
);

// app.use(cors());

app.use(express.json({ limit: "20mb" }));
app.use(bodyParser.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5001;


// Connect to the database
db.connect();

// Middleware to extract username from token
const getUsernameFromToken = async (req) => {
  try {
    const token = req.cookies.token;
    if (!token) return null;

    return new Promise((resolve, reject) => {
      jwt.verify(token, "secret_key", (err, decoded) => {
        if (err) {
          console.error("Token verification failed:", err.message);
          resolve(null); // Return null instead of ending response
        } else {
          resolve(decoded.name);
        }
      });
    });
  } catch (error) {
    return null;
  }
};


// API endpoint to fetch data from GNews and store in DB
app.get('/api/top-headlines', async (req, res) => {
  try {
    const username = await getUsernameFromToken(req);
    if (!username) return res.status(401).json({ error: 'Unauthorized' });

    
    const API_URL = `https://gnews.io/api/v4/top-headlines?token=${process.env.GNEWS_API_KEY}&lang=en&country=in&max=10`;
    const response = await axios.get(API_URL);
    // console.log(response.data);
    for (const article of response.data.articles) {
      await News.updateOne(
        { content: article.content }, // Check if the news exists
        {
          $set: { 
            title: article.title,
            content: article.content,
            description: article.description,
            image: article.image,
            publishedAt: article.publishedAt,
            source: { name: article.source.name, url: article.url },
            articleUrl: article.url,
          },
          $addToSet: { username: username } // Add user if not already present
        },
        { upsert: true } // Insert if not found
      );
    }
    
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// API endpoint to search data from GNews and store in DB
app.get('/api/search', async (req, res) => {
  try {
    const username = await getUsernameFromToken(req);
    if (!username) return res.status(401).json({ error: 'Unauthorized' });

    const query = req.query.q || 'india';
    const API_URL = `https://gnews.io/api/v4/search?q=${query}&token=${process.env.GNEWS_API_KEY}&lang=en&country=in&max=10`;
    const response = await axios.get(API_URL);

    console.log("News API Response:", response.data);

    for (const article of response.data.articles) {
      await News.updateOne(
        { content: article.content }, // Check if the news exists
        {
          $set: { 
            title: article.title,
            content: article.content,
            description: article.description,
            image: article.image,
            publishedAt: article.publishedAt,
            source: { name: article.source.name, url: article.url },
            articleUrl: article.url,
          },
          $addToSet: { username: username } // Add user if not already present
        },
        { upsert: true } // Insert if not found
      );
    }
    

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});


app.get('/api/translate', async (req, res) => {
  const { q, langpair } = req.query;
  const response = await axios.get('https://api.mymemory.translated.net/get', {
    params: { q, langpair },
  });
  res.json(response.data);
});

app.get('/api/history', authenticateToken, async (req, res) => {
  try {
    const username = req.name; // Extracted from JWT token middleware

    if (!username) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Find news where the user is present in the "users" array
    const userHistory = await News.find({ username: username });

    if (userHistory.length === 0) {
      return res.status(404).json({ message: 'No history found' });
    }

    res.json(userHistory);
  } catch (error) {
    console.error('Error fetching user history:', error);
    res.status(500).json({ error: 'Failed to fetch user history' });
  }
});




const server = http.createServer(app);





app.post("/api/storeEditedUserData", async (req, res) => {
  try {
    const { username, formData } = req.body;

    // Update the document in MongoDB with the provided ID
    const updatedUser = await UserRegister.findOneAndUpdate(
      { email: username },
      formData,
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).send("User not found");
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error while updating user:", error);
    res.status(500).send("Error while updating user");
  }
});
//changepassword

app.post("/api/changepassword", async (req, res) => {
  try {
    const { username, passwordData } = req.body;
    const { currentPassword, newPassword } = passwordData;
    if (!currentPassword || !newPassword) {
      return res.status(400).send("Please provide required Datas !");
    }

    // Find the user by username (email)
    const user = await UserRegister.findOne({ email: username });
    if (!user) {
      return res.status(400).send("User not found");
    }

    // Check if the provided current password matches the stored encrypted password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(400).send("Current password is incorrect");
    }

    // Hash the new password before updating
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error while updating user password:", error);
    res.status(500).send("Error while updating user password");
  }
});


// GET endpoint to retrieve user account data to edit
app.get("/api/fetchEditAccountInfo/:username", async (req, res) => {
  const email = req.params.username;

  try {
    // Find the document by ID
    const accountData = await UserRegister.findOne({ email: email });

    if (!accountData) {
      return res.status(404).json({ error: "Service type not found" });
    }

    // Send the found document as a response
    res.json(accountData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch account data" });
  }
});


//fetchusername
app.get("/api/fetchusername/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const results = await UserRegister.find({ email: username }).select(
      "fname lname"
    );

    if (results.length === 0) {
      return res.json({ message: false });
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    // Extract form data from the request body
    const { email, password, fname, lname, mobile } = req.body;

    // Check if the email already exists in the database
    const existingUser = await UserRegister.findOne({ email });

    if (existingUser) {
      // If user already exists, respond with a message
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user document with hashed password
    const newUser = new UserRegister({
      email,
      password: hashedPassword,
      fname,
      lname,
      mobile,
    });

    // Save the user document to the database
    await newUser.save();

    // Respond with a success message
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    // Respond with an error message if something goes wrong
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await UserRegister.findOne({ email });

  // If user not found, respond with error
  if (!user) {
    return res.status(200).json({ message: "Invalid credentials" });
  }

  // Compare hashed password with the provided password
  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) {
      return res.status(200).json({ message: "Invalid credentials" });
    } else {
      // Generate JWT token
      const name = user.email;
      
      const token = jwt.sign({ name }, "secret_key", {
        expiresIn: "5h",
      });
      // Set token in cookie
      res.cookie("token", token);

      
      // // Set token in cookie with secure and httpOnly flags
      // res.cookie("token", token, {
      //   httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
      //   secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      //   sameSite: "strict", // Prevent CSRF
      // });
      // Send success response
      res.status(200).json({ message: "Login successful", token });
    }
  });
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  // Log cookies received with the request

  const token = req.cookies.token;

  // if (!token) {
  //   return res.status(200).json({ message: "Unauthorized" });
  // }

  jwt.verify(token, "secret_key", (err, decoded) => {
    if (err) {
      console.error("Token verification failed:", err.message); // Log error message
      return res.status(200).json({ message: "Forbidden" });
    } else {
      req.name = decoded.name;

      next();
    }
  });
}

// Route for dashboard
app.get("/", authenticateToken, (req, res) => {
  // The decoded token information is available in req.user
  return res.json({ Status: "Success", name: req.name });
});
// Define a logout route
app.get("/logout", (req, res) => {
  // Clear the token cookie by setting an expired token
  res.clearCookie("token");
  res.json({ message: "Logout successful" });
});




// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
