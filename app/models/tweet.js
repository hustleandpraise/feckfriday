var services    = require('../services'),
    checkit     = require('checkit'),
    User        = require('./user'),
    Tag         = require('./tag');

var Tweet = services.Bookshelf.Model.extend({
    tableName:  'tweets',
    hasTimestamps: ["created_at", "updated_at"],
    initialize: function() {
    },
    user: function() {
        return this.belongsTo('User');
    },
    tags: function() {
        return this.belongsToMany('Tag');
    },
});

module.exports = services.Bookshelf.model('Tweet', Tweet);
