/*
 * Functions defined in this file are used to process posting a new tweet, including
 * user input check and validation, tweet composer page display (counter), submit a
 * validated post etc.
 **/

/* HTML template used to display error msg when user input validation fails */
const HTML_MSG_INPUT_NULL = `
            <span class="error-msg">
              <i class="fas fa-exclamation-triangle">
              </i>This field is required.
              <i class="fas fa-exclamation-triangle"></i>
            </span>
            `;

/* HTML template used to display error msg when user input validation fails */
const HTML_MSG_INPUT_EXCEED = `
            <span class="error-msg">
              <i class="fas fa-exclamation-triangle">
              </i>Too long, please make it in 140 characters.
              <i class="fas fa-exclamation-triangle"></i>
            </span>
            `;

const MAX_CHARS_ALLOWED = 140;   /* tweet composer max allowed input chars */

/**
 * Check user input characters in the textarea element.
 */
const $calcUserInputChars = function() {

  $('#tweet-input').on("keydown", function() {
    
    const charsNum = $(this).val().length;   // get input chars number
    $counter = $('#chars-counter');
    
    if (charsNum > MAX_CHARS_ALLOWED) {
      $counter.css("color", "red");         // change style to warn user
    } else {
      $counter.css("color", "black");
    }

    // display the left number of chars allowed user to input
    $counter.text(MAX_CHARS_ALLOWED - charsNum);

  });
  
};

/*
 * Reset input textarea and the counter's number.
 */
const $resetTweetComposer = function() {

  $('#tweet-input').val('');
  $('#chars-counter').text(MAX_CHARS_ALLOWED);

};

/*
 * post a new tweet to server-side by ajax
 */
const $submitNewTweet = function() {

  $.ajax({
    url: '/tweets/',
    type: "POST",
    data: $('form').serialize(),

    //if sucess, get the new posted tweet from server
    success: function() {
      $renderTweetArticles($getLatestTweet);
      $resetTweetComposer();
    }
  });

};


/**
 * User input validation when submit: validate the tweet content length.
 */
const $validateNewTweet = function() {

  $('#tweet-form').submit(function(event) {

    event.preventDefault();
    let inputLen = $('textarea').val().length;
      
    // remove the hidden <span> as it will be created once display the error message
    $(".error-msg").remove();
  
    // when validation fails, (no input or input string length > 140), error message will
    // be shown in a created span. The new created <span> is put above the input <textarea>.
    if (inputLen < 1) {
      $('#tweet-input').before(HTML_MSG_INPUT_NULL);
      $(".error-msg").slideToggle(3000);  // display 3s then hide
      $('#tweet-input').focus();          // set focus to let user input again
      return;
    }
      
    if (inputLen > MAX_CHARS_ALLOWED) {
      $('#tweet-input').before(HTML_MSG_INPUT_EXCEED);
      $(".error-msg").slideToggle(3000);
      $('#tweet-input').focus();          // set focus to let user input again
      return;
    }
      
    $submitNewTweet();        // validated user input wil be submitted
    return;
  });

};
