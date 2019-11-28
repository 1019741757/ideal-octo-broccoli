/*
 *
 *   INSPINIA - Responsive Admin Theme
 *   version 2.0
 *
 */

$(document).ready(function () {
    // Collapse ibox function
    $('.collapse-link').click( function() {
        var ibox = $(this).closest('div.ibox');
        var button = $(this).find('i');
        var content = ibox.find('div.ibox-content');
        content.slideToggle(200);
        button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
        ibox.toggleClass('').toggleClass('border-bottom');
    });
});




// Local Storage functions
// Set proper body class and plugins based on user configuration
