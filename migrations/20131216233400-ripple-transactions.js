var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('ripple_transactions', { 
		id:                { type: 'int', primaryKey: true, autoIncrement: true },
    to_address_id:     { type: 'int', notNull: true },
    from_address_id:   { type: 'int', notNull: true },

    transaction_state: { type: 'string' },
    transaction_hash:  { type: 'string', unique: true },

    to_amount:         { type: 'decimal', notNull: true },
    to_currency:       { type: 'string', notNull: true },
    to_issuer:         { type: 'string', notNull: true },

    from_amount:       { type: 'decimal', notNull: true },
    from_currency:     { type: 'string', notNull: true },
    from_issuer:       { type: 'string', notNull: true },

    createdAt:         { type: 'datetime', notNull: true },
    updatedAt:         { type: 'datetime' }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('ripple_transactions', callback);
  callback();
};
