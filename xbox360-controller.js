'use strict';

const Emitter = require('events').EventEmitter;
const util    = require('util');

const config  = require('./xbox360-controller-config.json');

const Button  = require('./components/button');
// const Trigger = require('./components/trigger');
// const Stick   = require('./components/stick');

function Xbox360Controller(device) {
  this.device = device;
  this.buttons = {};

  for(let button in config.input.buttons) {
    let mapping = config.input.buttons[button];
    this.buttons[button] = new Button(button, mapping, this);
  }

  this.device.on("data",  deviceInput.bind(this));
  this.device.on("error", deviceError.bind(this));
}

util.inherits(Xbox360Controller, Emitter);

function deviceInput(data) {
  // console.log(data);
  for(let button in this.buttons) {
    this.buttons[button].parseInput(data);
  }
}

function deviceError(error) {
  console.log('Error',error);
}

module.exports = Xbox360Controller;