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

// decorate the api with functionality
externalAccounts(instance);
externalTransactions(instance);
rippleAddresses(instance);
rippleTransactions(instance);
users(instance);

// since other users can extend functionality of the API object
// with prototype extensions
module.exports = instance;