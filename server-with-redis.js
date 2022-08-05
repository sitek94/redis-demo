import cors from 'cors'
import express from 'express'
import axios from 'axios'
import { createClient } from 'redis'

const redis = createClient()

redis.on('error', err => console.log('Redis Client Error', err))

await redis.connect()
const app = express()

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
})

app.use(cors())

app.get('/photos', async (req, res) => {
  const albumId = req.query.albumId

  const key = albumId ? `photos:albumId:${albumId}` : 'photos'

  // Check if the data is in the cache
  const cached = await redis.get(key)
  if (cached) {
    console.log(`Serving from cache: ${key}`)
    return res.json(JSON.parse(cached))
  }

  const { data } = await api.get('/photos', { params: { albumId } })

  // Save the data in the cache
  await redis.set(key, JSON.stringify(data))
  console.log(`Saving to cache: ${key}`)

  res.json(data)
})

app.get('/photos/:id', async (req, res) => {
  const id = req.params.id
  if (!id) {
    return res.status(400).json({ error: 'Missing id' })
  }

  const key = `photos:${id}`

  // Check if the data is in the cache
  const cached = await redis.get(key)
  if (cached) {
    console.log(`Serving from cache: ${key}`)
    return res.json(JSON.parse(cached))
  }

  const { data } = await api.get(`/photos/${id}`)

  // Save the data in the cache
  await redis.set(key, JSON.stringify(data))
  console.log(`Saving to cache: ${key}`)

  res.json(data)
})

app.listen(3000, () => {
  console.log('Server started on port 3000')
})
