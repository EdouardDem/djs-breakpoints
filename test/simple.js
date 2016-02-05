/**
 * Log function
 *
 * @param function
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
	// Init object
	djs.resize.init();

	//----------------------------------------------
	// Set delay
	djs.resize.delay(500);

	//----------------------------------------------
	// Add callback to the main stack
	djs.resize.stack().add('cb-m-3', function() {
		displayLog('Callback Main 3');
	});
	// Add callback to the main stack using bind
	djs.resize.bind('cb-m-1', function() {
		displayLog('Callback Main 1');
	});
	djs.resize.bind('cb-m-2', function() {
		displayLog('Callback Main 2');
	});

	// Add callback to the core stack
	djs.resize.stack(djs.resize.stacks.core).add('cb-c-1', function() {
		displayLog('Callback Core 1');
	});
	// Add callback to the core stack using bind
	djs.resize.bind('cb-c-2', function() {
		displayLog('Callback Core 2');
	}, djs.resize.stacks.core);

	// Add callback to the last stack
	djs.resize.stack(djs.resize.stacks.last).add('cb-l', function() {
		displayLog('Callback Last');
	});

	// Set the order of the main stack
	djs.resize.stack().order = ['cb-m-1', 'cb-m-2', 'cb-m-3'];


	//----------------------------------------------
	// Before
	djs.resize.bind('before', function() {
		clearLog();
		displayLog('Resizing...');
	}, djs.resize.stacks.before);
	// After
	djs.resize.bind('before', function() {
		displayLog('Resize done. Calling stacks.');
	}, djs.resize.stacks.after);


};
/**
 * Auto ruun test
 */
$(document).ready(function () {
	runTests();
});