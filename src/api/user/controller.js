import { success, notFound, error } from '../../services/response/'
import bcrypt from 'bcrypt-nodejs'
import mongoose from 'mongoose'
import _ from 'lodash'
import { User } from '.'
import { classrooms } from '../classroom'
import settings from '../../settings.json'

export const create = ({ bodymen: { body } }, res) => {
  if (body.username && body.password) {
    body.hashPassword = bcrypt.hashSync(body.password)
    body.password = undefined
    User.create(body)
      .then((user) => success(res, 201, user))
      .catch(err => error(res, 500, err))
  } else if (!body.password) error(res, 400, 'Missing password')
  else if (!body.username) error(res, 400, 'Missing username')
}

export const createMany = ({ bodymen: { body } }, res) => {
  if (body.classroom && body.studentData) {
    let students = []
    const { classroom, studentData } = body
    console.log(studentData)
    if (studentData.indexOf('\r') > -1) {
      students = studentData.split('\r,').map(student => student.split(','))
    } else {
      students = _.chunk(studentData.split(','), 5)
      console.log(students)
    }

    let studentsId = []
    const studentEmail = students.map(student => student[1])

    User.find({
      'email': {
        $in: studentEmail
      }
    }).then(studentFound => {
      let studentsExists = []
      if (studentFound.length > 0) {
        studentsExists = studentFound.map(student => student.email)
        studentsId = studentFound.map(student => student._id)
      }

      const studentsCreate = students.filter(student => !studentsExists.includes(student[1])).map(student => {
        let name = student[0].split(' ')
        let firstName = name.slice(0, name.length - 1).join(' ')
        let lastName = name[name.length - 1]

        return {
          username: student[1].trim(),
          hashPassword: settings.defaultPassword,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          linkFB: student[4].trim(),
          phoneNumber: student[2].trim(),
          role: 0,
          email: student[1].trim()
        }
      })

      return User.create(studentsCreate)
    }).then(async studentsCreated => {
      if (studentsCreated && studentsCreated.length > 0) {
        let studentsCreatedId = studentsCreated.map(student => student._id)
        studentsId = [...studentsId, ...studentsCreatedId]
      }
      try {
        let classroomFound = await classrooms.findById(classroom)
        classroomFound.members = classroomFound.members.concat(studentsId.filter(el => classroomFound.members.indexOf(mongoose.Types.ObjectId(el)) === -1))
        await classroomFound.save()
        success(res, 200, classrooms)
      } catch (err) {
        error(res, 500, err)
      }
    }).catch(err => error(res, 500, err))
  } else if (!body.classroom) error(res, 400, 'Missing classroom')
  else if (!body.studentData) error(res, 400, 'Missing student data')
}

export const index = ({ query: { q, role, listAll }, querymen: { query, select, cursor } }, res, next) => {
  // User.find({}, async (err, users) => {
  //   for(let i=0; i < users.length; i++) {
  //     await users[i].save();
  //   }
  // })

  const keyword = q ? { keyword: new RegExp(q, 'i') } : {}
  const roleSelect = role ? { role: role } : {}
  const LIMIT = listAll ? 999999 : 30
  User.count({ ...keyword, ...roleSelect })
    .then(count => (
      User.find({ ...keyword, ...roleSelect }, { ...select }, { ...cursor, sort: { updatedAt: -1 } })
        .select('-hashPassword')
        .limit(LIMIT)
        .then((users) => success(res, 200, { users, total: count}))
        .catch(err => error(res, 500, err))
    )).catch(err => error(res, 500, err))
}

export const show = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => success(res, 200, user))
    .catch(err => error(res, 500, err))

export const update = ({ bodymen: { body }, params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => user ? Object.assign(user, body).save() : null)
    .then((user) => success(res, 200, user))
    .catch(err => error(res, 500, err))

export const destroy = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => user ? user.remove() : null)
    .then(success(res, 204))
    .catch(err => error(res, 500, err))

export const changeSetting = ({ query: { choose, action }, bodymen: { body }, params }, res, next) => {
  if (choose === 'user' && action === 'changeTheme') {
    User.findById(params.id).then(user => {
      user.userSetting.themes = body.themes
      user.save()
    }).then(success(res, 200, {success: 'Change Setting Success'}))
  }
}
