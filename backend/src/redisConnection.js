const { RedisClient } = require('redis')

class RedisConnection {
  constructor() {
    this.client = null
  }

  async connect() {
    if (this.client) {
      return this.client
    }

    try {
      this.client = new RedisClient({
        url: 'redis://redis:6379',
      })

      await this.client.connect()
      console.log('Connection to Redis succeeded!')

      return this.client
    } catch (error) {
      console.log('Failed to connect to Redis')
      this.client = null

      throw error
    }
  }

  getClient() {
    if (!this.client) {
      throw new Error(
        'Redis client is not connected. Call connect() first.'
      )
    }

    return this.client
  }
}

const redisInstance = new RedisConnection()
module.exports = redisInstance
