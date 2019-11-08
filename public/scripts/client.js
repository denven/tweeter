/*
 * define a function createTweetElement that takes in a tweet object and is responsible for
 * returning a tweet <article> element containing the entire HTML structure of the tweet.
 */
const createTweetElement2 = function(tweet) {
  console.log("------------------create tweet one time------------------");
  let $tweet = $('<article>').addClass('tweets-container');
  let passDays = (new Date() - tweet.created_at) / 1000 / 60 / 60 / 24;  // ms-->day
  passDays = Math.round(passDays);

  $tweet.append(`
            <header>
                <div style="width: 50%;">
                    <img class="author_avarta" src =${tweet["user"]["avatars"]}>
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

// const countTweetNumber() =  function () {

// }

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

// This is the Oldest tweet also the template tweet to display.
// const renderOldestTweet = function(param) {

// };


//put all the history tweets reversely
//and this function should be called when page loaded
const renderHistoryTweets = function(tweets) {
  // loops through tweets
  console.log("render History tweets", tweets);
  if (Array.isArray(tweets)) {

    // add each tweet before the template tweet
    // each time we add the latest in the array
    // so the latest will put on top
    for (let i = tweets.length - 1; i >= 0; i--) {
      let tweetArticle = createTweetElement2(tweets[i]);
      $('#tweets-container').before(tweetArticle);
    }
  }
  console.log("add history tweets completed: ", tweets.length);
};

// put the latest tweet just below the tweet-composer section
const renderLatestTweet = function(tweets) {
  let tweetArticle = createTweetElement2(tweets[tweets.length - 1]);
  $('#tweet-composer').after(tweetArticle);
  console.log("latest tweet:", tweets[tweets.length - 1]);
};


$(document).ready(() => {

  // const $loadTweets = function() {
  //   console.log("get a request for tweets");
  //   $.ajax("/tweets/", {method: 'GET'})
  //     .then((tweets) => {
  //       renderTweets(tweets);
  //     });
  // };

  $('#new-button').on('click', function(event) {
    event.preventDefault();
    // let $tweetComposer = $("#tweet-composer");
    // if ($tweetComposer.is(":hidden")) {
    //   $tweetComposer.show();
    // } else {
    //   $tweetComposer.hide();
    // }
    $("#tweet-composer").slideToggle();
  });

  // $('#toogle-composer').toggle(
  //   function(){$("#tweet-composer").hide();},
  //   function(){$("#tweet-composer").show();}
  // });

  $('#tweet-form').submit(function(e) {
    e.preventDefault();
    let textLen = $('textarea').val().length;
 
    $(".error-msg").remove();
 
    if (textLen < 1) {
      $('#text').before('<span class="error-msg"><i class="fas fa-exclamation-triangle"></i>This field is required.<i class="fas fa-exclamation-triangle"></i></span>');
      $(".error-msg").slideToggle(3000);

    }
    if (textLen > 140) {
      $('#text').before('<span class="error-msg">&#9888; Too long, please make it in 140 characters. &#9888;</span>');
      $(".error-msg").slideToggle(3000);
    }
    
  });


  $("#scroll-button").hide();

  $(document).scroll(function(event) {
    event.preventDefault();
    let top = $(window).scrollTop();
    if (top > 400) {
      $("#scroll-button").show();
    } else {
      $("#scroll-button").hide();
    }

  });

  $("#scroll-button").on('click', function(event) {
    event.preventDefault();
    $(document).scrollTop(0);
    // $("#scroll-button").();
  });

  const $validatePosts = function() {
    $("form").on("submit", function(event) {
      event.preventDefault();
      let formData = $(this).serialize();
      if (formData.length - 5 === 0) {
        return;
      }
      if (formData.length - 5 > 140) {
        //$('form').html("Your tweet is too long, make it shorter.");
        return;
      }

      $.ajax({
        url: '/tweets/',
        type: "POST",
        data: formData,
        success: function(data) {
          getAlltweets(renderLatestTweet);
        }
      });
    });
  };

  const getAlltweets = function(callback) {
    $.ajax({
      url: '/tweets/',
      type: 'GET',
      error: function() {
        console.log("request error");
      },
      dataType: 'json',
      success: function(data) {
        callback(data);
      }
    });
  };
  //$loadTweets();
  getAlltweets(renderHistoryTweets);
  $("#tweet-composer").hide();
  $validatePosts();
});