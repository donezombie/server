import mongoose, { Schema } from 'mongoose'
import { getUnicodeSearchName } from '../../services/utils';

const courseclassroom = new Schema({
  keyword: { type: String },
  course: {
    type: String,
    unique: true
  },
  session: {
    type: Number
  },
  longname: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
})

courseclassroom.pre('save', function (next) {
  this.keyword = `${this.course ? getUnicodeSearchName(this.course) : ''}`.trim();
  next();
})

// courseclassroom.plugin(require('mongoose-keywords'), {
//   paths: ['course'],
//   transform: function (value) {
//     return value;
//   }
// });

courseclassroom.methods = {
  view (full) {
    const view = {
      // simple view
      _id: this._id,
      course: this.course,
      session: this.session,
      longname: this.longname,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('classroomcourse', courseclassroom)

export const schema = model.schema
export default model
