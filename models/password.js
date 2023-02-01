const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const forgotpw = sequelize.define('forgotpasswords', {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    email: Sequelize.STRING,
    active: Sequelize.BOOLEAN,
    expiresby: Sequelize.DATE

})

module.exports = forgotpw;