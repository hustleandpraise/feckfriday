

var colors = [
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#795548",
    "#9e9e9e",
    "#607d8b",
]

exports.getColor = function() {
    return colors[Math.floor(Math.random()*colors.length)]
}

exports.linkify_tweet = function(str) {
    var tweet = str.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,"<a href='$1'>$1</a>");
    tweet = tweet.replace(/(^|\s)@(\w+)/g, "$1<a href=\"http://www.twitter.com/$2\">@$2</a>");
    return tweet.replace(/(^|\s)#(\w+)/g, "$1<a href=\"http://search.twitter.com/search?q=%23$2\">#$2</a>");
}
