import nodemailer from 'nodemailer';

export function sendMail(to: string, subject: string, messageHtml: string, messageTxt: string): boolean {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EmailUser,
			pass: process.env.EmailPass,
		},
	});

	const mailOptions = {
		from: process.env.EmailUser,
		to: to,
		subject: subject,
		text: messageTxt,
		html: messageHtml,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error(error);
		} else {
			console.log(`Email sent: ${info.response}`);
		}
	});

	return true;
}
