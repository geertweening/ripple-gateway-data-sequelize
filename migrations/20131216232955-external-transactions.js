var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('external_transactions', { 
		id: { type: 'int', primaryKey: true, autoIncrement: true },
    amount: { type: 'decimal', notNull: true },
    currency: { type: 'string', notNull: true },
    deposit: { type: 'boolean', notNull: true },
    external_account_id: { type: 'int', notNull: true },
    status: { type: 'string' },
    ripple_transaction_id: { type: 'int'},
    createdAt: { type: 'datetime', notNull: true },
    updatedAt: { type: 'datetime' }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('external_transactions', callback);
};
