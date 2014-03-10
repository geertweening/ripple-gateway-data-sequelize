var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('users', { 
	id: { type: 'int', primaryKey: true, autoIncrement: true },
    name: { type: 'string', notNull: true, unique: true },
    salt: { type: 'string', notNull: true },
    federation_tag: { type: 'string' },
    admin: { type: 'boolean', default: false },
    federation_name: { type: 'string' },
    password_hash: { type: 'string', notNull: true },
    bank_account_id: { type: 'int'},
    kyc_id: { type: 'int' },
    createdAt: { type: 'datetime', notNull: true },
    updatedAt: { type: 'datetime' },
    external_id: { type: 'string' },
    data: {type: 'string'}
  }, callback);

};

exports.down = function(db, callback) {
  db.dropTable('users', callback);
};
