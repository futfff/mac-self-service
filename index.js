import express from 'express'
import path from 'path'
import serverRoutes from './routes/server.js' 
import { PrismaClient } from '@prisma/client'
import http from 'http';
import WebSocket , { WebSocketServer } from 'ws'

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server : server });

const prisma = new PrismaClient()
const PORT = 3000
const dir = path.resolve()

app.set('view engine' , 'ejs')
app.set('views' , path.resolve(dir , 'temp'))


app.use(express.json())
app.use(express.urlencoded({extended: false }))
app.use(serverRoutes)
app.use(express.static(path.resolve(dir , 'static')))

wss.on('connection', (ws , req) => {
  ws.on('message', (message) => {
    
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN){
        client.send( `${message}`)
      }
    })
  });
});

app.get('/' , (req , res) => {
    res.render('index' )
})

app.get('/admin/' , (req , res) =>{
    res.render('admin')
})

app.get('/orders/' , (req , res) =>{
  res.render('orders')
})


app.get('/order/:id' , async (req , res) => {
    const ID = req.params.id
    const order = await prisma.order.findUnique({
        where: {
            id: parseInt(ID),
        },
        include: {
          con: {
            include: {
              food: true,
            }
          }
        }
      })
      res.render('order' , {order : order})
})


server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/`);
  });

