var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.createTable('external_accounts', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },	 	
    name: { type: 'string', notNull: true },
    user_id: { type: 'int', notNull: true},
    createdAt: { type: 'datetime', notNull: true},
    updatedAt: { type: 'datetime', notNull: true},
	}, callback);
};

exports.down = function(db, callback) {
	db.dropTable('external_accounts', callback);
  callback()
};
