import { success, notFound, error } from '../../services/response/'
import { Video } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Video.create(body)
    .then((video) => success(res, 201, video))
    .catch(err => error(res, 500, err))

export const index = ({ query: { q }, querymen: { query, select, cursor } }, res, next) => {
  const keyword = q ? { keyword: new RegExp(q, 'i') } : {};
  Video.count(keyword)
    .then(count => {
      Video.find(keyword, { ...select }, { ...cursor, sort: { updatedAt: -1 } })
        .then((videos) => { success(res, 200, {videos, total: count}) })
        .catch(err => error(res, 500, err))
    }).catch(err => error(res, 500, err))
}

export const show = ({ params }, res, next) =>
  Video.findById(params.id)
    .then(notFound(res))
    .then((video) => success(res, 200, video))
    .catch(err => error(res, 500, err))

export const update = ({ bodymen: { body }, params }, res, next) =>
  Video.findById(params.id)
    .then(notFound(res))
    .then((video) => video ? Object.assign(video, body).save() : null)
    .then((video) => success(res, 200, video))
    .catch(err => error(res, 500, err))

export const destroy = ({ params }, res, next) =>
  Video.findById(params.id)
    .then(notFound(res))
    .then((video) => video ? video.remove() : null)
    .then(success(res, 204))
    .catch(err => error(res, 500, err))
