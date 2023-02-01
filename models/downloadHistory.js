const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const downloadHistoryTable = sequelize.define('downloads', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userId: Sequelize.STRING,
    downloadURL: Sequelize.STRING
})

module.exports = downloadHistoryTable;