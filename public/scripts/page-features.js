/*
 * These functions provide some page features by using jQuery to
 * process related events on some selected the elements.
 */

/*
 * Generate border shadow when cursor hovers a tweet article
 */
const $articleHoverShadow = function() {
  
  $('main').on("mouseover", 'article', function() {
    $(this).find('.handle-name').show();
    $(this).css('box-shadow', '10px 10px 3px #888');
  });

  $('main').on("mouseout", 'article', function() {
    $(this).find('.handle-name').hide();
    $(this).css('box-shadow', '');
  });
};

/*
 * Toggle the tweet composer panel when user clicks the top-right "write new tweet" button.
 */
const $toggleTweetComposer = function() {

  $('#new-tweet-btn').on('click', function(event) {

    event.preventDefault();

    // scroll page to top as the composer is in the top-half of page
    $(document).scrollTop(0);

    $("#tweet-composer").slideToggle();   // show or hide
    $('#tweet-input').focus();            // autoset focus

  });

};


/*
 * Response user-click event on scroll button whose visibility is
 * decided by the vertical scroll bar of current page in browser.
 */
const $checkScrollButton = function() {

  $("#scroll-button").hide();     // hide when page loads

  $(document).scroll(function(event) {

    event.preventDefault();

    let top = $(window).scrollTop();  // get scroll bar top postion

    // show button only when it's top is below the App title
    if (top > 120) {
      $("#scroll-button").show();
    } else {
      $("#scroll-button").hide();
    }

  });

  // let page go top when user clicked this button
  $("#scroll-button").on('click', function(event) {
    event.preventDefault();
    $(document).scrollTop(0);
  });

};

/*
 * Check window size and decide when to hide the header(user profile).
 * If the device height is too small we'd better hide user-profile (takes 400px)
 * to provide more friendly UX.
 */
const $resposeSmallDevice = function() {

  $(window).resize(function() {

    const $winHeight = $(window).height();
    console.log($winHeight);
    console.log($('#user-profile').css('display'));
    if ($winHeight < 500) {
      $('#user-profile').hide();
    } else {
      $('#user-profile').show();
    }
  });

};