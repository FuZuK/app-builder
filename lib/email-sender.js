const nodemailer = require('nodemailer');
const nunjucks = require('./nunjucks');
const { mail } = require('../etc/config.json');

function EmailSender() {
	const transport = mail.transport_options;

	this.transport = nodemailer.createTransport(transport);
	this.templates = {};

	this.transport.verify(err => {
		if (err) {
			console.error(err);
			throw err;
		}
	});

	this.send = async (to, subject, templateFile, data) => {
		templatePath = `email/${ templateFile }`;
		const sendData = { ...data };

		try {
			const html = nunjucks.render(templatePath, data);
			const mailOptions = {
				from    : mail.from,
				to      : to,
				subject,
				html
			};
			const response = await this.transport.sendMail(mailOptions);

			return response.message;
		} catch (err) {
			console.error(err);
			throw err;
		}
	}
}

module.exports = new EmailSender();
