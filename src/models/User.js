
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs';
import crypto from 'crypto'

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true,'Please tell us your name'],
    },
    email: {
      type: String,
      required: [true,'Please provide your email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true,'Please provide your password'],
      minLength: 8
    },
    role: {
      type: String,
      enum: ['admin','moderator','user'],
    },
    isVerified:{
      type: Boolean,
      default: false
    },
    verifyToken:{
      type: String
    },
    passwordResetToken:{
      type: String
    },
    passwordResetExpires:{
      type: Date
    },
    passwordUpdatedAt:{
      type: Date
    }
  }, 
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)

export default User