const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const http = require('http')
const SocketIO = require('socket.io')


const app = express()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

const server = http.createServer(app)
const io = SocketIO(server)
server.listen(8000, "localhost")

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })

  const nsp = io.of('home')
  nsp.on('connection', (socket) => {
    console.log("socket.connected", socket.id)

    // socket.on('subscribe', function(room) {
    //   console.log('joining room', room);
    //   socket.join(room);
    // })

    socket.on('disconnect', () => {
      consola.info('client disconnected')
    })
    socket.on('chat message', (msg) => {
      console.log({msg})
      nsp.emit('chat message', msg)
    })
  })
}
start()
