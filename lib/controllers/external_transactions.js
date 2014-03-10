var externalTransactionModel = require('../models/external_transactions');

function configure(api) {

  api.createExternalTransaction = function(opts, fn){
    var external_transaction = externalTransactionModel.build(opts);
    var errors = external_transaction.validate(); 
    if (errors){
      fn(errors, null);
      return;
    }
    external_transaction.save().complete(function(err, external_transaction){
      if (err){
        fn(err, null);
      } else {
        fn(null, external_transaction);
      }
    });
  };

  api.getExternalTransaction = function(opts, fn){
    externalTransactionModel.find(opts.id).complete(function(err, external_transaction){
      if (err){
        fn(err, null);
      } else if (external_transaction){
        fn(null, external_transaction);
      } else {
        fn({ id: 'record not found' }, null);
      }
    });
  };

  api.updateExternalTransaction = function(opts, fn){
    externalTransactionModel.find(opts.id).complete(function(err, external_transaction){
      if (err){
        fn(err, null);
      } else if (external_transaction) {
        delete opts.id;
        external_transaction.updateAttributes(opts).complete(fn);
      } else {
        fn({ id: 'record not found' }, null);
      }
    });

  };

  api.deleteExternalTransaction = function(opts, fn){
    externalTransactionModel.find(opts.id).complete(function(err, external_transaction){
      external_transaction.destroy().complete(function(err, data){
        fn(null, data);
      });
    });
  };

  api.getPendingWithdrawals = function(opts, fn){
    var query = {
      status: 'pending',
      deposit: false,
      external_account_id: opts.external_account_id
    }; 
    externalTransactionModel.findAll({ where: query }).complete(function(err, pending_withdrawals){
      if(err) {
        fn(err, null);
      } else {
        fn(null, pending_withdrawals || []);
      }
    });
  };

}

module.exports = configure;