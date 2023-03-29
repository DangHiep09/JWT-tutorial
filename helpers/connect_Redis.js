const redis = require('redis')

const client = redis.createClient({
  password: 'Fb3LtniUAptuNHKJp1IralG5B48rp7DN',
  socket: {
    host: 'redis-19938.c295.ap-southeast-1-1.ec2.cloud.redislabs.com',
    port: 19938,
  },
})

client.on('error', (err) => console.log('Redis Client Error', err))

client.connect()
client.on('connect',() => console.log('Redis Client OK', ))

// client.disconnect()

module.exports = client
