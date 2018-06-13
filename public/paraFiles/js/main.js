	

    jQuery(document).ready(function ($) {
        //initialise Stellar.js
        $(window).stellar();
        //Cache some variables
        var links = $('.navigation').find('li');
        slide = $('.slide');
        button = $('.button');
        mywindow = $(window);
        htmlbody = $('html,body');
        //Setup waypoints plugin
        slide.waypoint(function (event, direction) {
            //cache the variable of the data-slide attribute associated with each slide
            dataslide = $(this).attr('data-slide');
            //If the user scrolls up change the navigation link that has the same data-slide attribute as the slide to active and
            //remove the active class from the previous navigation link
            if (direction === 'down') {
                $('.navigation li[data-slide="' + dataslide + '"]').addClass('active').prev().removeClass('active');
            }
            // else If the user scrolls down change the navigation link that has the same data-slide attribute as the slide to active and
            //remove the active class from the next navigation link
            else {
                $('.navigation li[data-slide="' + dataslide + '"]').addClass('active').next().removeClass('active');
            }
        });
        //waypoints doesnt detect the first slide when user scrolls back up to the top so we add this little bit of code, that removes the class
        //from navigation link slide 2 and adds it to navigation link slide 1.
        mywindow.scroll(function () {
            if (mywindow.scrollTop() == 0) {
                $('.navigation li[data-slide="1"]').addClass('active');
                $('.navigation li[data-slide="2"]').removeClass('active');
            }
        });
        //Create a function that will be passed a slide number and then will scroll to that slide using jquerys animate. The Jquery
        //easing plugin is also used, so we passed in the easing method of 'easeInOutQuint' which is available throught the plugin.
        function goToByScroll(dataslide) {
            htmlbody.animate({
                scrollTop: $('.slide[data-slide="' + dataslide + '"]').offset().top
            }, 2000, 'easeInOutQuint');
        }
        //When the user clicks on the navigation links, get the data-slide attribute value of the link and pass that variable to the goToByScroll function
        links.click(function (e) {
            e.preventDefault();
            dataslide = $(this).attr('data-slide');
            goToByScroll(dataslide);
        });
        //When the user clicks on the button, get the get the data-slide attribute value of the button and pass that variable to the goToByScroll function
        button.click(function (e) {
            e.preventDefault();
            dataslide = $(this).attr('data-slide');
            goToByScroll(dataslide);
        });
    });

/*
    (function(){
    // Create a new tour
    var tour = new Tour();
     
    // Add your steps
    tour.addSteps([
      {
        element: ".tour-step.tour-step-one", // element selector to show the popover next to;
        placement: "bottom",
        title: "Welcome to the WebFTS tour!",
        content: "We're going to make this quick and useful."
      },
      {
        element: ".tour-step.tour-step-two",
        placement: "bottom",
        title: "Main navigation",
        content: "Boom, bang, bam!"
      },
      {
            element: ".tour-step.tour-step-three",
            placement: "top",
            backdrop: true,
            title: "Main section",
            content: "This is a section that you can read. It has valuable information."
      }
    ]);
     
    // Initialize method on the Tour class. Get's everything loaded up and ready to go.
    tour.init();
     
    // This starts the tour itself
    tour.start();

}());

*/
