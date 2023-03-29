const jwt = require('jsonwebtoken')
const client = require('../helpers/connect_Redis')



const verifyAccessToken = (roles) => {
  return (req, res, next) => {
    const authHeader = req.headers.token
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
      return res.status(401).json({ message: 'Missing token' })
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' })
      }
      // AUTHORIZION 
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Forbidden' })
      }

      req.user = decoded
      next()
    })
  }
}


const verifyRefreshToken = async (refreshToken) => {
  try {
    const payload = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const reply = await client.get(payload.id)
    if (refreshToken == reply) {
      // console.log(payload);
      return payload
    }
  } catch (err) {
    console.log(err);
  }
}
const signAccessToken = async (user) => {
  try {
    const payload = { id: user._id, role: user.role }
    const secret = process.env.ACCESS_TOKEN_SECRET
    const option = { expiresIn: '1m' }
    return await jwt.sign(payload, secret, option)
  } catch (error) {
    console.log(error);
  }
}
const signRefreshToken = async (user) => {
  try {
    const payload = { id: user.id, role: user.role }
    const secret = process.env.REFRESH_TOKEN_SECRET
    const option = { expiresIn: '7d' }

    const id = user.id.toString()
    const token = await jwt.sign(payload, secret, option);
    await client.set(id, token, 'EX', 7 * 24 * 60 * 60)
    return token
  } catch (error) {
    console.log(`:::::::${error}`);
  }
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
}
