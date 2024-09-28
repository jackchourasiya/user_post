const bcrypt  =   require('bcryptjs');
const jwt     =   require('jsonwebtoken');
const User    =   require('../models/User');

exports.register = async (req, res) => {
  const { username, password, email } = req.body;

  // Validate input fields
  if (!username || !password || !email) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    // Check if user exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ 
      username, 
      email, 
      password: hashedPassword 
    });

    await newUser.save();

    return res.status(201).json({ msg: 'Registration successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Server error' });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1h'
    });

    return res.status(200).json({ msg: 'Login successful', token ,userinfo:user});
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ msg: 'Internal server error' });
  }
};
