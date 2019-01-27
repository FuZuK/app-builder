const { runService, renderPromiseAsHTML } = require('../../expressServiceRunning');
const Order = require('../../services/order');
const X = require('../../services/x');

module.exports = {
	index : (req, res, next) => {
		renderPromiseAsHTML(req, res, {
			title : 'Build mobile app',
			date : new Date().toISOString()
		}, 'index.html');
	},
	order : async (req, res, next) => {
		try {
			const result = await runService(Order, {
				params : {
					...req.body
				}
			});
		} catch (e) {
			if (e instanceof X) {
				req.session.errors = Object.keys(e.errors).map(field => `${ field }: ${ e.errors[field] }`);
			} else {
				console.error(e);
				req.session.errors = [ `Service temporary unavailable` ];
			}
		}

		res.redirect('back');
	}
};
