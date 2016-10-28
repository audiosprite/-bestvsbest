// inverted clone of @worstvsworst

const request = require('request');
const Twit = require('twit');
const rita = require('rita');

// var theVersion = RiTa.VERSION;

let T = new Twit({
  consumer_key:         '2ytX5U6ddRBdza5UoeVGQyVkD',
  consumer_secret:      '8kOjIL5BY9Qr47R7sK9Jn2zAe5AugnPdpLAkqqsDbneBeWZc3S',
  access_token:         '791849452550094848-k61J9ZlzM5Fo0IF2baar00p4KIBUSwx',
  access_token_secret:  'N3XmCBhiEKABd5IxGp9qcPhgQeiSET0CYMMLxY6nW10Az',
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
})

const chopAfterITB = function(tweetArr){
    for (var i = 0; i < tweetArr.length; i++){
        if (tweetArr[i].substring(0, 2).toLowerCase() === 'is' && tweetArr[i+1].substring(0, 3).toLowerCase() === 'the' && tweetArr[i+2].substring(0, 4).toLowerCase() === 'best'){
            var beforeITBA = tweetArr.slice(0, i);
        }
    }
    return beforeITBA;
}

const chopAtsAndRT = function(tweetArr){
    // console.log('chop func')
    var afterAtsA = tweetArr;
    for (var j = 0; j < tweetArr.length; j++){
        if (tweetArr[j][0] === '@' || tweetArr[j].toLowerCase() === 'rt' || tweetArr[j].toLowerCase() === 'cc'){
            // console.log('got in')
            afterAtsA = tweetArr.slice(j+1, tweetArr.length);
        } else {
            break;
        }
        // console.log('choploop', afterAtsA);
    }
    return afterAtsA;
}

const pickFirstIndex = function(tweetArr){
    //also implement: starting with/is nonalphanumeric

    var afterStartingTypes = tweetArr;
    for (var i = tweetArr.length; i > 0 ; i--){
        if (rita.RiTa.getPosTags(tweetArr[i]).indexOf('dt') !== -1 ||
            // rita.RiTa.getPosTags(tweetArr[i]).indexOf('ex') !== -1 ||
            // rita.RiTa.getPosTags(tweetArr[i]).indexOf('cc') !== -1 ||
            // rita.RiTa.getPosTags(tweetArr[i]).indexOf('wp') !== -1 ||
            // rita.RiTa.getPosTags(tweetArr[i]).indexOf('in') !== -1 ||
            // rita.RiTa.getPosTags(tweetArr[i]).indexOf('rb') !== -1 ||
            // rita.RiTa.getPosTags(tweetArr[i]).indexOf('in') !== -1 ||
            // rita.RiTa.getPosTags(tweetArr[i]).indexOf('wdt') !== -1 ||
            rita.RiTa.getPosTags(tweetArr[i]).indexOf('vbp') !== -1 ||
            rita.RiTa.getPosTags(tweetArr[i]).indexOf('vbg') !== -1 ||
            rita.RiTa.getPosTags(tweetArr[i]).indexOf('vbd') !== -1 ||
            rita.RiTa.getPosTags(tweetArr[i]).indexOf('vbn') !== -1 ||
            rita.RiTa.getPosTags(tweetArr[i]).indexOf('vbz') !== -1 ||
            rita.RiTa.getPosTags(tweetArr[i]).indexOf('vb') !== -1
        ){
            console.log('chose first index based on word type');
            console.log(rita.RiTa.getPosTagsInline(tweetArr));
            afterStartingTypes = tweetArr.slice(i, tweetArr.length);
            break;
        }
    }
    for (var i = tweetArr.length-1; i >= 0 ; i--){
        var lastchar = tweetArr[i].charAt(tweetArr[i].length-1);
        if (lastchar === "." ||
            lastchar === "," ||
            lastchar === "!" ||
            lastchar === "?" ||
            lastchar === "[" ||
            lastchar === "]" ||
            lastchar === ":" ||
            lastchar === "(" ||
            lastchar === ")"
        ){
            console.log('chose first index based on ending character');
            afterStartingTypes = tweetArr.slice(i+1, tweetArr.length);
            break;
        }
    }
    return afterStartingTypes;
}

