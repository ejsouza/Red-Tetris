import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import { BaseURL } from '../config/const';

const sendMail = (email: string, token: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.SMTP,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAILPASS,
    },
  });

  let mailOptions = {
    from: process.env.GMAIL,
    to: email,
    subject: 'Account confirmation',
    text: 'Please confirm your email',
    html: `
			<table align="center" style="font-family: Arial, Helvetica, sans-serif; text-align:center; border-collapse:separate; border-radius:25px; width:600;" >
				<tr>
					<td bgcolor="#F64D08" style="padding: 3em; color: #ffffff;border: solid 1px #ffffff; border-radius: 1rem;;" >
						<h1>Hello <b>${email} welcome to  RedTetris</b></h1>
						<h3 style="font-style: oblique;">You were registered successfully!</h3>
						<h3 style="font-style: oblique;">Please click the link bellow to confirm your account!</h3>
						<a style="text-decoration: none; color: #04db1a;" href="http://localhost:8000${BaseURL}/token/verify?token=${token}">Confirm account!</a>
						<p>RedTetris &#169; 2021</p>
					</td>
				</tr>
			</table>
		`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return false;
    }
    return true;
  });
  return false;
};

const sendResetPasswordMailToken = (
  name: string,
  email: string,
  token: string
) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.SMTP,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAILPASS,
    },
  });

  let mailOptions = {
    from: process.env.GMAIL,
    to: email,
    subject: 'Reset password',
    text: 'Please confirm your request',
    html: `
			<table align="center" style="font-family: Arial, Helvetica, sans-serif; text-align:center; border-collapse:separate; border-radius:25px; width:600;" >
				<tr>
					<td bgcolor="#F64D08" style="padding: 3em; color: #ffffff;border: solid 1px #ffffff; border-radius: 1rem;;" >
						<h1>Hello <b>${name}</b></h1>
						<h3 style="font-style: oblique;">We received a reset password request to the account linked to this email</h3>
            <h3 font-style: oblique;>If you didn't change it, you should look into what happened.</h3>
						<h3 style="font-style: oblique;">Please click the link bellow to confirm your new password.</h3>
						<a style="text-decoration: none; color: #04db1a;" href="http://localhost:8000${BaseURL}/token/verify?token=${token}">Change password?</a>
						<p>RedTetris &#169; 2021 by&nbsp;esouza.&nbsp;All Rights Reserved.</p>
					</td>
				</tr>
			</table>
		`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return false;
    }
    return true;
  });
  return false;
};

export { sendMail, sendResetPasswordMailToken };
