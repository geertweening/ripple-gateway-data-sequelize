var db = require('../sequelize.js');
var Sequelize = require("sequelize");

var ExternalTransaction = db.define('external_transactions', {
  id: { 
    type: Sequelize.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  amount: { 
    type: Sequelize.DECIMAL, 
    validate: { notNull: true }
  },
  currency: { 
    type: Sequelize.STRING, 
    validate: { notNull: true }
  },
  deposit: { 
    type: Sequelize.BOOLEAN, 
    validate: { notNull: true }
  },
  external_account_id: { 
    type: Sequelize.INTEGER, 
    validate: { notNull: true }
  },
  status: {
    type: Sequelize.STRING
  },
  ripple_transaction_id: {
    type: Sequelize.INTEGER
  }
});

module.exports = ExternalTransaction;
