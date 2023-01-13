$( document ).ready(function() {
    // alert("hello");
    $('.mobile-menu-icon').click(function(event) {
        event.preventDefault();
        $(".sidebar").show();
    });
    $('.mobile-menu-close-icon').click(function(event) {
        event.preventDefault();
        $(".sidebar").hide();
    });
    $('.dropdown').click(function(event) {
        event.preventDefault();
        $(this).siblings("ul").toggle();
    });
    $(".has-dropdown ul").css('display','none');
   
});