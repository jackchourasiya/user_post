const express = require('express');
const {getposts,postlike,postcomments,createpost} = require('../controllers/postController');
const auth = require('../middleware/authMiddleware');
const router = express.Router();
const upload = require('../middleware/upload');

router.get('/posts', getposts);
router.post('/posts/like/:id', auth, postlike);
router.post('/posts/comment/:id', auth, postcomments);
router.post('/createpost', auth, upload.single('image'), createpost);

module.exports = router;
