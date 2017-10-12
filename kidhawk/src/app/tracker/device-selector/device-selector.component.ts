import { Component, OnInit , Output, EventEmitter} from '@angular/core';

import { Device } from './device/Device';



@Component({
  selector: 'app-device-selector',
  templateUrl: './device-selector.component.html',
  styleUrls: ['./device-selector.component.css']
})
export class DeviceSelectorComponent implements OnInit {

  @Output() onTrackGo = new EventEmitter<Device[]>();
  @Output() onTrackCancel = new EventEmitter<null>();

  
  deviceList: Device[] = [
		new Device("1", {lat: 100, lon: 100}, ""), 
		new Device("2", {lat: 100, lon: 100}, "T"), 
		new Device("3", {lat: 100, lon: 100}, "G"), 
		new Device("4", {lat: 100, lon: 100}, ""), 
		new Device("5", {lat: 100, lon: 100}, "T"), 
		new Device("6", {lat: 100, lon: 100}, "G"),
		new Device("7", {lat: 100, lon: 100}, ""), 
		new Device("8", {lat: 100, lon: 100}, "T"), 
		new Device("9", {lat: 100, lon: 100}, "G"),
		new Device("10", {lat: 100, lon: 100}, ""), 
		new Device("11", {lat: 100, lon: 100}, "T"), 
		new Device("12", {lat: 100, lon: 100}, "G"),
		new Device("13", {lat: 100, lon: 100}, ""), 
		new Device("14", {lat: 100, lon: 100}, "T"), 
		new Device("15", {lat: 100, lon: 100}, "G")
		];
 
  _deviceList: Device[] = [
		new Device("1", {lat: 100, lon: 100}, ""), 
		new Device("2", {lat: 100, lon: 100}, "T"), 
		new Device("3", {lat: 100, lon: 100}, "G"), 
		new Device("4", {lat: 100, lon: 100}, ""), 
		new Device("5", {lat: 100, lon: 100}, "T"), 
		new Device("6", {lat: 100, lon: 100}, "G"),
		new Device("7", {lat: 100, lon: 100}, ""), 
		new Device("8", {lat: 100, lon: 100}, "T"), 
		new Device("9", {lat: 100, lon: 100}, "G"),
		new Device("10", {lat: 100, lon: 100}, ""), 
		new Device("11", {lat: 100, lon: 100}, "T"), 
		new Device("12", {lat: 100, lon: 100}, "G"),
		new Device("13", {lat: 100, lon: 100}, ""), 
		new Device("14", {lat: 100, lon: 100}, "T"), 
		new Device("15", {lat: 100, lon: 100}, "G")
		];



   deviceSelectedList: Device[] = [];


  constructor() { }

  ngOnInit() {
  }

  onDeviceSelected(dev, tagVal, index){

	console.log('onDevice Select');
	console.log(tagVal);

	dev.tag = tagVal;
	
	this.deviceSelectedList.push(dev);

       this.deviceList.splice(index,1);

  }


  removeDev(index){
   var dev = this.deviceSelectedList[index];
	this.deviceSelectedList.splice(index,1);

       this.deviceList.push(dev);
  }


  goTrack(){
	this.onTrackGo.emit(this.deviceSelectedList);
  }
  cancelTrack(){
       this.onTrackCancel.emit(null);

  }

}
