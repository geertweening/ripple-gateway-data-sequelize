var db = require('../sequelize');
var Sequelize = require('sequelize');

module.exports = db.define('ripple_transactions', {
  id: { 
    type: Sequelize.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },


  user_id: {
    type: Sequelize.INTEGER
  },


  partner_transaction_id: {
    type: Sequelize.STRING
  },


  transaction_client_id: { 
    type: Sequelize.STRING
  },
    transaction_state:{ 
    type: Sequelize.STRING 
  },
  transaction_hash: { 
    type: Sequelize.STRING 
  },


  from_address: {
    type: Sequelize.STRING,
    validate: { notNull: true }
  },
  from_amount: { 
    type: Sequelize.DECIMAL, 
    validate: { notNull: true }
  },
  from_currency: { 
    type: Sequelize.STRING, 
    validate: { notNull: true }
  },
  from_issuer: { 
    type: Sequelize.STRING, 
    validate: { notNull: true }
  },


  destination_tag: {
    type: Sequelize.STRING
  },


  payment_json: {
    type: Sequelize.STRING,
    validate: { notNull: true }
  },


  to_address: {
    type: Sequelize.STRING,
    validate: { notNull: true }
  },
  to_amount: { 
    type: Sequelize.DECIMAL, 
    validate: { notNull: true }
  },
  to_currency: { 
    type: Sequelize.STRING, 
    validate: { notNull: true }
  },
  to_issuer: { 
    type: Sequelize.STRING, 
    validate: { notNull: true }
  },


  message: {
    type: Sequelize.STRING
  }

})

