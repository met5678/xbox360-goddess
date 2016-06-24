'use strict';

const ipc   = require('ipc-goddess');
const nconf = require('nconf');
nconf.argv().env();

const manager = require('./manager');

const ipcConfig = {
  id: 'xbox360-goddess',
  debug: 'true',
  outputs: ['control']
};
ipc.initSocket(ipcConfig);

const mappingFile = nconf.get('MAPPING');
const mappingConfig = require(`./mappings/${mappingFile}.json`);

var toggles = {};

manager.on('controller', function(controller) {
  for(let button in mappingConfig.buttons) {
    let mapping = mappingConfig.buttons[button];
    if(mapping.type == 'tap') {
      controller.on(`${button}:pressed`,
        () => ipc.emit('control', mapping.packet));
    }
    if(mapping.type == 'hold') {
      controller.on(`${button}:pressed`,
        () => ipc.emit('control', mapping.onPacket));
      controller.on(`${button}:released`,
        () => ipc.emit('control', mapping.offPacket));
    }
    if(mapping.type == 'toggle') {
      if(!toggles[button]) {
        toggles[button] = false;
      }
      controller.on(`${button}:pressed`,
        () => {
          toggles[button] = !toggles[button];
          if(toggles[button]) {
            ipc.emit('control', mapping.onPacket);
          }
          else {
            ipc.emit('control', mapping.offPacket);
          }
        });
    }
  }
});

