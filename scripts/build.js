const amqp = require('amqplib');
const {
	QUEUE_APPS_TO_BUILD
} = require('../lib/constants');

async function main() {
	var connection, channel;

	console.log(`Initializing...`);
	await initAMQP();
	console.log(`Initialized. Adding new task to the queue.`);
	await createTask();
	console.log(`Task was queued!`);

	setTimeout(() => connection.close(), 3000);

	async function initAMQP() {
		connection = await amqp.connect();
		channel = await connection.createChannel();
		await channel.assertQueue(QUEUE_APPS_TO_BUILD);
	}

	async function createTask() {
		await channel.sendToQueue(QUEUE_APPS_TO_BUILD, Buffer.from(JSON.stringify({
			copyId     : parseInt(process.env.COPY_ID, 10),
			appId      : process.env.APP_ID,
			serverHost : process.env.SERVER_HOST
		})));
	}
}

main().catch(e => {
	console.error(e);
	console.error(e.stack);
	console.error('____________');
});
