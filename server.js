const express = require('express')
const app = express()
const db = require('./db')
const path = require('path')

app.use(express.json())

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/api/chefs', (req, res, next) => {
  db.getChefs()
  .then(response => res.send(response))
  .catch(next)
})

app.get('/api/recipes', (req, res, next) => {
  db.getRecipes()
  .then(response => res.send(response))
  .catch(next)
})

app.post('/api/chefs', (req, res, next) => {
  db.createChefs(req.body.name)
  .then(response => res.send(response))
  .catch(next)
})

app.post('/api/recipes', (req, res, next) => {
  db.createRecipes(req.body.name, req.body.chef_id)
  .then(response => res.send(response))
  .catch(next)
})

app.delete('/api/chefs/:id', (req, res, next) => {
  db.deleteChefs(req.params.id)
  .then(response => res.send(response))
  .catch(next)
})

app.delete('/api/recipes/:id', (req, res, next) => {
  db.deleteRecipes(req.params.id)
  .then(response => res.send(response))
  .catch(next)
})

app.put('/api/chefs/:id', (req, res, next) => {
  db.updateChef(req.body.name, req.params.id)
  .then(response => res.send(response))
  .catch(next)
})

app.put('/api/recipes/:id', (req, res, next) => {
  db.updateRecipes(req.body.name, req.params.id) 
  .then(response => res.send(response))
  .catch(next)
})

const port = 3000

db.sync().then(() => {
  app.listen(port, () => {
    console.log(`listening on port ${port}`)
  })
}) 