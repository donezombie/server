import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export exercises, { schema } from './model'

const router = new Router()
const { Type, content, title } = schema.tree

/**
 * @api {post} /classrooms Create classroom
 * @apiName CreateClassroom
 * @apiGroup Classroom
 * @apiSuccess {Object} classroom Classroom's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Classroom not found.
 */
router.post('/',
  body({ Type, content, title }),
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

/**
 * @api {put} /classrooms/:id Update classroom
 * @apiName UpdateClassroom
 * @apiGroup Classroom
 * @apiSuccess {Object} classroom Classroom's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Classroom not found.
 */
router.put('/:id',
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

export default router
