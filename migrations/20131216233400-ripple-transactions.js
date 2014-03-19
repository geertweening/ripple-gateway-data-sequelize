var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('ripple_transactions', { 
		id:                     { type: 'int', primaryKey: true, autoIncrement: true },

    user_id:                { type: 'int' },

    partner_transaction_id: { type: 'string', notNull: true },

    transaction_client_id:  { type: 'string', unique: true },
    transaction_state:      { type: 'string', notNull: true },
    transaction_hash:       { type: 'string' },

    from_address:           { type: 'string', notNull: true },
    from_amount:            { type: 'decimal', notNull: true },
    from_currency:          { type: 'string', notNull: true },
    from_issuer:            { type: 'string', notNull: true },

    to_address:             { type: 'string', notNull: true },
    to_amount:              { type: 'decimal', notNull: true },
    to_currency:            { type: 'string', notNull: true },
    to_issuer:              { type: 'string', notNull: true },

    destination_tag:        { type: 'string' },

    payment_json:           { type: 'string' },

    createdAt:              { type: 'datetime', notNull: true },
    updatedAt:              { type: 'datetime' },

    message:                { type: 'string' }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('ripple_transactions', callback);
  callback();
};
