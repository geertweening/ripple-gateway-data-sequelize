var rippleTransactionModel = require('../models/ripple_transactions');

function configure(api) {

  api.createRippleTransaction = function(opts, fn){
    function fillSimplePayment(simple) {
      full = simple;
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

  api.updateRipplePayment = function(opts, fn){
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

  api.getRipplePayment = function(opts, fn){
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

  api.getRipplePayments = function(opts, fn){
    if (typeof opts == 'function') {
      rippleTransactionModel.findAll().complete(fn);
    } else {
      rippleTransactionModel.findAll({ where: { id: opts.ids }}).complete(fn);
    }
  };

  api.deleteRipplePayment = function(opts, fn){
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