const checkIfEndingWithIllegalWordType = function(tweetArr){
    if (rita.RiTa.getPosTags(tweetArr[tweetArr.length-1]).indexOf('dt') !== -1 ||
        rita.RiTa.getPosTags(tweetArr[tweetArr.length-1]).indexOf('cc') !== -1 ||
        rita.RiTa.getPosTags(tweetArr[tweetArr.length-1]).indexOf('wp') !== -1 ||
        rita.RiTa.getPosTags(tweetArr[tweetArr.length-1]).indexOf('in') !== -1 ||
        rita.RiTa.getPosTags(tweetArr[tweetArr.length-1]).indexOf('vbp') !== -1 ||
        rita.RiTa.getPosTags(tweetArr[tweetArr.length-1]).indexOf('rb') !== -1 ||
        rita.RiTa.getPosTags(tweetArr[tweetArr.length-1]).indexOf('in') !== -1 ||
        rita.RiTa.getPosTags(tweetArr[tweetArr.length-1]).indexOf('wdt') !== -1 ||
        rita.RiTa.getPosTags(tweetArr[tweetArr.length-1]).indexOf('vb') !== -1 ||
        rita.RiTa.getPosTags(tweetArr[tweetArr.length-1]).indexOf('prp') !== -1
    ){
        throw new Error('phrase ended with illegal word type', rita.RiTa.getPosTags(tweetArr[tweetArr.length-1]));
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

T.get('search/tweets', { q: '"is the best" since:2013-07-11', count: 100 })
// , function(err, data, response) {
    .then(function(result){
        let tweetA = result.data.statuses[Math.floor(Math.random() * (101))].text;
        let tweetB = result.data.statuses[Math.floor(Math.random() * (101))].text;
        console.log(tweetA);
        let tweetAArr = tweetA.split(" ");
        let tweetBArr = tweetB.split(" ");

        ///////////////////

        tweetAArr = chopAfterITB(tweetAArr);
        console.log(tweetAArr.join(" "));

        checkIfEndingWithIllegalWordType(tweetAArr);

        tweetAArr = chopAtsAndRT(tweetAArr);
        console.log(tweetAArr.join(" "), '| after chop');

        tweetAArr = pickFirstIndex(tweetAArr);
        console.log(tweetAArr.join(" "), '| after pickfirst');

        var abeforetags = rita.RiTa.getPosTagsInline(tweetAArr);
        console.log(abeforetags);

        if (!tweetAArr) throw new Error('array A is empty!');

        for (var i = 0; i < tweetAArr; i++){
            tweetAArr[i] = tweetAArr[i].toLowerCase();
        }
        // tweetAArr[i] = capitalizeFirstLetter(tweetAArr[i]);

        ///////////////////

        tweetBArr = chopAfterITB(tweetBArr);
        console.log(tweetBArr.join(" "));

        checkIfEndingWithIllegalWordType(tweetBArr);

        tweetBArr = chopAtsAndRT(tweetBArr);
        console.log(tweetBArr.join(" "), '| after chop');

        tweetBArr = pickFirstIndex(tweetBArr);
        console.log(tweetBArr.join(" "), '| after pickfirst');

        var bbeforetags = rita.RiTa.getPosTagsInline(tweetBArr);
        console.log(bbeforetags);

        if (!tweetBArr) throw new Error('array A is empty!');

        for (var i = 0; i < tweetBArr; i++){
            tweetBArr[i] = tweetBArr[i].toLowerCase();
        }

        //////////////////

        var finalTweet = tweetAArr.join(" ") + " vs " + tweetBArr.join(" ");
        console.log('finaltweet!', finalTweet);

        T.post('statuses/update', { status: finalTweet }, function(err, data, response) {
            console.log(data);
        })
    })
    

    // })
    // .catch(function(err){
    //     // console.log('err', err.stack)
    // })