const Post        = require('../models/post');
const mongoose    = require('mongoose');

exports.getposts  = async (req, res) => { 
  try {
    const posts   = await Post.find(); 

    if (!posts || posts.length === 0) {
      return res.status(404).json({ msg: 'No blogs found' });
    }
    
    res.status(200).json({ msg: 'User posts', posts: posts }); 

  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.createpost = async (req, res) => {
  try {
    const { title, content ,email} = req.body;
    const image   = req.file;

    if (!image || !title || !content || !email) {
      return res.status(400).json({ msg: 'All feilds are required' });
    }

    // Create a new post instance
    const newPost = new Post({
      email:email,
      title: title,
      content: content,
      image: image.path, 
      postAt : new Date()
    });

    await newPost.save();

    res.status(200).json({ msg: 'Post created successfully', post: newPost });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

exports.postlike = async (req, res) => {
  try {
    const { likedEmail } = req.body;

    // Find the post by the user's email
    const post = await Post.findOne({ _id: req.params.id });

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the likedEmail is already in the IsLiked array
    const isAlreadyLiked = post.IsLiked.includes(likedEmail);

    if (isAlreadyLiked) {
      // If the post is already liked by the user, unlike it (remove the email)
      post.IsLiked = post.IsLiked.filter((user) => user !== likedEmail);
    } else {
      // If not liked, add the likedEmail to the IsLiked array
      post.IsLiked.push(likedEmail);
    }

    // Save the updated post to the database
    await post.save();
    const Allpost = await Post.find();

    console.log('Updated post-', post);

    // Return the updated post with a success message
    res.status(200).json({ msg: isAlreadyLiked ? 'Post unliked' : 'Post liked', post, Allpost });
  } catch (error) {
    console.error('Error updating like count:', error);
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

exports.postcomments = async (req, res) => {
  try {
    const { comments, userEmail } = req.body;

    if (!comments || !userEmail) {
      return res.status(400).json({ msg: 'Invalid data. Comment and usermail are required.' });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }
    const newComment = { userEmail, comments };

    post.IsComments.push(newComment);

    await post.save();
    res.status(200).json({ msg: 'Comment added successfully', post });
  } catch (error) {
    console.error('Error adding comment:', error.message);
    
    res.status(500).json({ msg: 'Server error', error: error.message });
  }
};
