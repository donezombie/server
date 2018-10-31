import mongoose, { Schema } from 'mongoose'
import { getUnicodeSearchName } from '../../services/utils'

const userSchema = new Schema({
  keyword: { type: String },
  username: {
    type: String,
    unique: true
  },
  hashPassword: {
    type: String
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  fullName: {
    type: String
  },
  linkFB: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  role: {
    type: Number,
    default: 0
  },
  email: {
    type: String
  },
  userSetting: {
    themes: {
      type: String,
      default: 'light'
    }
  }
}, {
  timestamps: true
})

userSchema.pre('save', function (next) {
  this.fullName = [ `${this.firstName || ''} ${this.lastName || ''}`.trim() ]
  this.keyword = `${this.email ? getUnicodeSearchName(this.email) : ''} ${this.username ? getUnicodeSearchName(this.username) : ''} ${this.phoneNumber ? getUnicodeSearchName(this.phoneNumber) : ''} ${this.fullName ? getUnicodeSearchName(this.fullName) : ''}`.trim()
  next()
})

userSchema.pre('save', function (next) {
  next()
})

// userSchema.plugin(require('mongoose-keywords'), {
//   paths: ['email', 'username', 'phoneNumber', 'fullName'],
//   transform: function (value) {
//     return value;
//   }
// });

userSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      username: this.username,
      hashPassword: this.hashPassword,
      firstName: this.firstName,
      lastName: this.lastName,
      linkFB: this.linkFB,
      phoneNumber: this.phoneNumber,
      email: this.email,
      userSetting: this.userSetting,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('User', userSchema)

export const schema = model.schema
export default model
