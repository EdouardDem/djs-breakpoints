/**
 * Log function
 *
 * @param {String} text
 */
displayLog = function (text) {
    $('.results').append('<div>' + text + '</div>');
    console.log(text);
};
/**
 * Clear log
 */
clearLog = function () {
    $('.results').html('');
    console.clear();
};
/**
 * Run the tests
 */
runTests = function () {

    //----------------------------------------------
    // Init resize object
    djs.resize.init();

    //----------------------------------------------
    // Size tracker
    djs.resize.bind('size-tracker', function () {
        $('.size').html("Size: " + $(window).width() + " px");
    });
    djs.resize.refresh();


    //----------------------------------------------
    // Init object
    djs.breakpoints.init({
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1240
    });

    //----------------------------------------------
    // Add a callback
    djs.breakpoints
        .add('md', 'up', function () {
            displayLog('Passed through medium up.');
        }, 'md-up-1')
        .add('md', 'down', function () {
            displayLog('Passed through medium down.');
        }, 'md-up-1');


    //----------------------------------------------
    // Test state
    if (djs.breakpoints.is(djs.breakpoints.to('sm'))) {
        displayLog('Smaller than medium.');
    }
    if (djs.breakpoints.is(djs.breakpoints.from('md'))) {
        displayLog('Greater than medium.');
    }

};
/**
 * Auto run test
 */
$(document).ready(function () {
    runTests();
});