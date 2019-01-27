module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: DataTypes.STRING,
        package: DataTypes.STRING,
        site: DataTypes.STRING,
        type: DataTypes.STRING,
        status: DataTypes.STRING,
        buildStartedAt: DataTypes.DATE,
        buildFinishedAt: DataTypes.DATE,
        buildDuration: DataTypes.INTEGER,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    }, {
        tableName: 'orders',
        timestamps: true
    });
};
