
var express = require('express'),
    router  = express.Router(),
    models  = require('../models'),
    _       = require('lodash'),
    Moment  = require('moment'),
    services = require('../services');


/*
|--------------------------------------------------------------------------
| Home Controller
|--------------------------------------------------------------------------
*/

router.get('/', (req, res, next) => {

    var tweets = new models.Tweet().query(function(qb){
        return qb.orderBy('created_at','DESC'); 
    }).fetchAll({ withRelated: ['user'] });

    var inn     = new models.Tag().where('title', 'feckfridayin').fetch();
    var off     = new models.Tag().where('title', 'feckfridayoff').fetch();
    var awol    = new models.Tag().where('title', 'feckfridayawol').fetch();

    Promise.all([tweets, inn, off, awol]).then((models) => {

        var tweets = models[0].toJSON().map((tweet) => {
            return _.assign(tweet, {
                text: services.Str.linkify_tweet(tweet.text)
            });
        });

        Promise.all([
            services.Bookshelf.knex('tags_tweets').where({ tag_id : models[1].get('id') }).count('id as counted'),
            services.Bookshelf.knex('tags_tweets').where({ tag_id : models[2].get('id') }).count('id as counted'),
            services.Bookshelf.knex('tags_tweets').where({ tag_id : models[3].get('id') }).count('id as counted')
        ]).then((models) => {
            res.render('index', {
                moment: Moment,
                tweets: tweets,
                inn: models[0][0].counted,
                off: models[1][0].counted,
                awol: models[2][0].counted
            });
        });

    });

});

/*
|--------------------------------------------------------------------------
| Export 
|--------------------------------------------------------------------------
*/

module.exports = router;
