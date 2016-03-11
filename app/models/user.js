var services    = require('../services'),
    Tweet       = require('./tweet');

var User = services.Bookshelf.Model.extend({
    tableName:  'users',
    hasTimestamps: ["created_at", "updated_at"],
    initialize: function() {
    },
    tweets: function() {
        return this.hasMany('Tweet');
    }
});

module.exports = services.Bookshelf.model('User', User);
