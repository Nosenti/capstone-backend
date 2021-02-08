
import models from '../database/models';
import { hashPassowrd, comparePassword, jwtToken } from '../utils/jwtToken';

const { users} = models;
export default class User {

  static async signIn(req, res) {
    try {
      const { email, password } = req.body;
      const user = await users.findOne({ where: { email } });
      if (!user) return res.status(400).send({ status: 400, error: "User doesn't exist" });
      if (user && comparePassword(password, user.password)) {
        const token = jwtToken.createToken(user);
        return res.status(200).send({ token });
      }
      return res.status(400).send({ status: 400, error: 'invalid email/password combination ' });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  
}
