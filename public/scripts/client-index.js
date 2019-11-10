/*
 * All the Tweet App's functoinalities and features are loaded here.
 * Functions written in other .js file should be imported before this file.
 */

$(document).ready(() => {

  // Hide tweet-composer board is hide when page loads
  $("#tweet-composer").hide();

  // Register events for specific page features
  $articleHoverShadow();
  $toggleTweetComposer();
  $checkScrollButton();
  $resposeSmallDevice();
  
  // Load history tweets from server
  $renderTweetArticles($getHistoryTweets);

  // Check and validate new tweet post
  $calcUserInputChars();
  $validateNewTweet();

});