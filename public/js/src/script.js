

/*
|--------------------------------------------------------------------------
| Script
|--------------------------------------------------------------------------
*/

var contains = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};

$(function() {

    var ctx = $("#feckitanyway").get(0).getContext("2d");

    var data = [
        {
            value: $('body').data('off'),
            color: "rgba(255,255,255,0.2)",
            highlight: "rgba(255,255,255,0.3)",
            label: "FeckFridayOff"
        },
        {
            value: $('body').data('in'),
            color: "rgba(255,255,255,0.4)",
            highlight: "rgba(255,255,255,0.5)",
            label: "FeckFridayIn"
        },
        {
            value: $('body').data('awol'),
            color: "rgba(255,255,255,0.6)",
            highlight: "rgba(255,255,255,0.7)",
            label: "FeckFridayAWOL"
        }
    ];


    var myDoughnutChart = new Chart(ctx).Doughnut(data, {
        segmentShowStroke: false,
        percentageInnerCutout: 80,
        responsive: true,
        tooltipTemplate: "<%if (label){%><%=label%><%}%>",
    });

    var socket = io();


    var showTweet = function(tweet) {
        var template = [
        '<div class="tweet">',
        '<div class="wrap">',
        '<div class="user"><a href="http://twitter.com/{{=it.username}}"><img src="{{=it.avatar}}" alt="{{=it.username}}"></a></div>',
        '<div class="text">',
        '<div class="username"><a href="http://twitter.com/{{=it.username}}">@{{=it.username}}</a></div>',
        '<div class="chars">{{=it.text}}</div>',
        '<div class="date">{{=it.created_at}}</div>',
        '</div>',
        '</div>',
        '</div>'
        ].join('');

        var tweetTemp = doT.template(template);

        var data = {
            username: tweet.user.username,
            avatar: tweet.user.avatar,
            text: tweet.tweet.text,
            created_at: moment(tweet.tweet.created_at).fromNow()
        }
        var html = $(tweetTemp(data));
        $('.tweets').prepend(html)
    }



    socket.on('tweet', function(tweet) {
        console.log(tweet);

        showTweet(tweet);

        var arr = [];
        $.each(tweet.hashtags, function(index, tag) {
            arr.push(tag.text);
        });
        if( contains.call(arr, 'feckfridayoff') ) myDoughnutChart.segments[0].value = (myDoughnutChart.segments[0].value + 1);
        if( contains.call(arr, 'feckfridayin') ) myDoughnutChart.segments[1].value = (myDoughnutChart.segments[1].value + 1);
        if( contains.call(arr, 'feckfridayawol') ) myDoughnutChart.segments[2].value = (myDoughnutChart.segments[2].value + 1);
        myDoughnutChart.update();
    });

});
