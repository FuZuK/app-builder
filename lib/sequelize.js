const Sequelize = require('sequelize');

const { timezone } = require('../etc/config.json');
const { database, username, password, host, dialect, logQueries } = require('../etc/dbConfig.json');

const sequelize = new Sequelize(
    database,
    username,
    password,
    {
        host,
        dialect,
        operatorsAliases: Sequelize.Op,
        define: {
            timestamps: false
        },
        dialectOptions: {
            useUTC: true
        },
        timezone,
        logging: logQueries ? console.log : null
    }
);

function importModel(model) {
    return sequelize.import(`${__dirname}/models/${ model }.js`);
}

importModel('Order');

module.exports = sequelize;
