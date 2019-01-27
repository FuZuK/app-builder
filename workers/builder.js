const amqp = require('amqplib');
const path = require('path');
const Builder = require('../lib/builder');
const { build : builderConfig } = require('../etc/config');
const { playground, project, destination, type, signing } = builderConfig;
const {
	QUEUE_APPS_TO_BUILD,
	QUEUE_APPS_TO_DELIVER
} = require('../lib/constants');

async function main() {
	var connection, channel;
	console.log(`Initializing worker 'builder'...`);

	await initAMQP();
	await consumeChannels();

	console.log(`Initialized. Listening for new tasks.`);

	async function initAMQP() {
		connection = await amqp.connect();
		channel = await connection.createChannel();
		channel.prefetch(1);
		await channel.assertQueue(QUEUE_APPS_TO_BUILD);
		await channel.assertQueue(QUEUE_APPS_TO_DELIVER);
	}

	async function consumeChannels() {
		channel.consume(QUEUE_APPS_TO_BUILD, tryBuildApp, { noAck: false });
	}

	async function tryBuildApp(task) {
		const params = JSON.parse(task.content.toString());

		console.log(`Received new task to build app`);

		const startTime = Date.now();

		try {
			await buildApp(params);
			const finishTime = Date.now();
			const buildTime = (finishTime - startTime) / 1000;

			console.log(`Built the app in ${ parseFloat(buildTime) }s`);

			channel.ack(task);
			channel.sendToQueue(QUEUE_APPS_TO_DELIVER, Buffer.from(JSON.stringify({
				...params,
				startTime,
				finishTime,
				buildTime
			})));
			console.log(`Pushed new task to deliver the app`);
		} catch (e) {
			channel.reject(task);
			console.error(`Failed to build the app!`);
			console.error(e);
		}
	}

	async function buildApp({ copyId, appId, serverHost, type }) {
		const builder = new Builder({
			copyId,
			project,
			playground,
			destination  : path.join(destination, `${ copyId }.apk`),
			buildConfigs : {
				applicationId : appId
			},
			appConfigs   : {
				serverHost
			},
			type,
			signing
		});

		await builder.build();
	}
}

main().catch(e => {
	console.error(e);
	console.error(e.stack);
	console.error('____________');
});
