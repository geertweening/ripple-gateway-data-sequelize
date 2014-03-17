var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('users', { 
  	id:             { type: 'int', primaryKey: true, autoIncrement: true },
    name:           { type: 'string', notNull: true, unique: true },
    salt:           { type: 'string', notNull: true },
    admin:          { type: 'boolean', default: false },
    password_hash:  { type: 'string', notNull: true },
    kyc_id:         { type: 'int' },
    createdAt:      { type: 'datetime', notNull: true },
    updatedAt:      { type: 'datetime' },
    external_id:    { type: 'string' },
    ripple_address: { type: 'string', notNull: true },
    payment_key:    { type: 'string', notNull: true },
    data:           { type: 'string' }
  }, callback);

};

exports.down = function(db, callback) {
  db.dropTable('users', callback);
};
