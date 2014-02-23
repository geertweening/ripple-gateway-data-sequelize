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

Adapter.prototype.createRippleTransaction = function(opts, fn){
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

module.exports = Adapter;
