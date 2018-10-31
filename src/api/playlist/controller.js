import { success, notFound } from '../../services/response/'
import { Playlist } from '.'
import { classrooms } from '../classroom'
import { Video } from '../video'
import { playlistadmin } from '../playlistforAdmin'
import _ from 'lodash'

export const createFromYoutube = ({ bodymen: { body } }, res, next) => {
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
  )
}

export const create = ({ bodymen: { body } }, res, next) =>
  Playlist.create(body)
    .then(playlist => success(res, 201, playlist))
    .catch(next)

export const index = async ({ query: { q }, querymen: { query, select, cursor }, session: { userInfo } }, res, next) => {
  const keyword = q ? { keyword: new RegExp(q, 'i') } : {}
  cursor = { ...cursor, sort: { updatedAt: -1 } }
  let empty
  let listLikeView = []
  let listLikeViewInClassRoom = []
  await Playlist.find({}).populate('videos').then(a => {
    a.forEach(el => {
      let totalView = 0
      let totalLike = 0
      el.videos.forEach(video => {
        totalView += video.viewCount
        totalLike += _.isEqual(video.like, []) ? 0 : video.like.length
      })
      empty = {
        id: el._id,
        totalView: totalView,
        totalLike: totalLike
      }
      listLikeView.push(empty)
    })
  })

  if (userInfo && userInfo.role > 0) {
    classrooms.find({
      teachers: {
        $in: [userInfo.id]
      }
    }).populate('playlists.playlist')
      .then(classroomsFound => {
        let listPlaylists = []
        let personalPlaylists = []
        classroomsFound.forEach(classroom => {
          let newPlaylist = {
            classroomName: `${classroom.course} ${classroom.classroom}`,
            idClassroom: `${classroom.id}`,
            playlists: []
          }
          let playlists = classroom.playlists
          playlists.forEach(playlist => {
            if (playlist.playlist) {
              newPlaylist.playlists.push(playlist)
              listLikeView.forEach(element => {
                if (element.id.toString() === playlist._id) {
                  listLikeViewInClassRoom.push(element)
                }
              })
            }
          })
          listPlaylists.push(newPlaylist)
        })
        success(res, 200, { playlist: listPlaylists, personalPlaylists, listLikeViewInClassRoom: _.unionBy(listLikeViewInClassRoom, 'id') })
      })
    // success(res, 200, { classroom: el.teachers })
  } else if (userInfo) {
    classrooms.find({
      members: {
        $in: [userInfo.id]
      }
    }).populate('playlists.playlist').then(classroomsFound => {
      let listPlaylists = []
      let playlistsId = []
      let personalPlaylists = []
      classroomsFound.forEach(classroom => {
        let newPlaylist = {
          classroomName: `${classroom.course} ${classroom.classroom}`,
          idClassroom: `${classroom.id}`,
          playlists: []
        }
        let playlists = classroom.playlists
        playlists.forEach(playlist => {
          if (playlist.playlist && playlist.unlock && playlistsId.indexOf(playlist.playlist._id) === -1) {
            newPlaylist.playlists.push(playlist)
            playlistsId.push(playlist.playlist._id)
            listLikeView.forEach(element => {
              listLikeViewInClassRoom.push(element)
            })
          }
          if (playlist.members.indexOf(userInfo.id) > -1) {
            if (!_.mapKeys(personalPlaylists, '_id')[playlist._id]) personalPlaylists = [ ...personalPlaylists, playlist ]
          }
        })
        listPlaylists.push(newPlaylist)
      })
      success(res, 200, { playlist: listPlaylists, personalPlaylists, listLikeViewInClassRoom: _.unionBy(listLikeViewInClassRoom, 'id') })
    }).catch(next)
  } else {
    success(res, 200, [])
  }
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

export const destroy = ({ params }, res, next) =>
  Playlist.findById(params.id)
    .then(notFound(res))
    .then((playlist) => playlist ? playlist.remove() : null)
    .then(success(res, 204))
    .catch(next)
