import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { Video } from '.'

const app = () => express(apiRoot, routes)

let video

beforeEach(async () => {
  video = await Video.create({})
})

test('POST /videos 201', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ title: 'test', description: 'test', videoId: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.title).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.videoId).toEqual('test')
})

test('GET /videos 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /videos/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${video.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(video.id)
})

test('GET /videos/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /videos/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${video.id}`)
    .send({ title: 'test', description: 'test', videoId: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(video.id)
  expect(body.title).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.videoId).toEqual('test')
})

test('PUT /videos/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ title: 'test', description: 'test', videoId: 'test' })
  expect(status).toBe(404)
})

test('DELETE /videos/:id 204', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${video.id}`)
  expect(status).toBe(204)
})

test('DELETE /videos/:id 404', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})
