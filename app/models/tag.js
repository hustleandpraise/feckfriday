var services    = require('../services'),
    Tweet       = require('./tweet');

var Tag = services.Bookshelf.Model.extend({
    tableName:  'tags',
    hasTimestamps: ["created_at", "updated_at"],
    initialize: function() {
    },
    tweets: function() {
        return this.belongsToMany('Tweet');
    }
});

module.exports = services.Bookshelf.model('Tag', Tag);
