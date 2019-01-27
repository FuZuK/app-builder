const LIVR = require('livr');
const X = require('./x');

function Base() {
	this.run = async params => {
		const validatedParams = await this.validate(params);
		const result = await this.execute(validatedParams);

		return result;
	}

	this.validateWithValidator = (rules, params) => {
		const validator = new LIVR.Validator(rules);
		const validParams = validator.validate(params);

		if (validParams) {
			return validParams;
		} else {
			throw new X({ errors : validator.getErrors() });
		}
	}
}

module.exports = Base;
