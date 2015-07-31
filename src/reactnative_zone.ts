import ReactNativePatch from "./reactnative_zone_patch"

var core = require('zone.js/lib/core.js');

var zone = global.zone = new core.Zone()

// ReactNativePatch.apply();