const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const wallet = sequelize.define('Wallet', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },

    amount: { type: Sequelize.INTEGER },
    detail: {
        type: Sequelize.STRING
    },
    category: {
        type: Sequelize.STRING,

    }
});
module.exports = wallet;