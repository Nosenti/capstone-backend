import nodemailer from 'nodemailer';
import {htmlToText} from 'html-to-text';



export default class Email{
  constructor(user, url){
    this.to = user.email;
    this.name = user.name;
    this.url = url;
    this.from = `Innocent Ingabire <${process.env.EMAIL_FROM}>`
  }

  newTransport(){

    return nodemailer.createTransport({
    host: process.env.EMAIL_PROD_HOST,
    port: process.env.EMAIL_PROD__PORT,
    secure: false,
    auth:{
      user: process.env.EMAIL_PROD_USERNAME,
      pass: process.env.EMAIL_PROD_PASSWORD
    }
    // Activate in gmail *less secure app* option
  })
  }
// send the actual email
  async send(message, subject){
    // 1) Render HTML
    const html = message;
    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      // text: htmlToText.fromString(html)
    }
    //3) Create a transport and send email 
    await this.newTransport().sendMail(mailOptions)
  }
  async sendConfirmEmail(){
    await this.send(`<p>Hello ${this.name}</p></br>
    <a href=" ${this.url}">Confirm Email</a>`,`Welcome to the Platform`)
  }
  async sendPasswordReset(){
    await this.send(`<p>Hello ${this.name}</p></br>
    Reset URL: ${this.url}`,`Your password Reset token (Valid for only 10 mins)`)
  }
}

// new Email(user, url).sendWelcome();

