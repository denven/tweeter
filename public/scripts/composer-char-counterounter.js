$(document).ready(() => {
    
  // --- our code goes here ---
  let counter = 0;
 
  $('textarea').on("keydown", function() {
    counter = $(this).val().length;
    $counter = $('.counter');
    
    if (counter > 140) {
      $counter.css("color", "red");
    } else {
      $counter.css("color", "black");
    }
    $counter.text(140 - counter);

  });

  /* hover feature */
  $('article').on("mouseover", function() {
    $('.at_name').show();
    $(this).css('box-shadow', '10px 10px 5px #888');
  });

  $('article').on("mouseout", function() {
    $('.at_name').hide();
    $(this).css('box-shadow', '');
  });
  
});