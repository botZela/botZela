import process from 'node:process';
import nodemailer from 'nodemailer';

export async function sendMail(to: string, subject: string, messageHtml: string, messageTxt: string) {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EmailUser,
			pass: process.env.EmailPass,
		},
	});

	const mailOptions = {
		from: process.env.EmailUser,
		to,
		subject,
		text: messageTxt,
		html: messageHtml,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log(`Email sent to ${to}: ${info.response}`);
	} catch (error) {
		console.error(error);
	}
}
