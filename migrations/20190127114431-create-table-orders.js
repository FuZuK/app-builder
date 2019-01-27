module.exports = {
	up: async function (queryInterface, Sequelize) {
		await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
		await queryInterface.sequelize.query('CREATE TABLE `orders` (' +
			'`id` int(10) NOT NULL AUTO_INCREMENT,' +
			'`email` varchar(200) NOT NULL,' +
			'`package` varchar(100) CHARACTER SET utf8 NOT NULL,' +
			'`site` varchar(100) CHARACTER SET utf8 NOT NULL,' +
			'`type` varchar(20) CHARACTER SET utf8 NOT NULL,' +
			'`status` varchar(50) CHARACTER SET utf8 DEFAULT \'new\',' +
			'`buildStartedAt` datetime DEFAULT NULL,' +
			'`buildFinishedAt` datetime DEFAULT NULL,' +
			'`buildDuration` int(10) DEFAULT \'0\',' +
			'`createdAt` datetime DEFAULT NULL,' +
			'`updatedAt` datetime DEFAULT NULL,' +
			'PRIMARY KEY (`id`),' +
			'KEY `package` (`package`),' +
			'KEY `site` (`site`),' +
			'KEY `type` (`type`)' +
			') ENGINE=InnoDB DEFAULT CHARSET=utf8');
		await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
	},
	down: async function (queryInterface, Sequelize) {
		await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
		await queryInterface.sequelize.query('DROP TABLE `orders`');
		await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
	}
}
