'use strict';

const HID = require('node-hid');
const Emitter = require('events').EventEmitter;
const Xbox360Controller = require('./xbox360-controller');

const VENDOR_ID  = 1118;
const PRODUCT_ID = 654;

const ee = new Emitter();

var controllers = [];

function addController(device) {
  let controller = new Xbox360Controller(device);
  ee.emit('controller',controller);
  controllers.push(controller);
}

function detectControllers() {
  while(true) {
    try {
      var device = new HID.HID(VENDOR_ID, PRODUCT_ID);
      addController(device);
    }
    catch(e) {
      return;
    }
  }
}

setInterval(detectControllers,1000);

module.exports = {
  controllers: controllers,
  on: ee.on.bind(ee)
};
