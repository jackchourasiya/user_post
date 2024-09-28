const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const authRoutes = require('./routes/authRoutes'); 
const postRoutes = require('./routes/postRoutes'); 
require('dotenv').config();

app.use(cors());
app.use(express.json());
// Use the authentication routes
app.use(authRoutes);
app.use(postRoutes);
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

app.listen(process.env.PORT || 5000, () => console.log('Server running on port 5000'));
