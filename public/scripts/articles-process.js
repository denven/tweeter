/*
 * Functions in this file are used to process tweet articles.
 */

/*
 * Calculate the time diff from tweet posted time (parameter) to current time and
 * return a string of passed time in the format of :
 *    - hrs-mins-seconds in current day (today) or:
 *    - the number of passed days since posted the tweet.
 * This function is used to generate a human-readable time of the tweet article.
 */
const generatePastTime = function(milliSec) {

  let date = new Date(milliSec);

  // the adding 2000 ms as new article display by an animation of 2 seconds
  let dateDiffSecs = Math.floor((new Date() - milliSec) / 1000) + 2;
  let passDays = Math.floor((dateDiffSecs) / 60 / 60 / 24);

  let passSecs = Math.floor(dateDiffSecs % 60);
  let passMins = Math.floor((dateDiffSecs / 60) % 60);
  let passHrs = Math.floor((dateDiffSecs / 3600) % 24);
  
  let timeDiff = ((passHrs > 0) ? passHrs + "h " : '') +
                 ((passMins > 0) ? passMins + "m " : '') +
                 ((passSecs > 0) ? passSecs + "s " : '') +
                  'ago';

  // posted one day or more ago, show the number of days past
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

    date = 'Posted ' + timeDiff;   // show the past time today (in 24hrs)
  }

  return date;
};

/*
 * Create an tweet article containing data from the parameter 'article'
 * in page by adding HTML elements dynamically.
 */
const $creatTweetArticle = function(article) {
  
  // calculate the time diff from current to the posted time
  const postedTime = generatePastTime(article.created_at);

  // creat the article in the HTML DOM tree from the following template
  return  `
      <article class="article-container" id="article-container"> 
        <div class="article-header">
          <div class="header-left">
            <img class="author-avarta" src =${article["user"]["avatars"]}> 
            <span class="author-name">${article.user.name}</span>
          </div>
          <div><span class="handle-name">${article.user.handle}</span></div>
        </div>

        <!-- article content -->
        <textarea class="article-content" readonly>${article.content.text}</textarea>

        <!-- article footer -->
        <div class="article-footer">
          <span>${postedTime}</span>
          <span class="friend-action">
            <i class="fas fa-flag"></i>&nbsp;&nbsp;<i class="fas fa-retweet">&nbsp;&nbsp;</i><i class="fas fa-heart"></i>
          </span>
        </div>
      </article>
      `;
};

/*
 * Load all the history tweets/articles from server-db (passed by the parameter).
 */
const $getHistoryTweets = function(tweets) {
  
  if (Array.isArray(tweets)) {
    for (let i = 0; i < tweets.length; i++) {
      let $tweetArticle = $creatTweetArticle(tweets[i]);

      // Appending after the tweet-composer will display tweets descending by posted time
      // as tweets read from server database is in ascending order by posted time (old --> newer).
      $('#tweet-composer').after($tweetArticle);
    }
  }

};

/*
 * Load the latest(just posted) tweet article from db to page.
 */
const $getLatestTweet = function(tweets) {

  let $tweetArticle = $creatTweetArticle(tweets[tweets.length - 1]);  // at the tail of array
  $('#tweet-composer').after($tweetArticle).hide().slideToggle(2000);


};

/*
 * Request(Get) tweets articles from server-side and pass a callback function
 * to process the returned tweet articles (stored in an array).
 */
const $renderTweetArticles = function(callback) {

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

