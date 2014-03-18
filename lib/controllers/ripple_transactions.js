var rippleTransactionModel = require('../models/ripple_transactions');

function configure(api) {

  api.create = function(opts, fn){
    function fillSimplePayment(simple) {
      var full = simple;
      full.from_amount = full.from_amount || full.to_amount;
      full.from_currency = full.from_currency || full.to_currency;
      full.from_issuer = full.from_issuer || full.to_issuer;
      return full;
    }
    opts = fillSimplePayment(opts);
    var model = rippleTransactionModel.build(opts); 
    
    var errors = model.validate();
    if (opts.to_currency) { opts.to_currency = opts.to_currency.toUpperCase() };
    if (opts.from_currency) { opts.from_currency = opts.from_currency.toUpperCase() };
    if (opts.to_address_id && opts.from_address_id && (opts.to_address_id == opts.from_address_id)) {
      var errors = {
        to_address_id: 'to and from addresses must not be the same',
        from_address_id: 'to and from addresses must not be the same'
      }
      fn (errors, null);
      return;  
    }
    
    if (errors) {
      fn (errors, null);
    } else {
      model.save().complete(function(err, ripple_transaction){
        if (err) {
          fn(err, null);
        } else {
          fn(null, ripple_transaction);
        }
      });
    }
  };

  api.read = function(opts, fn){
    rippleTransactionModel.find(opts.id).complete(function(err, payment){
      if (err) {
        fn(err, null);
      } else if (payment) {
        fn(null, payment);
      } else {
        fn({ id: 'record not found' }, null);
      }
    });
  };

  api.readAll = function(opts, fn){
    if (typeof opts == 'function') {
      rippleTransactionModel.findAll().complete(opts);
    } else {
      rippleTransactionModel.findAll({ where: opts}).complete(fn);
    }
  };

  api.update = function(opts, fn){
    rippleTransactionModel.find(opts.id).complete(function(err, transaction){
      if (err) {
        fn(err, null);
      } else {
        var sanitized = {
          transaction_hash: opts.transaction_hash,
          transaction_state: opts.transaction_state
        };
        transaction.updateAttributes(sanitized).complete(function(err, transaction){
          if (err) {
            fn(err, null);
          } else {
            fn(null, transaction);
          }
        });
      }
    });
  };

  api.delete = function(opts, fn){
    rippleTransactionModel.find(opts.id).complete(function(err, transaction){
      if (err) {
        fn(err, null);
      } else if (transaction) {
        transaction.destroy().complete(fn);
      } else {
        fn({ id: 'record not found' }, null);
      }
    });
  }

}

module.exports = configure;