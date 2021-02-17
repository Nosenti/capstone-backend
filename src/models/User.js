
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs';
import crypto from 'crypto'

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true,'Please tell us your first name'],
    },
    last_name:{
      type: String,
      required: [true,'Please tell us your last name']
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
    passwordConfirm:{
      type:String,
      required:[true, 'Please confirm your password']
    },
    role: {
      type: String,
      enum: ['admin','moderator','user'],
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

// userSchema.methods.createPasswordResetToken = () => {
//   const resetToken = crypto.randomBytes(32).toString('hex');

//   this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

//   this.passwordResetExpires = Date.now() + 10*60*1000 ;

//   return resetToken;
// }

const User = mongoose.model('User', userSchema)

export default User