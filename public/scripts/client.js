/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Test / driver code (temporary). Eventually will get this from the server.

const tweetData = {
  "user": {
    "name": "Newton",
    "avatars": "https://i.imgur.com/73hZDYK.png",
    "handle": "@SirIsaac"
  },
  "content": {
    "text": "If I have seen further it is by standing on the shoulders of giants"
  },
  "created_at": 1461116232227
};


/*
 * define a function createTweetElement that takes in a tweet object and is responsible for
 * returning a tweet <article> element containing the entire HTML structure of the tweet.
 */
const createTweetElement = function(tweetData) {

  let passDays = (new Date() - tweetData.created_at) / 1000 / 60 / 60 / 24;  // ms-->day
  passDays = Math.round(passDays);
  console.log(passDays);

  return `
          <article class="tweets-container" id="tweets-container"> 
            <header>
                <div style="width: 50%;">
                    <img class="author_avarta" src =${tweetData.user.avatars}> 
                    <span class="author_name"">${tweetData.user.name}</span>
                </div>
                <div><span class="at_name">${tweetData.user.handle}</span></div>
            </header>
            <div>
                <textarea class="tweet_content" readonly required>${tweetData.content.text}</textarea>
            </div>
            <footer>               
                <div> <span class="post_date" >${passDays} days ago</span> </div>
            </footer>
        </article>
        `;
};

/* Fake data taken from initial-tweets.json */
const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": "https://i.imgur.com/73hZDYK.png"
      ,
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": "https://i.imgur.com/nlhLi3I.png",
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  }
];

const renderTweets = function(tweets) {
  // loops through tweets
  if (Array.isArray(tweets)) {
    tweets.forEach((article) => {
      let tweetArticle = createTweetElement2(article);
      $('.container').append(tweetArticle);
      //$('.tweets-container').after(tweetArticle);
    });
  }
  console.log("add completed");
};

const createTweetElement2 = function(tweet) {
  let $tweet = $('<article>').addClass('tweets-container');
  let passDays = (new Date() - tweet.created_at) / 1000 / 60 / 60 / 24;  // ms-->day
  passDays = Math.round(passDays);

  $tweet.append(`
            <header>
                <div style="width: 50%;">
                    <img class="author_avarta" src =${tweet.user.avatars}>
                    <span class="author_name"">${tweet.user.name}</span>
                </div>
                <div><span class="at_name">${tweet.user.handle}</span></div>
            </header>
            <div>
                <textarea class="tweet_content" readonly required>${tweet.content.text}</textarea>
            </div>
            <footer>
                <div> <span class="post_date" >${passDays} days ago</span> </div>
            </footer>
            `);

  return $tweet;
};

 
$(document).ready(() => {

  //const $tweet = createTweetElement(tweetData);
  console.log("get the html tags");

  //Test / driver code (temporary)
  //console.log($tweet); // to see what it looks like

  //to add it to the page so we can make sure it's got all the right elements, classes, etc.
  //$('#tweets-container').after($tweet);
  //renderTweets(data);
  // process posting new tweet by ajax
  // $("form").on("submit", function(event) {
  //   event.preventDefault();
  //   console.log($(this).serialize());
  // });

  // $button = $('#post-new-tweet');
  // $button.on('click', function(event) {
  //   event.preventDefault();
  //   console.log($('.underline').serialize());

  const $validatePosts = function() {
    $("form").on("submit", function(event) {
      event.preventDefault();
      let contentLen = $(this).serialize().length - 5;
      console.log($(this).serialize());
      if (contentLen === 0) {
        alert("You cannot post an empty tweet.");
      }
      if (contentLen > 140) {
        alert("Your tweet is too long, make it shorter.");
      }
    });
  };

  const $loadTweets = function() {
    console.log("get a request for tweets");
    $.ajax("/tweets/", {method: 'GET'})
      .then((tweets) => {
        renderTweets(tweets);
      });
  };
  $validatePosts();
  $loadTweets();

});