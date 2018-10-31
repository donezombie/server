import mongoose, { Schema } from 'mongoose'
import { getUnicodeSearchName } from '../../services/utils';

const videoSchema = new Schema({
  keyword: { type: String },
  title: {
    type: String
  },
  description: {
    type: String
  },
  videoId: {
    type: String
  },
  duration: {
    type: String
  },
  like: [{type: Schema.Types.ObjectId, ref: 'User'}],
  viewCount: {
    default: 0,
    type: Number
  }
}, {
  timestamps: true
})

videoSchema.pre('save', function (next) {
  this.keyword = `${this.title ? getUnicodeSearchName(this.title) : ''}`.trim();
  next();
})

// videoSchema.plugin(require('mongoose-keywords'), {
//   paths: ['title'],
//   transform: function (value) {
//     return value;
//   }
// });

videoSchema.methods = {
  view (full) {
    const view = {
      // simple view
      _id: this._id,
      title: this.title,
      description: this.description,
      videoId: this.videoId,
      like: this.like,
      viewCount: this.viewCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Video', videoSchema)

export const schema = model.schema
export default model
