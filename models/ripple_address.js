var db = require('../../config/initializers/sequelize');
var Sequelize = require("sequelize");
var RippleTransaction = require('./ripple_transaction');

var RippleAddress = db.define('ripple_address', {
  id: { 
		type: Sequelize.INTEGER, 
		primaryKey: true,
		autoIncrement: true
	},
  user_id: { 
    type: Sequelize.INTEGER
  },
  managed: { 
    type: Sequelize.BOOLEAN, 
    notNull: true, 
    defaultValue: false,
    validate: { 
      notNull: true 
    }
  },
  address: { 
    type: Sequelize.STRING,
    notNull: true,
    validate: { 
      notNull: true,
      len: [20, 35]
    }
  },
  type: { 
    type: Sequelize.STRING, 
    notNull: true,
    validate: { 
      notNull: true,
      isIn: [['hot','cold','hosted','independent']]
    }
  },
  secret: { 
    type: Sequelize.STRING,
  },
  tag: { 
    type: Sequelize.INTEGER,
  },
  previous_transaction_hash: { 
    type: Sequelize.STRING,
  }
}, {
  classMethods: {
    getHot: function(fn){
      RippleAddress.find({ where: { type: 'hot' }}).complete(fn);
    },
    getCold: function(fn){
      RippleAddress.find({ where: { type: 'cold' }}).complete(fn);
    },
    createHot: function(adminId, hotWallet, fn) {
      RippleAddress.create({
        managed: true,
        user_id: adminId,
        type: 'hot',
        address: hotWallet.address,
        secret: hotWallet.secret
      }).complete(fn)
    },
    createCold: function(fn) {
      RippleAddress.create({
        managed: true,
        user_id: admin.id,
        type: 'cold',
        address: hotWallet.address,
        secret: hotWallet.secret
      }).complete(fn)
    },
    setHot: function(adminId, hotWallet, fn) {
      var Klass = this;
      RippleAddress.getHot(function(err, address){
        if (address) {
          address.destroy().success(function(){
            Klass.createHot(adminId, hotWallet, fn);
          });
        } else {  
          Klass.createHot(adminId, hotWallet, fn);
        }
      });
    },
    setCold: function(adminId, coldWallet, fn) {
      var Klass = this;
      RippleAddress.getCold(function(err, address){
        if (address) {
          address.destroy().success(function(){
            Klass.createCold(adminId, hotWallet, fn);
          });
       } else {  
          Klass.createCold(adminId, hotWallet, fn);
        }
      });
    },
    createHosted: function(user, fn){
      RippleAddress.getHot(function(err, hotWallet) {
        if (hotWallet) {
          RippleAddress.create({
            type: 'hosted',
            managed: true,
            user_id: user.id,
            tag: user.id,
            address: hotWallet.address
          }).complete(function(err, address){
            fn(err, address);
          });
        } else { fn(err, null) }
      });
    }
  },
  instanceMethods: {
    sendPayment: function(opts, fn) {
      opts.from_address_id = this.id;
      opts.from_amount = opts.to_amount;
      opts.from_currency = opts.to_currency;
      opts.from_issuer = opts.to_issuer;
      RippleTransaction.create(opts).complete(fn);
    },
    recordReceivedPayment: function() {
      // record a payment received to this ripple address
    },
    updateSentPayment: function() {
      // confirm that a payment sent was processed  
    }
  }
});

module.exports = RippleAddress;
