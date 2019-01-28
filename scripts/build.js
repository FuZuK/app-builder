const amqp = require('amqplib');
const { disconnect } = require('../lib/queue');
const { runService } = require('../lib/services');
const Order = require('../lib/services/order');
const {
	QUEUE_APPS_TO_BUILD
} = require('../lib/constants');

async function main() {
	const data = await runService(Order, {
		params : {
			package : process.env.PACKAGE,
			site    : process.env.SITE,
			type    : process.env.TYPE,
			email   : process.env.EMAIL
		}
	});

	setTimeout(disconnect, 3000);
}

main().catch(e => {
	console.error(e);
	console.error(e.stack);
	console.error('____________');
});
