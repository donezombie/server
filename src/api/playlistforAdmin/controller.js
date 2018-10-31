import { success, notFound, error } from '../../services/response/'
import { Playlist } from '../playlist'
import { classrooms } from '../classroom'
import { Video } from '../video'
import { User } from '../user'
import _ from 'lodash'
const listOption = require('../listOptionPlaylist.json')

export const createFromYoutube = ({ bodymen: { body } }, res, _next) => {
  const { title, videos, listOptionChoose } = body
  let videoIds = []
  const videoIdList = videos.map(video => video.videoId)

  Video.find({
    'videoId': {
      $in: videoIdList
    }
  }).then(videoFounds => {
    let videoExists = []
    if (videoFounds.length > 0) {
      videoExists = videoFounds.map(video => video.videoId)
      videoIds = videoFounds.map(video => video._id)
    }

    const videosCreate = videos.filter(video => !videoExists.includes(video.videoId))
    console.log(videosCreate)

    return Video.create(videosCreate)
  }).then(async videosCreated => {
    if (videosCreated && videosCreated.length > 0) {
      let videosCreatedId = videosCreated.map(video => video._id)
      videoIds = [...videoIds, ...videosCreatedId]
    }
    return Playlist.create({ videos: videoIds, title, typePlaylist: listOptionChoose })
  }).then(playlistCreated => success(res, 201, playlistCreated)
  ).catch(err => error(res, 500, err))
}

export const create = ({ bodymen: { body } }, res, next) =>
  Playlist.create(body)
    .then(playlist => success(res, 201, playlist))
    .catch(next)

export const index = ({ query: { q }, querymen: { query, select, cursor }, session: { userInfo } }, res, next) => {
  const keyword = q ? { keyword: new RegExp(q, 'i') } : {}
  cursor = { ...cursor, sort: { updatedAt: -1 } }
  if (userInfo && userInfo.role > 0) {
    return Playlist.count(keyword).then(count => {
      Playlist.find(keyword, { ...select }, cursor)
        .populate('exercises')
        .then(playlists => success(res, 200, {playlists, total: count, listOption}))
        .catch(next)
    })
  } else if (userInfo) {
    classrooms.find({
      members: {
        $in: [userInfo.id]
      }
    }).populate('playlists.playlist').then(classroomsFound => {
      let listPlaylists = []
      let playlistsId = []

      classroomsFound.forEach(classroom => {
        let newPlaylist = {
          classroomName: `${classroom.course} ${classroom.classroom}`,
          playlists: []
        }
        let playlists = classroom.playlists
        playlists.forEach(playlist => {
          if (playlist.playlist && playlist.unlock && playlistsId.indexOf(playlist.playlist._id) === -1) {
            newPlaylist.playlists.push(playlist)
            playlistsId.push(playlist.playlist._id)
          }
        })
        listPlaylists.push(newPlaylist)
      })
      success(res, 200, { playlist: listPlaylists })
    }).catch(next)
  } else error(res, 401, 'Unauthorized')
}

export const show = ({ params }, res, next) =>
  Playlist.findById(params.id)
    .populate('videos')
    .populate('exercises')
    .then((playlist) => success(res, 200, playlist))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Playlist.findById(params.id)
    .then(notFound(res))
    .then((playlist) => playlist ? Object.assign(playlist, body).save() : null)
    .then((playlist) => playlist ? playlist.view(true) : null)
    .then((playlist) => success(res, 200, playlist))
    .catch(next)

export const destroy = async ({ params }, res, next) => {
  let QueryClass = await classrooms.find({
    playlists: {
      $elemMatch: {_id: params.id}
    }
  })
  QueryClass.forEach(eachClass => {
    _.remove(eachClass.playlists, {_id: params.id})
    classrooms.findOneAndUpdate({_id: eachClass._id}, eachClass, {upsert: true, new: true}).exec()
  })

  Playlist.findById(params.id)
    .then(notFound(res))
    .then((playlist) => playlist ? playlist.remove() : null)
    .then(success(res, 204))
    .catch(next)
}

export const CRUDExcerciseToPlaylist = ({ query: { choose }, bodymen: { body }, params }, res, next) => {
  if (choose === 'addEx') {
    Playlist.findById(params.id).then(playlist => {
      const listPull = playlist.exercises
      listPull.push(body.idExcercise)
      playlist.set({exercises: listPull})
      playlist.save()
      success(res, 200, { Success: 'Success' })
    })
  } if (choose === 'deleteEx') {
    Playlist.findById(params.id).then(playlist => {
      const listPull = playlist.exercises
      _.forEach(listPull, el => {
        console.log(el)
        if (el.toString() === body.idExcercise.toString()) {
          listPull.splice(listPull.indexOf(el), 1)
        }
      })
      playlist.set({exercises: listPull})
      playlist.save()
      success(res, 200, { Success: 'Success' })
    })
  }
}
