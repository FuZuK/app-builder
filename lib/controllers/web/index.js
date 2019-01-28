const { runService, renderAsHTML } = require('../../services');
const Order = require('../../services/order');
const Download = require('../../services/download');
const X = require('../../services/x');

module.exports = {
	index : (req, res, next) => {
		renderAsHTML(req, res, null, { template : 'index.html' });
	},
	order : async (req, res, next) => {
		try {
			const result = await runService(Order, {
				params : {
					...req.body
				}
			});

			req.session.messages.push(`The build was enqueued. Wait for the notification to your email.`);
		} catch (e) {
			if (e instanceof X) {
				Object.keys(e.errors)
					.forEach(field => req.session.errors.push(`${ field }: ${ e.errors[field] }`));
			} else {
				console.error(e);
				req.session.errors.push(`Please, contact your system administrator!`);
			}
		}

		res.redirect('/');
	},
	download : async (req, res, next) => {
		try {
			const result = await runService(Download, {
				params : {
					...req.params
				}
			});

			res.setHeader('content-length', result.size);
			res.setHeader('content-type', 'application/vnd.android.package-archive');
			res.setHeader('content-disposition', `attachment; filename="${ result.name }"`);
			res.sendFile(result.path);
		} catch (e) {
			if (e instanceof X) {
				Object.keys(e.errors)
					.forEach(field => req.session.errors.push(`${ field }: ${ e.errors[field] }`));
			} else {
				console.error(e);
				req.session.errors.push(`Please, contact your system administrator!`);
			}

			res.redirect('/');
		}
	}
};
