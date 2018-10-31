import mongoose, { Schema } from 'mongoose'
import { getUnicodeSearchName } from '../../services/utils';

const classSchema = new Schema({
  keyword: { type: String },
  course: {
    type: String
  },
  classroom: {
    type: Number
  },
  session: {
    type: Number
  },
  teachers: [{type: Schema.Types.ObjectId, ref: 'User'}],
  members: [{type: Schema.Types.ObjectId, ref: 'User'}],
  playlists: [{
    _id: String,
    unlock: Boolean,
    playlist: {type: Schema.Types.ObjectId, ref: 'Playlist'},
    members: [{type: Schema.Types.ObjectId, ref: 'User'}]
  }]
}, {
  timestamps: true
})

classSchema.pre('save', function (next) {
  this.keyword = `${this.course ? getUnicodeSearchName(this.course) : ''} ${this.classroom ? getUnicodeSearchName(this.classroom) : ''}`.trim();
  next();
})

classSchema.methods = {
  view (full) {
    const view = {
      // simple view
      _id: this._id,
      course: this.course,
      classroom: this.classroom,
      teachers: this.teachers,
      members: this.members,
      playlists: this.playlists,
      session: this.session,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Classrooms', classSchema)

export const schema = model.schema
export default model
