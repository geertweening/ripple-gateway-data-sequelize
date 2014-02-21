var dbm = require('db-migrate');
var type = dbm.dataType;

exports.up = function(db, callback) {
  db.runSql('CREATE UNIQUE INDEX external_account_name_unique_index ON external_accounts (user_id, name)', function(err) {
    if (err) {
      console.error(err);
      callback();
    } else {
      console.log('added external_account_name_unique_index');
      callback();
    }
  })
  
};

exports.down = function(db, callback) {
  db.runSql('REMOVE UNIQUE INDEX external_account_name_unique_index', function(err) {
    if (err) {
      console.error(err);
      callback();
    } else {
      console.log('removed index');
      callback();
    }
  })

};
