import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Video, { schema } from './model'

const router = new Router()
const { title, description, videoId, duration, like, viewCount } = schema.tree

/**
 * @api {post} /videos Create video
 * @apiName CreateVideo
 * @apiGroup Video
 * @apiParam title Video's title.
 * @apiParam description Video's description.
 * @apiParam videoId Video's videoId.
 * @apiSuccess {Object} video Video's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Video not found.
 */
router.post('/',
  body({ title, description, videoId, duration }),
  create)

/**
 * @api {get} /videos Retrieve videos
 * @apiName RetrieveVideos
 * @apiGroup Video
 * @apiUse listParams
 * @apiSuccess {Object[]} videos List of videos.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /videos/:id Retrieve video
 * @apiName RetrieveVideo
 * @apiGroup Video
 * @apiSuccess {Object} video Video's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Video not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /videos/:id Update video
 * @apiName UpdateVideo
 * @apiGroup Video
 * @apiParam title Video's title.
 * @apiParam description Video's description.
 * @apiParam videoId Video's videoId.
 * @apiSuccess {Object} video Video's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Video not found.
 */
router.put('/:id',
  body({ title, description, videoId, duration, like, viewCount }),
  update)

/**
 * @api {delete} /videos/:id Delete video
 * @apiName DeleteVideo
 * @apiGroup Video
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Video not found.
 */
router.delete('/:id',
  destroy)

export default router
