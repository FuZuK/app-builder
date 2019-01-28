const { exec } = require('child_process');
const { writeFile } = require('fs');
const path = require('path');

function Builder({
	env,
	copyId,
	project,
	playground,
	buildConfigs,
	appConfigs,
	destination,
	type = 'debug',
	signing = null
}) {
	const copyPath = path.join(playground, `copy-${ copyId }`);
	const buildConfigsPath = path.join(copyPath, 'app/config.properties');
	const appConfigsPath = path.join(copyPath, 'app/src/main/res/raw/config.properties');

	if (type === 'release' && signing) {
		buildConfigs = {
			...buildConfigs,
			...(signing ? {
				'signingConfigs.release.storeFile' : signing.storeFile,
				'signingConfigs.release.storePassword' : signing.storePassword,
				'signingConfigs.release.keyAlias' : signing.keyAlias,
				'signingConfigs.release.keyPassword' : signing.keyPassword,
			} : null)
		};
	} else {
		type = 'debug';
	}

	const srcApkPath = path.join(copyPath, `/app/build/outputs/apk/${ type }/app-${ type }.apk`);
	const assembleTask = type === 'debug' ? `assembleDebug` : 'assembleRelease';

	this.build = async () => {
		return new Promise(async (res, rej) => {
			console.log(`The application (id: ${ copyId }) will be build with the next parameters:`);
			console.log(`Project: ${ project }`);
			console.log(`Build configs: ${ JSON.stringify(buildConfigs) }`);
			console.log(`Application configs: ${ JSON.stringify(appConfigs) }`);

			try {
				console.log(`Make the copy of the project to ${ copyPath }...`);
				await makeProjectCopy();
				console.log(`Successfully copied the project to ${ copyPath }`);
			} catch (e) {
				return rej({
					message : 'Failed to make the copy!',
					error   : e
				});
			}

			try {
				console.log(`Configure the app...`);
				await configureApp();
				console.log(`Successfully configured the app`);
			} catch (e) {
				return rej({
					message : 'Failed to configure the app!',
					error   : e
				});
			}

			try {
				console.log(`Build application...`);
				await buildApp();
				console.log(`Application was successfully built!`);
			} catch (e) {
				return rej({
					message : 'Failed to build app!',
					error   : e
				});
			}

			try {
				console.log(`Moving apk to ${ destination }...`);
				await moveApk();
				console.log(`Successfully moved apk to ${ destination }!`);
			} catch (e) {
				return rej({
					message : 'Failed to move apk!',
					error   : e
				});
			}

			try {
				console.log(`Clearing the playground...`);
				await clearPlayground();
				console.log(`The playground successfully cleared!`);
			} catch (e) {
				return rej({
					message : 'Failed to clear the playground!',
					error   : e
				});
			}

			res();
		});
	}

	function makeProjectCopy() {
		return new Promise((res, rej) => {
			exec(`mkdir -p ${ copyPath }`, { env }, (e, stdout, stderr) => {
				if (e) rej(e);
				else {
					exec(`cp -R ${ project }/* ${ copyPath }`, { env }, e => {
						if (e) rej(e);
						else res();
					});
				}
			});
		});
	}

	async function configureApp() {
		await buildAndSaveProps(buildConfigs, buildConfigsPath);
		await buildAndSaveProps(appConfigs, appConfigsPath);
	}

	async function buildAndSaveProps(configs, destination) {
		return new Promise((res, rej) => {
			const configString = Object.keys(configs).reduce((acc, key) => {
				const value = configs[key];
				return `${ acc }\n${ key }=${ value }`;
			}, '');

			writeFile(destination, configString, e => {
				if (e) rej(e);
				else res();
			});
		});
	}

	function buildApp() {
		return new Promise((res, rej) => {
			const prc = exec(`bash ./gradlew ${ assembleTask }`, {
				env,
				cwd : copyPath
			}, e => {
				if (e) rej(e);
				else res();
			});

			prc.stdout.on('data', chunk => process.stdout.write(chunk));
			prc.stderr.on('data', chunk => process.stderr.write(chunk));
		});
	}

	function moveApk() {
		return new Promise((res, rej) => {
			exec(`mv ${ srcApkPath } ${ destination }`, { env }, e => {
				if (e) rej(e);
				else res();
			});
		});
	}

	function clearPlayground() {
		return new Promise((res, rej) => {
			exec(`rm -rf ${ copyPath }`, { env }, e => {
				if (e) rej(e);
				else res();
			})
		});
	}
}

module.exports = Builder;
