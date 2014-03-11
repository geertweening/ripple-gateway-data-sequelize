var users                 = require('./lib/controllers/users');
var externalAccounts      = require('./lib/controllers/external_accounts');
var externalTransactions  = require('./lib/controllers/external_transactions');
var rippleAddresses       = require('./lib/controllers/ripple_addresses');
var rippleTransactions    = require('./lib/controllers/ripple_transactions');

var API = function() {
  // optionally instantiate some shared variable
};

// create instance of the API
var instance = new API();

// decorate the api instance by controller on the defined property
// e.g. the user controller will decorate the instance on the 'users' property
// -> api.users.creat
var bind = function(controller, property) {
	instance[property] = {};
	controller(instance[property]);
}

bind(externalAccounts, 'externalAccounts');
bind(externalTransactions, 'externalTransactions');
bind(rippleAddresses, 'rippleAddresses');
bind(rippleTransactions, 'rippleTransactions');
bind(users, 'users');

// export a singleton
// module.exports caches it's value, which is the api instance in our case
module.exports = instance;