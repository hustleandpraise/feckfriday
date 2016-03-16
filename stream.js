
var Twitter     = require('twitter'),
    Models      = require('./app/models/'),
    emojiStrip  = require('emoji-strip');

var client = new Twitter({
    consumer_key:           process.env.FECK_CONSUMER_KEY,
    consumer_secret:        process.env.FECK_CONSUMER_SECRET,
    access_token_key:       process.env.FECK_ACCESS_TOKEN_KEY,
    access_token_secret:    process.env.FECK_ACCRESS_TOKEN_SECRET
});

/*
|--------------------------------------------------------------------------
| User Setup
|--------------------------------------------------------------------------
*/

var userSetup = function(user) {
    return new Promise((resolve, reject) => {
        var findUser = new Models.User({ twitter_id: user.twitter_id }).fetch();

        findUser.then((model) => {
            if(model === null) {
                var newUser = new Models.User(user).save();
                newUser.then((newUserModel) => {
                    resolve(newUserModel);
                }).catch((err) => {
                    reject(err);
                });
            } else {
                resolve(model);
            }
        }).catch((err) => {
            reject(err);
        });
    });
}

/*
|--------------------------------------------------------------------------
| Hashtag Setup
|--------------------------------------------------------------------------
*/

var addHash = function(tag) {
    return new Promise((resolve, reject) => {

        var findTag = new Models.Tag({ title: tag.text.toLowerCase() }).fetch();

        findTag.then((model) => {
            if(model === null) {
                var newtag = new Models.Tag({ title: tag.text.toLowerCase() }).save();
                newtag.then((newtagModel) => {
                    resolve(newtagModel.get('id'));
                }).catch((err) => {
                    reject(err);
                });
            } else {
                resolve(model.get('id'));
            }
        }).catch((err) => {
            reject(err);
        });

    });
}

var setupHashtags = function(hashtags) {
    if(hashtags.length <= 0) return [];
    var arr = [];
    hashtags.forEach((tag) => {
        arr.push(addHash(tag))
    });
    console.log(arr);
    return arr;
}

/*
|--------------------------------------------------------------------------
| Resolve Models to Stream
|--------------------------------------------------------------------------
*/

exports.listen = function(io) {
    client.stream('statuses/filter', { track: '#FeckFridayIn, #FeckFridayOff, #FeckFridayAWOL, #FeckFriday', language: 'en', }, function(stream) {

        console.log('Stream Running...');

        stream.on('data', (tweet) => {

            console.log(tweet);

            var original    = tweet,
                tweet       = tweet.text.toLowerCase();

            /*
            |--------------------------------------------------------------------------
            | Filter out Bullshit
            |--------------------------------------------------------------------------
            */

            if(tweet.includes('rt @')) return;


            /*
            |--------------------------------------------------------------------------
            | Save Tweet, Locations, Categories and Tags
            |--------------------------------------------------------------------------
            */

            var u = original.user;

            userSetup({
                twitter_id: u.id,
                username:   u.screen_name,
                avatar:     u.profile_image_url_https,
                verified:   u.verified
            }).then((user) => {

                var saveTweet = new Models.Tweet({ 
                    user_id: user.id,
                    tweet_id: original.id,
                    text: emojiStrip(original.text),
                    tweet_created_at: new Date(original.created_at)
                });

                saveTweet.save().then((model) => {
                    io.emit('tweet', { user: user.toJSON(), tweet: model.toJSON(), hashtags: original.entities.hashtags });
                    Promise.all(setupHashtags(original.entities.hashtags)).then((tags) => {
                        model.tags().attach(tags).then((tags) => {
                            console.log('Done!');
                        });
                    })
                }).catch((err) => {
                    console.log(err);
                });

            }).catch((err) => {
                console.log(err);
            });

        });

        stream.on('error', (error) => {
            console.log(error);
        });

    });
}

