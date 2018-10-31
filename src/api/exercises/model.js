import mongoose, { Schema } from 'mongoose'
import { getUnicodeSearchName } from '../../services/utils';

const exercises = new Schema({
  keyword: { type: String },
  title: {
    type: String
  },
  Type: {
    type: String,
    default: 'manual'
  },
  content: {
    type: String
  }
}, {
  timestamps: true
})

// exercises.pre('save', function (next) {
//   this.keyword = `${this.course ? getUnicodeSearchName(this.course) : ''}`.trim();
//   next();
// })

// courseclassroom.plugin(require('mongoose-keywords'), {
//   paths: ['course'],
//   transform: function (value) {
//     return value;
//   }
// });

exercises.methods = {
  view (full) {
    const view = {
      // simple view
      _id: this._id,
      Type: this.Type,
      title: this.title,
      content: this.content,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('exercises', exercises)

export const schema = model.schema
export default model
