import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, update, destroy, createFromYoutube } from './controller'
import { schema } from './model'
export Playlist, { schema } from './model'

const router = new Router()
const { title, videos, listOptionChoose } = schema.tree

/**
 * @api {post} /playlists Create playlist
 * @apiName CreatePlaylist
 * @apiGroup Playlist
 * @apiParam title Playlist's title.
 * @apiParam videos Playlist's videos.
 * @apiSuccess {Object} playlist Playlist's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Playlist not found.
 */
router.post('/',
  body({ title, videos: [Object] }),
  create)

router.post('/fromyoutube',
  body({ title, videos: [Object], listOptionChoose }),
  createFromYoutube)

/**
 * @api {get} /playlists Retrieve playlists
 * @apiName RetrievePlaylists
 * @apiGroup Playlist
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of playlists.
 * @apiSuccess {Object[]} rows List of playlists.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

/**
 * @api {get} /playlists/:id Retrieve playlist
 * @apiName RetrievePlaylist
 * @apiGroup Playlist
 * @apiSuccess {Object} playlist Playlist's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Playlist not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /playlists/:id Update playlist
 * @apiName UpdatePlaylist
 * @apiGroup Playlist
 * @apiParam title Playlist's title.
 * @apiParam videos Playlist's videos.
 * @apiSuccess {Object} playlist Playlist's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Playlist not found.
 */
router.put('/:id',
  body({ title, videos: [Object] }),
  update)

/**
 * @api {delete} /playlists/:id Delete playlist
 * @apiName DeletePlaylist
 * @apiGroup Playlist
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Playlist not found.
 */
router.delete('/:id',
  destroy)

export default router
