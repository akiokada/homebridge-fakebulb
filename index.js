var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-fakebulb", "FakeBulb", FakeBulbAccessory);
}

function FakeBulbAccessory(log, config) {
  this.log = log;
  this.name = config["name"];
  this.bulbName = config["bulb_name"] || this.name; // fallback to "name" if you didn't specify an exact "bulb_name"
  this.binaryState = 0; // bulb state, default is OFF
  this.intensity = 100;
  this.log("Starting a fake bulb device with name '" + this.bulbName + "'...");
//  this.search();
}

FakeBulbAccessory.prototype.getPowerOn = function(callback) {
  var powerOn = this.binaryState > 0;
  this.log("Power state for the '%s' is %s", this.bulbName, this.binaryState);
  callback(null, powerOn);
}

FakeBulbAccessory.prototype.setPowerOn = function(powerOn, callback) {
  this.binaryState = powerOn ? 1 : 0; // wemo langauge
  this.log("Set power state on the '%s' to %s", this.bulbName, this.binaryState);
  callback(null);
}

FakeBulbAccessory.prototype.getBrightness = function(callback) {
  var Brightness = this.intensity;
  this.log("Brightness for the '%s' is %s", this.bulbName, this.Brightness);
  callback(null, Brightness);
}

FakeBulbAccessory.prototype.setBrightness = function(Brightness, callback) {
  this.intensity = Brightness;
  this.log("Set brightness on the '%s' to %s", this.bulbName, this.Brightness);
  callback(null);
}

FakeBulbAccessory.prototype.getServices = function() {
    var lightbulbService = new Service.Lightbulb(this.name);
    
    lightbulbService
      .getCharacteristic(Characteristic.On)
      .on('get', this.getPowerOn.bind(this))
      .on('set', this.setPowerOn.bind(this));
	lightbulbService
	.getCharacteristic(Characteristic.Brightness)
    .setProps({
      minValue: 0,
      maxValue: 100,
      minStep: 25,
    })
    .on('get', this.getBrightness.bind(this))
    .on('set', this.setBrightness.bind(this));
    
    return [lightbulbService];
}
