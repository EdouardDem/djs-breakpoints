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
    djs.resize.delay(200);

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
        md: 900,
        lg: 1200
    });

    //----------------------------------------------
    // Add a callback
    djs.breakpoints
        .add('md', 'up', function () {
            displayLog('Passed through medium up.');
        }, 'stack-1')
        .add('md', 'down', function () {
            displayLog('Passed through medium down.');
        }, 'stack-1');
    // Add another callback
    djs.breakpoints
        .up('sm', function () {
            displayLog('Passed through small up.');
        }, 'stack-1')
        .down('sm', function () {
            djs.breakpoints.remove('lg', 'up', 'stack-1');
            displayLog('Passed through small down. Removed "lg down" callbacks.');
        });


    djs.breakpoints
        .add('lg', 'up', function () {
            displayLog('Passed through large up. This callback will be removed when passing "small down".');
        }, 'stack-1')


    //----------------------------------------------
    // Starts displayed tests
    displayLog(" ");

    //----------------------------------------------
    // Test states list
    displayLog('To medium, points are : ' + djs.breakpoints.to('md'));
    displayLog('From small, points are : ' + djs.breakpoints.from('sm'));

    //----------------------------------------------
    // Test state
    if (djs.breakpoints.max('sm')) {
        displayLog('Smaller than medium.');
    }
    if (djs.breakpoints.min('md')) {
        displayLog('Greater than medium.');
    }
    if (djs.breakpoints.is('sm, lg')) {
        displayLog('Is "small" or "large".');
    }

    //----------------------------------------------
    // Ends displayed tests
    displayLog(" ");

};
/**
 * Auto run test
 */
$(document).ready(function () {
    runTests();
});