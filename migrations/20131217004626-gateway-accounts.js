var dbm = require('db-migrate')
var type = dbm.dataType

exports.up = function(db, callback) {
  db.createTable('gateway_accounts', { 
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    user_id: { type: 'string', unique: true, notNull: true },
    createdAt: { type: 'datetime', notNull: true },
    updatedAt: { type: 'datetime' }
  }, callback)
}

exports.down = function(db, callback) {
  db.dropTable('gateway_accounts', callback)
};
