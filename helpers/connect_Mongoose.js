const mongoose = require('mongoose')
const URI = process.env.MONGODB_URI
// connect db
const connectDB = async () => {
  try {
    await mongoose.connect(URI)
    console.log('Client connected to Mongo to use')
  } catch (err) {
    console.log(err)
  }
}
module.exports = connectDB
