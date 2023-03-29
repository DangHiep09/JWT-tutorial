const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')
const connectDB = require('./helpers/connect_Mongoose')
const cookieParser = require('cookie-parser')

// set up dotenv
const PORT = process.env.PORT || 8080
connectDB()
// const client = require('./helpers/connect_Redis');

// client.set('key', 'value')
// client
//   .get('')
//   .then((value) => {
//     console.log(value)
//   })


app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())

// ROUTER

app.use('/v1' ,require("./routers/authRouter"));
// app.use('/v2', require('./routers/index'))

app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

app.listen(PORT, () => {
  console.log(`listen on port ${PORT}`)
})
