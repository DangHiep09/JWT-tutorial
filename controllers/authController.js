const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  
} = require('../middlewares/token')
const client = require('../helpers/connect_Redis')

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body
    // Check if user with the same email or username already exists
    const existUser = await User.findOne({ email })
    if (existUser) {
      return res.status(400).json({ message: 'User already exists' })
    }
    // HASH
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    // Create new user
    const user = new User({
      username: username,
      email: email,
      password: hashedPassword,
    })
    await user.save()

    res.status(201).json({ user })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: 'Server Error' })
  }
}

const loginUser = async (req, res) => {
  const { email, password } = req.body

  try {
    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    // Generate JWT token
    const accessToken = await signAccessToken(user)
    const refreshToken = await signRefreshToken(user)
    res.json({ accessToken, refreshToken })
    
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
}


// TẠO LẠI ACCESS TOKEN MỚI 
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { id, role } = await verifyRefreshToken(refreshToken)
    
    const user = { id, role }
    // console.log(user);
    // TẠO ACCESS VÀ REFRESH TOKEN MỚI  
    const newAccessToken = await signAccessToken(user)
    const newRefreshToken = await signRefreshToken(user)
    res.json({newAccessToken, newRefreshToken})
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
}

const logoutUser = async (req, res,next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(401).json({ error: 'Access denied' })
    }
    const token = await verifyRefreshToken(refreshToken)

    await client.del(token.id)
    res.json({ message: 'Logout successful' })
  } catch (error) {
    res.status(404).json({ error: 'Something went wrong' })
  }
}

const demo = (req, res) => {
  res.send('đây là admin')
}
const dele = (req, res) => {
  res.send('đã xóa user')
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
  demo,
  dele,
}
