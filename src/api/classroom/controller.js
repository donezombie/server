import { success, notFound, error } from '../../services/response/'
import _ from 'lodash'
import bcrypt from 'bcrypt-nodejs'
import { classrooms } from '.'
import { Video } from '../video'
import { User } from '../user'
import { Playlist } from '../playlist'
import { log } from 'util'

export const create = ({bodymen: {body} }, res) => {
  classrooms.create(body)
    .then((class_) => success(res, 201, class_))
    .catch(err => error(res, 500, err))
    // res.status(201).json(body)
}

export const index = ({ query: { q }, querymen: { query, select, cursor } }, res, _next) => {
  const keyword = q ? { keyword: new RegExp(q, 'i') } : {}
  classrooms.count(keyword)
    .then(count => {
      classrooms.find(keyword, {...select}, cursor)
        .populate({
          path: 'teachers',
          match: {_id: { $ne: null }},
          select: '-hashPassword'
        })
        .populate({
          path: 'members',
          match: {_id: {$ne: null}},
          select: '-hashPassword'
        })
        .populate({
          path: 'playlists',
          match: {_id: {$ne: null}}
        })
        .exec(async function (err, class_) {
          if (err) { return error(res, 500, err) } else {
            return success(res, 200, { class: class_, total: count })
          }
        })
    }).catch(err => error(res, 500, err))

//   .then((class_)=>console.log("class_"))
//   .catch(err => error(res, 500, err))
  // res.status(200).json("Success") => day la loi
}

export const playlistsnotin = ({ query: { q }, params }, res, next) => {
  const keyword = q ? { keyword: new RegExp(q, 'i') } : {}
  classrooms.findById(params.id)
    .then(notFound(res))
    .then((classroom) => {
      if (classroom) {
        let playlists = classroom.playlists.map(item => item._id)
        Playlist.find({ ...{'_id': {$nin: playlists}}, ...keyword })
          .limit(10)
          .then(playlistsnotin => {
            success(res, 200, playlistsnotin)
          })
          .catch(next)
      }
    })
    .catch(next)
}

export const membersnotin = ({ query: { q }, params }, res, next) => {
  const keyword = q ? { keyword: new RegExp(q, 'i') } : {}
  classrooms.findById(params.id)
    .then(notFound(res))
    .then((classroom) => {
      if (classroom) {
        User.find({ ...{ '_id': {$nin: classroom.members}, role: 0 }, ...keyword })
          .limit(10)
          .then(membersnotin => {
            success(res, 200, membersnotin)
          })
          .catch(next)
      }
    })
    .catch(next)
}

export const teachersnotin = ({ query: { q }, params }, res, next) => {
  const keyword = q ? { keyword: new RegExp(q, 'i') } : {}
  classrooms.findById(params.id)
    .then(notFound(res))
    .then((classroom) => {
      if (classroom) {
        User.find({ ...{ '_id': {$nin: classroom.teachers}, role: 1 }, ...keyword })
          .limit(10)
          .then(teachersnotin => {
            success(res, 200, teachersnotin)
          })
          .catch(next)
      }
    })
    .catch(next)
}

export const show = ({ params, session: { userInfo } }, res, _next) => {
  if (userInfo && userInfo.role > 0) {
    classrooms.findById(params.id)
      .populate({
        path: 'teachers',
        match: {_id: {$ne: null}},
        select: '-hashPassword'
      })
      .populate({
        path: 'members',
        match: {_id: {$ne: null}},
        select: '-hashPassword'
      })
      .populate({
        path: 'playlists.playlist',
        match: {_id: {$ne: null}}
      })
      .lean()
      .exec(function (_err, class_) {
        Video.populate(class_, {
          path: 'playlists.playlist.videos'
        }, async function (_err, classWithVideos) {
          const memberIdList = classWithVideos.members.map(item => item._id)
          const memberNotin = await User.find({ role: 0, _id: { $nin: memberIdList } }).limit(30).exec()
          classWithVideos.memberNotin = memberNotin
          success(res, 200, classWithVideos)
        })
      })
  } else {
    classrooms.findById(params.id)
      .populate({
        path: 'teachers',
        match: {_id: {$ne: null}},
        select: '-hashPassword'
      })
      .populate({
        path: 'members',
        match: {_id: {$ne: null}},
        select: '-hashPassword'
      })
      .populate({
        path: 'playlists.playlist',
        match: {_id: {$ne: null}}
      })
      .exec(function (_err, class_) {
        success(res, 200, class_)
      })
      // .then(notFound(res))
      // .then((class_) => success(res,200,class_))
      // .catch(err => error(res, 500, err))
  }
}

