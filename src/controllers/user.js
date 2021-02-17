
import User from '../models/User.js';
import crypto from 'crypto';
import { hashPassword, comparePassword, jwtToken, createPasswordResetToken } from '../utils/jwtToken.js';
import sendEmail from '../utils/email.js';
 const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el=>{
      if(allowedFields.includes(el)) newObj[el] = obj[el];
    })
    return newObj;
  }
export default class User_ {

 static async getUsers(req, res){
   try {
     const users = await User.find({});
     res.status(200).send(users)
   } catch (error) {
     console.log(error)
     res.status(500).send({
       status: 500,
       message: 'Server error'
     })
     
   }
 }

  static async updateMe(req, res) {
    try {
      if(req.body.password || req.body.passwordConfirm){
        return res.status(400).send({
          status:400,
          message: 'This is not for updating the password'
        })
      }
      // Filter out unwanted fields name which are not allowed to be updated
      const filteredBody = filterObj(req.body, 'name','email');

      const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody , {
        new: true,
        runValidators: true
      })

      res.status(200).send({
        status: 200,
        data:{
          user: updatedUser
        }
      })
    } catch (error) {
      console.log(error)
      return res.status(500).send(error);
    }
  }

}
