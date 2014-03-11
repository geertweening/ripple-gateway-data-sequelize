var crypto    = require('crypto');
var userModel = require('../models/users');

function configure(api) {

  api.create = function(opts, fn) {

    function generateSalt () {
      var sha = crypto.createHash('sha256');
      return sha.update(crypto.randomBytes(128)).digest('hex');
    }

    function saltPassword (password, salt) {
      return crypto.createHmac('sha256', salt).update(password).digest('hex');
    }

    function verifyPassword (password, salt, passwordHash) {
      return (saltPassword(password, salt) == passwordHash);
    }

    if (opts.name == 'admin') {
      fn({ name: 'cannot be admin' }, null); return false;
    }

    if (opts.data) {
      opts.data = JSON.stringify(opts.data);
    }

    opts.salt = generateSalt();
    opts.password_hash = saltPassword(opts.password, opts.salt);
    
    var model = userModel.build(opts);

    var errors = model.validate();
    if (errors) {
      fn(errors, null); return false;
    }

    model.save().complete(function(err, user) {
      if (err) {
        fn(err, null);
      } else {
        if (user.data) {
          user.data = JSON.parse(user.data);
        }
        fn(null, user);
      }
    });
  };

  api.read = function(opts, fn) {
    userModel.find({where: opts}).then(function(user) {

      if (user.data) {
        user.data = JSON.parse(user.data);
      }
      fn(null, user);

    }, function(err) {
      fn(err, null);
    });
  }

  api.update = function(selectOpts, updateOpts, fn) {
    
    api.read(selectOpts, function(err, user) {
      if (err) {
        fn(err, null);
      } else {

        if (user.data && updateOpts.data) {
          for (var key in updateOpts.data) {
            user.data[key] = updateOpts.data[key];
          }
          updateOpts.data = user.data;
        }

        var update = function(updateOpts) {
          user.updateAttributes(updateOpts).then(function(user) {
            if (user.data) {
              user.data = JSON.parse(user.data);
            }
            fn(null, user);
          }), function(err) {
            fn(err, null);
          }
        }

        if (updateOpts.data) {
          updateOpts.data = JSON.stringify(updateOpts.data);
          update(updateOpts);
        } else {
          update(updateOpts);      
        }
      }
    });  
  }
}

module.exports = configure;