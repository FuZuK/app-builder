const amqp = require('amqplib');
const path = require('path');
const Builder = require('../lib/builder');
const sequelize = require('../lib/sequelize');
const emailSender = require('../lib/email-sender');
const { build : builderConfig, siteUrl } = require('../etc/config');
const { QUEUE_APPS_TO_DELIVER } = require('../lib/constants');

const { playground, project, destination, type, signing } = builderConfig;
const Order = sequelize.model('Order');

async function main() {
	var connection, channel;
	console.log(`Initializing worker 'delivery'...`);

	await initAMQP();
	await consumeChannels();

	console.log(`Initialized. Listening for new tasks.`);

	async function initAMQP() {
		connection = await amqp.connect();
		channel = await connection.createChannel();
		channel.prefetch(1);
		await channel.assertQueue(QUEUE_APPS_TO_DELIVER);
	}

	async function consumeChannels() {
		channel.consume(QUEUE_APPS_TO_DELIVER, tryDevilerApp, { noAck: false });
	}

	async function tryDevilerApp(task) {
		const params = JSON.parse(task.content.toString());

		console.log(`Received new task to deliver app`);

		const startTime = Date.now();

		try {
			await deliverApp(params);

			console.log(`Delivered the app in ${ parseFloat((Date.now() - startTime) / 1000) }s`);

			channel.ack(task);
		} catch (e) {
			channel.reject(task);
			console.error(`Failed to deliver the app!`);
			console.error(e);
		}
	}

	async function deliverApp({ copyId, startTime, finishTime, buildTime }) {
		const order = await Order.findOne({ where : { id : copyId } });

		await emailSender.send(order.email, 'Build complete', 'build-complete.html', {
			url : `${ siteUrl }/download/${ copyId }`
		});

		order.buildStartedAt = startTime;
		order.buildFinishedAt = finishTime;
		order.buildDuration = buildTime;
		order.status = 'complete';

		await order.save();
	}
}

main().catch(e => {
	console.error(e);
	console.error(e.stack);
	console.error('____________');
});
