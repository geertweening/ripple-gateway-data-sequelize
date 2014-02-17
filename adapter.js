var models = require('require-all')({
  dirname: __dirname + '/models',
  filter: /(.+)\.js(on)?$/
})

var Adapter = function(){
  this.models = models;
}

module.exports = Adapter;
