import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { Playlist } from '.'

const app = () => express(apiRoot, routes)

let playlist

beforeEach(async () => {
  playlist = await Playlist.create({})
})

test('POST /playlists 201', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ title: 'test', videos: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.title).toEqual('test')
  expect(body.videos).toEqual('test')
})

test('GET /playlists 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /playlists/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${playlist.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(playlist.id)
})

test('GET /playlists/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /playlists/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${playlist.id}`)
    .send({ title: 'test', videos: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(playlist.id)
  expect(body.title).toEqual('test')
  expect(body.videos).toEqual('test')
})

test('PUT /playlists/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ title: 'test', videos: 'test' })
  expect(status).toBe(404)
})

test('DELETE /playlists/:id 204', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${playlist.id}`)
  expect(status).toBe(204)
})

test('DELETE /playlists/:id 404', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})
