const expressServiceRunningTools = require('./expressServiceRunningTools');
const tools = expressServiceRunningTools();

module.exports = {
	makeServiceRunner   : tools.makeServiceRunner,
	runService          : tools.runService,
	renderPromiseAsJson : tools.renderPromiseAsJson,
	renderPromiseAsHTML : tools.renderPromiseAsHTML
};
