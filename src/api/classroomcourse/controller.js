import { success, notFound, error } from '../../services/response/'
// import bcrypt from 'bcrypt-nodejs'
import { courseclassroom } from '.'

export const create = ({ bodymen: {body} }, res) => {
  courseclassroom.create(body)
    .then((course) => success(res, 201, course))
    .catch(err => error(res, 500, err))
    // res.status(201).json(body)
}

export const index = ({ query: { q }, querymen: { query, select, cursor } }, res, next) => {
  const keywords = q ? { keywords: new RegExp(q, "i") } : {};
  courseclassroom.find(keywords, {...select, keywords: 0}, cursor)
    .then((courses) => success(res, 200, courses))
    .catch(err => error(res, 500, err))
}

export const show = ({ params }, res, next) => {
  courseclassroom.findById(params.id)
    .then(notFound(res))
    .then((class_) => success(res, 200, class_))
    .catch(err => error(res, 500, err))
}

// res.status(200).json({res})

export const update = ({ body, params }, res, next) =>
  courseclassroom.findById(params.id)
    .then(notFound(res))
    .then((course) => course ? Object.assign(course, body).save() : null)
    .then((course) => success(res, 200, course))
    .catch(err => error(res, 500, err))

export const destroy = ({ params }, res, next) =>
  courseclassroom.findById(params.id)
    .then(notFound(res))
    .then((course) => course ? course.remove() : null)
    .then(success(res, 204))
    .catch(err => error(res, 500, err))
