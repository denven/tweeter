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


//put all the history tweets reversely
//and this function should be called when page loaded
const getHistoryTweets = function(tweets) {
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
const getLatestTweet = function(tweets) {
  let tweetArticle = createTweetElement2(tweets[tweets.length - 1]);
  $('#tweet-composer').after(tweetArticle);
  console.log("latest tweet:", tweets[tweets.length - 1]);
};


$(document).ready(() => {

  // Toggle the tweet composer container once user clicks the top-right
  // "write new tweet" text button.
  $('#new-button').on('click', function(event) {
    event.preventDefault();
    $(document).scrollTop(0);
    $("#tweet-composer").slideToggle();
  });

  const $clearInputArea = function() {
    $('#tweet-input').val('');
  };

  const $submitNewTweet = function() {
    $.ajax({
      url: '/tweets/',
      type: "POST",
      data: $('form').serialize(),
      success: function(data) {
        renderTweetArticles(getLatestTweet);
        $clearInputArea(); //clear textarea
      }
    });
  };



  /**
   * New Tweet content length validation.   *
   */
  const $validatePosts = function() {
    $('#tweet-form').submit(function(event) {
      event.preventDefault();
      let inputLen = $('textarea').val().length;
      
      // remove the hidden <span> before each time runs,
      // as it will be created when showing the error message
      $(".error-msg").remove();
  
      // when validation fails, (no input or input string length is greater than 140)
      // error message string will be shown in a created span.
      // we put the added span elements ahead of the input textarea.
      if (inputLen < 1) {
        $('#text').before(`
            <span class="error-msg">
              <i class="fas fa-exclamation-triangle"></i>This field is required.<i class="fas fa-exclamation-triangle"></i>
            </span>
        `);
        $(".error-msg").slideToggle(3000);  // display 3s then hide
        return;
      }
      
      if (inputLen > 140) {
        $('#text').before(`
            <span class="error-msg">
              <i class="fas fa-exclamation-triangle"></i>Too long, please make it in 140 characters.<i class="fas fa-exclamation-triangle"></i>
            </span>
          `);
        $(".error-msg").slideToggle(3000);
        return;
      }
      
      $submitNewTweet();   // validated user input wil be submitted
    });
  };


  /*
   * The "scroll-button" is used to put document on top of the window.
   * It's hidden once the page loaded, then:
   *     - show when user scrolls down
   *     - hide when page goes top by scrolling up or clicking this button.
   */
  $("#scroll-button").hide();     // hide when page loads

  $(document).scroll(function(event) {
    event.preventDefault();
    let top = $(window).scrollTop();

    // show button only when the top of scroll bar down is below the header
    if (top > 400) {
      $("#scroll-button").show();
    } else {
      $("#scroll-button").hide();
    }
  });

  // let document go top when user clicked the button
  $("#scroll-button").on('click', function(event) {
    event.preventDefault();
    $(document).scrollTop(0);
  });

  // display
  const renderTweetArticles = function(callback) {
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

  $("#tweet-composer").hide();            // the tweet-composer board is hide when page loads
  renderTweetArticles(getHistoryTweets);  // load history tweets saved in server files
  $validatePosts();                       // check user new tweet when the posts

});