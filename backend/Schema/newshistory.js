const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true, unique: true }, // Prevents duplicate content
  description: { type: String },
  image: { type: String },
  publishedAt: { type: Date, required: true },
  source: {
    name: { type: String, required: true },
    url: { type: String, required: true }
  },
  username: { type: String, required: true }, // Store username from token

  articleUrl: { type: String, required: true }
}, { timestamps: true });

const News = mongoose.model('News', newsSchema);
module.exports = News;
