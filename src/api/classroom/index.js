import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, update, destroy, showMembersNotIn, playlistsnotin, membersnotin, teachersnotin, processUpdate } from './controller'
import { schema } from './model'
export classrooms, { schema } from './model'

const router = new Router()
const { course, classroom, teachers, members, playlists, session } = schema.tree

/**
 * @api {post} /classrooms Create classroom
 * @apiName CreateClassroom
 * @apiGroup Classroom
 * @apiSuccess {Object} classroom Classroom's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Classroom not found.
 */
router.post('/',
  body({ course, classroom, session }),
  create)

/**
 * @api {get} /classrooms Retrieve classrooms
 * @apiName RetrieveClassrooms
 * @apiGroup Classroom
 * @apiUse listParams
 * @apiSuccess {Object[]} classrooms List of classrooms.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  query(),
  index)

router.get('/:id/playlistsnotin', playlistsnotin)

router.get('/:id/membersnotin', membersnotin)

router.get('/:id/teachersnotin', teachersnotin)

/**
 * @api {get} /classrooms/:id Retrieve classroom
 * @apiName RetrieveClassroom
 * @apiGroup Classroom
 * @apiSuccess {Object} classroom Classroom's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Classroom not found.
 */
router.get('/:id',
  show)

  
router.get('/:id/membersnotin',
  showMembersNotIn)

/**
 * @api {put} /classrooms/:id Update classroom
 * @apiName UpdateClassroom
 * @apiGroup Classroom
 * @apiSuccess {Object} classroom Classroom's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Classroom not found.
 */
router.put('/:id',
    body({ course, classroom, teachers, members, playlists, session }),
    update)

/**
 * @api {delete} /classrooms/:id Delete classroom
 * @apiName DeleteClassroom
 * @apiGroup Classroom
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Classroom not found.
 */
router.delete('/:id',
  destroy)

router.patch('/:id', body({teachers, members, playlists}), processUpdate)

export default router
