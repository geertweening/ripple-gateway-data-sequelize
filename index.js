var models = require('require-all')({
  dirname: __dirname + '/lib/models',
  filter: /(.+)\.js(on)?$/
})

var Adapter = function(){
  this.models = models;
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
          name: error.detail, 
          user_id: error.detail 
        }, null);
      }
    });
  }

};

module.exports = Adapter;
