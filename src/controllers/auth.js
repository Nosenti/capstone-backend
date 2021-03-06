
import User from '../models/User.js';
import crypto from 'crypto';
import { hashPassword, comparePassword, jwtToken, createPasswordResetToken } from '../utils/jwtToken.js';
import Email from '../utils/email.js';
import gravatar from 'gravatar';

export default class Auth {

  static async auth(req,res){
    try {
      const user = await User.findById(req.user.id).select('-password');
      console.log(user)
      return res.status(200).send(user)
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: 'server error'
      })
    }
  }

  static async signup(req, res) {
    try {
      const {
        name,
        email,
        password,
        passwordConfirm
      } = req.body;

      if (!((/@alustudent.com\s*$/.test(email))||(/@alueducation.com\s*$/.test(email)))) {
        return res.status(400).send({
          status: 400,
          message: 'You should signup with ALU email'
        })
      }
      const existUser = await User.findOne({ email });
      if (existUser) {
        return res.status(409).send({
          message: 'user already exists'
        });
      }

      const avatar = gravatar.url(email, {
        s: '200',
        r:'pg',
        d:'mm'
      })
      
      if( passwordConfirm !== password){
        return res.status(400).send({
          status: 400,
          message:"Password and confirm password do not match"
        })
      }
      const hash = hashPassword(password);
      const user = await User.create({
        name,
        email,
        avatar,
        password:hash,
        role:'user'
      });
      const token = jwtToken.createToken(user);
      user.verifyToken = token;
      user.save();
      const url = `${req.protocol}://${req.get('host')}/api/users/confirmEmail/${token}`;
      await new Email(user, url).sendConfirmEmail();
      return res.status(200).send({
        status: 200,
        message: 'Confirm your email address'
      })
      
    } catch (error) {
      console.log(error)
      return res.status(500).send({
        status: 500,
        message: 'Server Error'
      });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const user = await User.findOne({email:req.body.email});
      if(!user){
        res.status(404).send({
          status: 404,
          message:'User does not exist'
        })
      }

      const resetToken = createPasswordResetToken(user)
      const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      user.passwordResetToken = passwordResetToken;
      user.passwordResetExpires = Date.now() + 10*60*1000;
      await user.save() 

      try {

        const resetURL = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`;

        await new Email(user, resetURL).sendPasswordReset()
        res.status(200).send({
          status: 200,
          message: ' Token sent to the email'
        })
      } catch (error) {
        user.passwordResetToken = undefined,
        user.passwordResetExpires = undefined,
        await user.save()
        res.status(500).send({
          status: 500,
          message: 'There was an error sending the email. Try again later'
        })
      }
      

    } catch (error) {
      console.log(error)
      return res.status(500).send(error);
    }
  }

  static async resetPassword(req, res) {
    try {
      // 1) Get user based on the token
      const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

      const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires:{$gt:Date.now()}});

       
      // 2) if token has not expired and there is user, set the new password
      if(!user){
        return res.status(400).send({
          status: 400,
          message: 'Token is invalid or has expired'
        })
      }
      user.password = hashPassword(req.body.password);
      user.passwordConfirm = hashPassword(req.body.passwordConfirm),
      user.passwordResetToken= undefined,
      user.passwordResetExpires = undefined;
      user.passwordUpdatedAt = Date.now() - 1000;
      await user.save();

      // 3) update changedPasswordAt property for the user

      // Log the user in, send JWT
      const token = jwtToken.createToken(user);
      return res.status(200).send({
        token,
        message:'The user is logged in'
      }); 
    } catch (error) {
      console.log(error)
      return res.status(500).send({
        error: error});
    }
  }

  static async signin(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({email});
      if (!user) return res.status(400).send({ status: 400, error: "User doesn't exist" });
      if(user.isVerified === false){
        return res.status(400).send({
          status: 400,
          message: 'Confirm your email first'
        })
      }
      if (user && comparePassword(password, user.password)) {
        const token = jwtToken.createToken(user);
        return res.status(200).send({ token });
      }
      return res.status(400).send({ status: 400, message: 'invalid email/password combination ' });
    } catch (error) {
      return res.status(500).send({
        status: 500,
        message: 'Server Error'
      });
    }
  }

  static async updatePassword(req, res) {
    try {
      
      //1) Get the user from collection
      const user = await User.findById(req.user.id); 
      const {currentPassword, password, passwordConfirm} = req.body;
      console.log('pass in db: ', user.password)
      console.log('current: ', hashPassword(currentPassword))
      if(! (hashPassword(currentPassword) === user.password)){
       
       return res.status(401).send({
          status:401,
          message: 'Your current password is wrong'
        })
      }
      
      //3) If so, update the password
      user.password = hashPassword(password);
      user.passwordConfirm = hashPassword(passwordConfirm);
      await user.save(); 

      //4) Log user in, send JWT
      const token = jwtToken.createToken(user);
      return res.status(201).send({
        token,
        message:'Password is updated'
      }); 


    } catch (error) {
      console.log(error)
      return res.status(500).send(error);
    }
  }

  static async resetPassword(req, res) {
    try {
      // 1) Get user based on the token
      const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

      const user = await User.findOne({passwordResetToken: hashedToken, passwordResetExpires:{$gt:Date.now()}});

       
      // 2) if token has not expired and there is user, set the new password
      if(!user){
        return res.status(400).send({
          status: 400,
          message: 'Token is invalid or has expired'
        })
      }
      user.password = hashPassword(req.body.password);
      user.passwordConfirm = hashPassword(req.body.passwordConfirm),
      user.passwordResetToken= undefined,
      user.passwordResetExpires = undefined;
      user.passwordUpdatedAt = Date.now() - 1000;
      await user.save();

      // 3) update changedPasswordAt property for the user

      // Log the user in, send JWT
      const token = jwtToken.createToken(user);
      return res.status(200).send({
        token,
        message:'The user is logged in'
      }); 
    } catch (error) {
      console.log(error)
      return res.status(500).send({
        error: error});
    }
  }

  static async confirmEmail(req, res) {
    try {
      
      const providedToken = req.params.token;
      const user = await User.findOne({verifyToken: providedToken})

      if(!user){
        return res.status(400).send({
          status: 400,
          message: 'Token is invalid or expired'
        })
      }

      user.isVerified = true;
      user.save();
      return res.status(201).send({
        message:'Email Confirmed. You can now login'
      }); 


    } catch (error) {
      console.log(error)
      return res.status(500).send(error);
    }
  }
  
}
