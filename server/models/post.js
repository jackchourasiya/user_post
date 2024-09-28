const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  email: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true }, 
  content: { type: String, required: true },
  IsLiked: [{ type: String }],
  IsComments: [{
    userEmail: { type: String },
    comments: { type: String }
  }],
  postAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model('Post', blogSchema); 
