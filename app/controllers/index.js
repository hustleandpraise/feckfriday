
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

    var tweets = new models.Tweet().fetchAll({ withRelated: ['user'] }).catch((err) => {
        console.log(err);
    })

    tweets.then((models) => {

        var tweets = models.toJSON().map((tweet) => {
            return _.assign(tweet, {
                text: services.Str.linkify_tweet(tweet.text),
                color: services.Str.getColor()
            })
        });

        res.render('index', {
            moment: Moment,
            tweets: tweets
        });

    })

});

/*
|--------------------------------------------------------------------------
| Export 
|--------------------------------------------------------------------------
*/

module.exports = router;
