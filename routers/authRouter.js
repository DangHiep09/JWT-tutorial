const {
  registerUser,
  loginUser,
  logoutUser,
  demo,
  dele,
  refreshToken,
} = require('../controllers/authController')

const {
  verifyAccessToken,
} = require('../middlewares/token')
const router = require('express').Router()
// REGISTER 
router.post('/token', refreshToken)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.delete('/logout', logoutUser)
router.get('/greet', verifyAccessToken(['user','admin']), demo)
router.get('/delete', verifyAccessToken(['admin']), dele)

module.exports = router