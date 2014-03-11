var db = require('../sequelize.js');
var ExternalTransaction = require('./external_transactions');
var Sequelize = require('sequelize');

var ExternalAccount = db.define('external_accounts', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { 
    type: Sequelize.STRING, 
    validate: { notNull: true }
  },
  user_id: { 
    type: Sequelize.INTEGER
  }
}, {
  instanceMethods: {
    deposit: function(opts, fn) {
      opts.external_account_id = this.id;
      opts.deposit = true;
      opts.amount = parseFloat(opts.amount);
      ExternalTransaction.create(opts).complete(fn);
    },
    withdraw: function(opts, fn) {
      opts.external_account_id = this.id;
      opts.deposit = false;
      opts.amount = parseFloat(opts.amount);
      ExternalTransaction.create(opts).complete(fn);
    }
  } 
});

module.exports = ExternalAccount;
