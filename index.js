var models = require('require-all')({
  dirname: __dirname + '/lib/models',
  filter: /(.+)\.js(on)?$/
})

var Adapter = function(){
  this.models = models;
  this.errors = null;
}

Adapter.prototype.createExternalAccount = function(opts, fn){
  var model = models.external_account.build(opts);
  var errors = model.validate();

  if (errors) {
    fn(errors, null);
  } else {
    model.save().complete(function(err, external_account){
      if (!err && external_account) {
        fn(null, external_account.toJSON());
      } else {
        var error = JSON.parse(JSON.stringify(err));
        fn({
          name: error, 
          user_id: error.detail 
        }, null);
      }
    });
  }

};

function fillSimplePayment(simple) {
  full = simple;
  full.from_amount = full.from_amount || full.to_amount;
  full.from_currency = full.from_currency || full.to_currency;
  full.from_issuer = full.from_issuer || full.to_issuer;
  return full;
}

Adapter.prototype.createRippleTransaction = function(opts, fn){
  opts = fillSimplePayment(opts);
  var model = models.ripple_transaction.build(opts); 
  
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

Adapter.prototype.updateRipplePayment = function(opts, fn){
  models.ripple_transaction.find(opts.id).complete(function(err, transaction){
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

module.exports = Adapter;
