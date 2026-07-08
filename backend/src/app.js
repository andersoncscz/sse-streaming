const express = require('express')
const cors = require('cors')

const redisConnection = require('./redisConnection')
const port = 8080

const app = express()
app.use(cors({
  origin: '*', 
  methods: ['GET', 'OPTIONS']
}))

// Global registry to keep track of all active user streams on this instance
let activeClients = [];

app.get('/stream', async (req, res) => {
  console.log(`Stream established on instance: ${process.env.HOSTNAME || 'unknown'}`);

  res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
    }
  )

  
  res.write(': connected\n\n')

  activeClients.push(res);

  req.on('close', async () => {
    // Remove this user from the active clients array so we stop sending them data
    activeClients = activeClients.filter(client => client !== res);
    res.end();
    console.log(`Stream disconnected. Remaining clients on this instance: ${activeClients.length}`);
  })
})

app.listen(port, async () => {
  // Single global subscriber instance
  await redisConnection.connect()

  const globalSubscriber = redisConnection.getClient().duplicate();
  await globalSubscriber.connect()

  console.log(`App listening on port ${port}`)

  // Subscriptions
  globalSubscriber.subscribe('notification_topic', async (message) => {
    if (!message || !message.trim().length || activeClients.length === 0) {
      return;
    }

    const payload = `event: notification\ndata: ${message}\n\n`

    activeClients.forEach(client => client.write(payload));
  })
})
