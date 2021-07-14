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
					<td bgcolor="#7149de" style="padding: 3em; color: #ffffff;border: solid 1px #ffffff; border-radius: 1rem;;" >
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
      console.log(`error sending mail ${err}`);
      return false;
    }
    return true;
  });
};

export { sendMail };