export const showMembersNotIn = ({ params, session: { userInfo } }, res, _next) => {
  // if (userInfo && userInfo.role > 0) {
  //   classrooms.findById(params.id)
  //     .exec(function (_err, class_) {
  //       console.log(class_)
  //       User.find({ role: 0 }, function(err, members) {
  //         console.log(members);
  //       });
  //       // Video.populate(class_, {
  //       //   path: 'playlists.playlist.videos'
  //       // }, function (_err, classWithVideos) {
  //       //   return success(res, 200, classWithVideos)
  //       // });
  //     })
  // } else return error(res, 401, "Unauthorized");
}

export const update = ({bodymen: { body }, params}, res, _next) =>
  classrooms.findById(params.id)
    .then(notFound(res))
    .then((class_) => class_ ? Object.assign(class_, body).save() : null)
    .then((class_) => success(res, 200, class_))
    .catch(err => error(res, 500, err))

export const destroy = ({ params }, res, _next) =>
  classrooms.findById(params.id)
    .then(notFound(res))
    .then((class_) => class_ ? class_.remove() : null)
    .then(success(res, 204))
    .catch(err => error(res, 500, err))

export const processUpdate = ({ query: { choose, action }, bodymen: { body }, params }, res, next) => {
  if (choose === 'playlist') {
    if (action === 'add') {
      classrooms.findById(params.id).then(classrooms => {
        classrooms.playlists.push(body.playlists)
        classrooms.save()
      }).then(success(res, 200, {success: 'Add Success'}))
    } else if (action === 'remove') {
      classrooms.findById(params.id).then(classroom => {
        classroom.playlists = _.filter(classroom.playlists, el => el._id.toString() !== body.playlists._id)
        classroom.save()
      }).then(success(res, 200, {Success: 'Remove Success'}))
    } else if (action === 'ToggleLock') {
      classrooms.findById(params.id).then(classroom => {
        const IndexPlaylistQuery = _.findIndex(classroom.playlists, {'_id': body.playlists._id})
        classroom.playlists[IndexPlaylistQuery].unlock = !classroom.playlists[IndexPlaylistQuery].unlock
        classroom.save()
      }).then(success(res, 200, {Success: 'ChangeStateLock Success'}))
    } else if (action === 'ToggleLockUser') {
      classrooms.findById(params.id).then(classroom => {
        const QueryPlaylist = _.find(classroom.playlists, {'_id': body.playlists.idPlaylist})
        let flag
        QueryPlaylist.members.forEach(element => { body.playlists.idMember === element.toString() ? flag = true : flag = false })
        if (flag) {
          QueryPlaylist.members = _.filter(QueryPlaylist.members, el => el.toString() !== body.playlists.idMember)
        } else {
          QueryPlaylist.members.push(body.playlists.idMember)
        }
        classroom.save()
      }).then(success(res, 200, {Success: 'ChangeStateLock Each User Success'}))
    }
  }

  if (choose === 'member') {
    if (action === 'add') {
      classrooms.findById(params.id).then(classroom => {
        const listMember = classroom.members
        listMember.push(body.members)
        classroom.set({members: listMember})
        classroom.save()
      }).then(success(res, 200, {success: 'Add Member Success!'}))
    } else if (action === 'remove') {
      classrooms.findById(params.id).then(classroom => {
        const listMember = classroom.members
        const listAfterRemove = _.filter(listMember, el => el.toString() !== body.members)
        classroom.set({members: listAfterRemove})
        classroom.save()
      }).then(success(res, 200, {success: 'Remove Member Success'}))
    }
  }

  if (choose === 'teacher') {
    if (action === 'add') {
      classrooms.findById(params.id).then(classroom => {
        const listTeachers = classroom.teachers
        listTeachers.push(body.teachers)
        classroom.set({teachers: listTeachers})
        classroom.save()
      }).then(success(res, 200, {success: 'Add Teacher Success!'}))
    } else if (action === 'remove') {
      classrooms.findById(params.id).then(classroom => {
        const listTeachers = classroom.teachers
        const listAfterRemove = _.filter(listTeachers, el => el.toString() !== body.teachers)
        classroom.set({teachers: listAfterRemove})
        classroom.save()
      }).then(success(res, 200, {success: 'Remove Teacher Success'}))
    }
  }
}
