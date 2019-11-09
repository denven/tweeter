/*
 * define a function createTweetElement that takes in a tweet object and is responsible for
 * returning a tweet <article> element containing the entire HTML structure of the tweet.
 */
const generatePastTime = function(milliSec) {

  let date = new Date(milliSec);
  let dateDiffSecs = Math.floor((new Date() - milliSec) / 1000) + 1;
  let passDays = Math.floor((dateDiffSecs) / 60 / 60 / 24);

  let passSecs = Math.floor(dateDiffSecs % 60);
  let passMins = Math.floor((dateDiffSecs / 60) % 60);
  let passHrs = Math.floor((dateDiffSecs / 3600) % 24);
  
  let timeDiff = ((passHrs > 0) ? passHrs + "h " : '') +
                 ((passMins > 0) ? passMins + "m " : '') +
                 ((passSecs > 0) ? passSecs + "s " : '') +
                  'ago';

  if (Math.floor(passDays) > 0) {

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    month = (month < 10) ? ("0" + month) : month;

    day = (day < 10) ? ("0" + day) : day;
    date = month + '/' + day + '/' + year;
    date = "Posted on " + date + ", " + Math.floor(passDays) + " days ago.";

  } else {
    // let hour = date.getHours();
    // let minutes = date.getMinutes();
    // let seconds = date.getSeconds();

    date = 'Posted ' + timeDiff;
  }

  return date;
};


const createTweetElement21 = function(tweet) {
  
  let $tweet = $('<article>').addClass('tweets-container');
  let passDays = (new Date() - tweet.created_at) / 1000 / 60 / 60 / 24;  // ms-->day
  passDays = Math.round(passDays);
  const dateInfo = generatePastTime(tweet.created_at);

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
          <div> <span class="post_date" >${dateInfo}</span>
          <span class="friend_action"><i class="fas fa-flag"></i> <i class="fas fa-retweet"></i> <i class="fas fa-heart"></i> </div>
      </footer>
      `);

  return $tweet;
};


const createTweetElement2 = function(tweet) {

  let passDays = (new Date() - tweet.created_at) / 1000 / 60 / 60 / 24;  // ms-->day
  passDays = Math.round(passDays);
  const dateInfo = generatePastTime(tweet.created_at);

  return `
    <article class="tweets-container" id="tweets-container"> 
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
          <div> <span class="post_date" >${dateInfo}</span>
          <span class="friend_action"><i class="fas fa-flag"></i> <i class="fas fa-retweet"></i> <i class="fas fa-heart"></i> </div>
      </footer>
    </article>
      `;
  //         <article class="tweets-container" id="tweets-container">
  //     <header>
  //         <div style="width: 50%;">
  //             <img class="author_avarta" src =${tweet.user.avatars}>
  //             <span class="author_name"">${tweet.user.name}</span>
  //         </div>
  //         <div><span class="at_name">${tweet.user.handle}</span></div>
  //     </header>
  //     <div>
  //         <textarea class="tweet_content" readonly required>${tweet.content.text}</textarea>
  //     </div>
  //     <footer>
  //         <div> <span class="post_date" >10 days ago</span> </div>
  //     </footer>
  // </article>
};


//put all the history tweets reversely
//and this function should be called when page loaded
const getHistoryTweets = function(tweets) {
  // loops through tweets
  if (Array.isArray(tweets)) {

    // add each tweet before the template tweet
    // each time we add the latest in the array
    // so the latest will put on top
    // for (let i = tweets.length - 1; i >= 0; i--) {
    //   let tweetArticle = createTweetElement2(tweets[i]);
    //   $('#tweets-container').before(tweetArticle);
    // }
    for (let i = 0; i < tweets.length; i++) {
      let tweetArticle = createTweetElement2(tweets[i]);
      $('#tweet-composer').after(tweetArticle);
    }
  }
};

// put the latest tweet just below the tweet-composer section
const getLatestTweet = function(tweets) {
  let tweetArticle = createTweetElement2(tweets[tweets.length - 1]);
  $('#tweet-composer').after(tweetArticle);
};


$(document).ready(() => {

  // Toggle the tweet composer container once user clicks the top-right
  // "write new tweet" text button.
  $('#new-button').on('click', function(event) {
    event.preventDefault();
    $(document).scrollTop(0);
    $("#tweet-composer").slideToggle();
  });


  $(window).resize(function() {
    const $winHeight = $(window).height();
    if ($winHeight < 500) {
      $('#header').slideToggle();
    } else {
      $('#header').show();
    }
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
        $('#tweet-input').before(`
            <span class="error-msg">
              <i class="fas fa-exclamation-triangle">
              </i>This field is required.
              <i class="fas fa-exclamation-triangle"></i>
            </span>
        `);
        $(".error-msg").slideToggle(3000);  // display 3s then hide
        return;
      }
      
      if (inputLen > 140) {
        $('#tweet-input').before(`
            <span class="error-msg">
              <i class="fas fa-exclamation-triangle"></i>Too long, please make it in 140 characters.<i class="fas fa-exclamation-triangle"></i>
            </span>
          `);
        $(".error-msg").slideToggle(3000);
        return;
      }
      
      $submitNewTweet();   // validated user input wil be submitted
      $('.counter').text("140");
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
    if (top > 0) {
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