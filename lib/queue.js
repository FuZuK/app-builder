const amqp = require('amqplib');
const {
	QUEUE_APPS_TO_BUILD
} = require('./constants');

let connection, channel;

async function init() {
	if (connection) {
		return;
	}

	console.log(`Initializing messages queue...`);
	await initAMQP();
	console.log(`Initialized!`);

	async function initAMQP() {
		connection = await amqp.connect();
		channel = await connection.createChannel();
		await channel.assertQueue(QUEUE_APPS_TO_BUILD);
	}
}

async function enqueueBuildTask(params) {
	const { copyId, appId, serverHost, type } = params;
	await init();
	await channel.sendToQueue(QUEUE_APPS_TO_BUILD, Buffer.from(JSON.stringify({
		copyId,
		appId,
		serverHost,
		type
	})));

	console.log(`Enqueue build task with the next params:`);
	console.dir(params);
}

async function disconnect() {
	connection.close();
}

module.exports = {
	disconnect,
	enqueueBuildTask
};
