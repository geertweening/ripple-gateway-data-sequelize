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

Adapter.prototype.getRipplePayment = function(opts, fn){
  models.ripple_transaction.find(opts.id).complete(function(err, payment){
    if (err) {
      fn(err, null);
    } else if (payment) {
      fn(null, payment);
    } else {
      fn({ id: 'record not found' }, null);
    }
  });
};

Adapter.prototype.getRipplePayments = function(opts, fn){
  if (typeof opts == 'function') {
    models.ripple_transaction.findAll().complete(fn);
  } else {
    models.ripple_transaction.findAll({ where: { id: opts.ids }}).complete(fn);
  }
};

Adapter.prototype.deleteRipplePayment = function(opts, fn){
  models.ripple_transaction.find(opts.id).complete(function(err, transaction){
    if (err) {
      fn(err, null);
    } else if (transaction) {
      transaction.destroy().complete(fn);
    } else {
      fn({ id: 'record not found' }, null);
    }
  });
}

Adapter.prototype.createRippleAddress = function(opts, fn){
  var model = models.ripple_address.build(opts);
  var errors = model.validate();

  if (errors) {
    fn(errors, null);
    return;
  }

  if (opts.type == 'hosted' && !opts.tag) {
    fn({ tag: 'hosted requires a tag' }, null);
    return;
  }

  model.save().complete(function(err, ripple_address){
    if (err) {
      fn(err, null);
    } else {
      fn(null, ripple_address);
    }
  }); 
};

Adapter.prototype.getRippleAddress = function(opts, fn){
  models.ripple_address.find(opts.id).complete(function(err, ripple_address){
    if(err){
      fn(err, null);
    } else if (ripple_address) {
      fn(null, ripple_address);
    } else {
      fn({ id: 'record not found' }, null);
    } 
  });
};

Adapter.prototype.updateRippleAddress = function(opts, fn){
  models.ripple_address.find(opts.id).complete(function(err, ripple_address){
    if (err){
      fn(err, null);
    } else if (ripple_address) {
      delete opts.id;
      ripple_address.updateAttributes(opts).complete(fn);
    } else {
      fn({ id: 'record not found' }, null);
    }
  });;
};

Adapter.prototype.deleteRippleAddress = function(opts, fn){
  models.ripple_address.find(opts.id).complete(function(err, ripple_address){
    data = ripple_address.toJSON();
    ripple_address.destroy().complete(function(){
      fn(null, data);
    });
  });
};

Adapter.prototype.getExternalAcccount = function(opts, fn){
  models.external_account.find(opts.id).complete(function(err, external_account){
    if (err){
      fn(err, null);
    } else if (external_account){
      fn(null, external_account);
    } else {
      fn({ id: 'record not found' }, null);
    }
  });
};

Adapter.prototype.updateExternalAccount - function(opts, fn){
  models.external_account.find(opts.id).complete(function(err, ripple_address){
    if (err){
      fn(err, null);
    } else if (external_account) {
      delete opts.id;
      external_account.updateAttributes(opts).complete(fn);
    } else {
      fn({ id: 'record not found' }, null);
    }
  });

};

/*
Adapter.prototype.deleteExternalAccount - function(opts, fn){
  models.external_account.find(opts.id).complete(function(err, external_account){
    data = external_account.toJSON();
    external_account.destroy().complete(function(){
      fn(null, data);
    });
  });
};
*/

module.exports = Adapter;


