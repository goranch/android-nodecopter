// License information is available from LICENSE file

// this is the file works under jxcore
var fs = require('fs');
var path = require('path');

console.log("Hello To LogCat!", fs.readdirSync('jxcore/node_modules'));

var df = require('dateformat')
  , autonomy = require('ardrone-autonomy')
  , arDrone = require('ar-drone')
  , arDroneConstants = require('ar-drone/lib/constants')
  , mission  = autonomy.createMission()
  ;

// requiring a node module
var jsnice = require('json-nice');

// test jxm
var jxm = require('jxm');

if (jxm) {
  console.log('jxm test passed');
}

var obj = {
  a: 1,
  b: 2
};

console.log("from node module:", jsnice(obj));

function navdata_option_mask(c) {
  return 1 << c;
}

// From the SDK.
var navdata_options = (
    navdata_option_mask(arDroneConstants.options.DEMO)
  | navdata_option_mask(arDroneConstants.options.VISION_DETECT)
  | navdata_option_mask(arDroneConstants.options.MAGNETO)
  | navdata_option_mask(arDroneConstants.options.WIFI)
);

// Land on ctrl-c
var exiting = false;
process.on('SIGINT', function() {
    if (exiting) {
    console.log('exiting?');
        process.exit(0);
    } else {
        console.log('Got SIGINT. Landing, press Control-C again to force exit.');
        exiting = true;
        mission.control().disable();
        mission.client().land(function() {
            process.exit(0);
        });
    }
});

// Connect and configure the drone
mission.client().config('general:navdata_demo', true);
mission.client().config('general:navdata_options', navdata_options);
mission.client().config('video:video_channel', 1);
mission.client().config('detect:detect_type', 12);

// Log mission for debugging purposes
//mission.log("mission-" + df(new Date(), "yyyy-mm-dd_hh-MM-ss") + ".txt");

// Plan mission
mission.takeoff()
       .zero()
       .hover(500)
       .altitude(1.2)
       .forward(1.5)
       .right(1)
       .backward(1.5)
       .left(1)
       .go({x:0, y:0})
//       .hover(500)
       .land();

// Execute mission
mission.run(function (err, result) {
    if (err) {
        console.trace("Oops, something bad happened: %s", err.message);
        mission.client().stop();
        mission.client().land();
    } else {
        console.log("We are done!");
        process.exit(0);
    }
});

//
//exports.concat = function(a, b, cb) {
//  jxcore.tasks.addTask(function(){
//    var start = process.hrtime();
//    var q = 0;
//    for (var i=0; i<1e5; i++) {
//      q += i%2;
//      q %= 100;
//    }
//    return process.hrtime(start)[1] / 1000000;
//  }, null, function(res) {
//    cb(res);
//  });
//};