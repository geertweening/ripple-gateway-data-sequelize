var externalAccountModel = require('../models/external_accounts');

function configure(api) {

  api.createExternalAccount = function(opts, fn){
    var model = externalAccountModel.build(opts);
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

  api.getExternalAccount = function(opts, fn){
    externalAccountModel.find(opts.id).complete(function(err, external_account){
      if (err){
        fn(err, null);
      } else if (external_account){
        fn(null, external_account);
      } else {
        fn({ id: 'record not found' }, null);
      }
    });
  };

  api.getExternalAccounts = function(opts, fn){
    externalAccountModel.findAll({ where: opts }).complete(function(err, external_accounts){
      if (err){
        fn(err, null);
      } else if (external_accounts){
        fn(null, external_accounts);
      } else {
        fn({ id: 'record not found' }, null);
      }
    });
  };

  api.updateExternalAccount = function(opts, fn){
    externalAccountModel.find(opts.id).complete(function(err, external_account){
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

  api.deleteExternalAccount = function(opts, fn){
    externalAccountModel.find(opts.id).complete(function(err, external_account){
      var data = external_account.toJSON();
      external_account.destroy().complete(function(){
        fn(null, data);
      });
    });
  };

};

module.exports = configure;