import mongoose, { Schema } from 'mongoose'

const playlistSchema = new Schema({
  keyword: { type: String },
  title: {
    type: String
  },
  videos: [{
    type: Schema.Types.ObjectId,
    ref: 'Video'
  }],
  exercises: [{
    type: Schema.Types.ObjectId,
    ref: 'exercises'
  }],
  typePlaylist: {
    type: String,
    default: 'python'
  }
}, {
  timestamps: true,
})

playlistSchema.pre('save', function (next) {
  this.keyword = `${this.title ? getUnicodeSearchName(this.title) : ''}`.trim();
  next();
})

playlistSchema.methods = {
  view (full) {
    const view = {
      // simple view
      _id: this.id,
      title: this.title,
      videos: this.videos,
      typePlaylist: this.typePlaylist,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('playlistadmin', playlistSchema)

export const schema = model.schema
export default model