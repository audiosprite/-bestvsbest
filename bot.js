// inverted clone of @worstvsworst

const request = require('request');
const Twit = require('twit');
const rita = require('rita');

// var theVersion = RiTa.VERSION;

let T = new Twit({
  consumer_key:         'z2n3He3eIxQ87YY8hXyxuwKLK',
  consumer_secret:      '2An2u6Gs43rF2G2LaP6RYa6ehyWjRsSJ5tlMBayjC7dIMBBROZ',
  access_token:         '272260932-9qi8ClliU4jCazRnTBmnuzHBBVj3hpm17akDYvMn',
  access_token_secret:  'RBhTFX0BjRMlGQZA6ar44YSyDSxM8BWDmzc0lg3NFz82m',
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
        if (tweetArr[j][0] === '@' || tweetArr[j] === 'RT'){
            // console.log('got in')
            afterAtsA = tweetArr.slice(j+1, tweetArr.length);
        } else {
            break;
        }
        // console.log('choploop', afterAtsA);
    }
    return afterAtsA;
}

T.get('search/tweets', { q: '"is the best" since:2011-07-11', count: 100 }, function(err, data, response) {
    let tweetA = data.statuses[Math.floor(Math.random() * (101))].text;
    let tweetB = data.statuses[Math.floor(Math.random() * (101))].text;
    console.log(tweetA);
    let tweetAArr = tweetA.split(" ");
    let tweetBArr = tweetB.split(" ");

    tweetAArr = chopAfterITB(tweetAArr);
    console.log(tweetAArr.join(" "));
    tweetAArr = chopAtsAndRT(tweetAArr);
    console.log(tweetAArr.join(" "));

    // console.log('rita', rita.RiTa.getPosTags(tweetAArr[tweetAArr.length-1]));
    if (rita.RiTa.getPosTags(tweetAArr[tweetAArr.length-1]).indexOf('dt') !== -1 ||
        rita.RiTa.getPosTags(tweetAArr[tweetAArr.length-1]).indexOf('cc') !== -1 ||
        rita.RiTa.getPosTags(tweetAArr[tweetAArr.length-1]).indexOf('wp') !== -1 ||
        rita.RiTa.getPosTags(tweetAArr[tweetAArr.length-1]).indexOf('in') !== -1 ||
        rita.RiTa.getPosTags(tweetAArr[tweetAArr.length-1]).indexOf('vbp') !== -1 ||
        rita.RiTa.getPosTags(tweetAArr[tweetAArr.length-1]).indexOf('rb') !== -1 ||
        rita.RiTa.getPosTags(tweetAArr[tweetAArr.length-1]).indexOf('in') !== -1 ||
        rita.RiTa.getPosTags(tweetAArr[tweetAArr.length-1]).indexOf('wdt') !== -1
    ){
        console.log('phrase ended with illegal word type');
        throw new Error(rita.RiTa.getPosTags(tweetAArr[tweetAArr.length-1]));
    }

    var abeforetags = rita.RiTa.getPosTagsInline(tweetAArr);
    console.log(abeforetags)
    })
    .catch(function(err){
        // console.log('err', err.stack)
    })