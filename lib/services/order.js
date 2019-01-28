const Base = require('./base');
const LIVR = require('livr');
const sequelize = require('../sequelize');
const { enqueueBuildTask } = require('../queue');

const OrderModel = sequelize.model('Order');

function Order(params) {
	Base.call(this, params);

	this.validate = params => {
		const rules = {
			package : [ 'required', 'string', 'to_lc', { like: /^[a-z]+?\.[a-z]+?\.[a-z]+?$/ } ],
			site    : [ 'required', 'string', 'to_lc', { like: /^http:\/\/[A-Za-zА-Яа-я0-9\-]+?$/ } ],
			type    : [ 'required', 'string', { one_of: [ 'debug', 'release' ] } ],
			email   : [ 'required', 'string', 'to_lc', 'email' ]
		};

		return this.validateWithValidator(rules, params);
	}

	this.execute = async ({ package, site, type, email }) => {
		const order = await OrderModel.create({
			package,
			site,
			type,
			email
		});

		await enqueueBuildTask({
			copyId     : order.id,
			appId      : package,
			serverHost : site,
			type
		});
	}
}

Order.prototype = Object.create(Base.prototype);
module.exports = Order;
