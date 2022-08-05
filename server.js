import cors from 'cors'
import express from 'express'
import axios from 'axios'

const app = express()

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
})

app.use(cors())

app.get('/photos', async (req, res) => {
  const albumId = req.query.albumId
  const { data } = await api.get('/photos', { params: { albumId } })
  res.json(data)
})

app.get('/photos/:id', async (req, res) => {
  const { data } = await api.get(`/photos/${req.params.id}`)
  res.json(data)
})

app.listen(3000, () => {
  console.log('Server started on port 3000')
})
