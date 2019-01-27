const path = require('path');
const fs = require('fs');
const Base = require('./base');
const X = require('./x');
const LIVR = require('livr');
const sequelize = require('../sequelize');
const { build } = require('../../etc/config');
const { enqueueBuildTask } = require('../queue');

const Order = sequelize.model('Order');

function Download(params) {
	Base.call(this, params);

	this.validate = async params => {
		const rules = {
			id : [ 'required', 'integer' ],
		};
		const validatedParams = this.validateWithValidator(rules, params);
		const order = await Order.findOne({
			where : {
				id : validatedParams.id
			}
		});

		if (!order) {
			throw new X({
				order : 'Order not found'
			});
		}

		return { ...validatedParams, order };
	}

	this.execute = async ({ order }) => {
		const fileName = `${ order.id }.apk`;
		const filePath = path.join(build.destination, fileName);
		const { size } = fs.statSync(filePath);

		return {
			name : fileName,
			path : filePath,
			size
		};
	}
}

Download.prototype = Object.create(Base.prototype);
module.exports = Download;
