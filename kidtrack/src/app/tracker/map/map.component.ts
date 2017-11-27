import { Component, OnInit, OnDestroy} from '@angular/core';
import { UserService } from '../../services/user.service';
import { DeviceService } from '../../services/device.service';

declare var google: any;



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})


export class MapComponent implements OnInit {
  marker: any;
  map: any;
  timer: any;
  markers: any[] = [];
  infowindows: object[] = []
  watchingCount: number = 0;
  lonAv:number = 0;
  latAv:number = 0;
  minLat:number = 900;
  maxLat:number = -900;
  minLon:number = 900;
  maxLon:number = -900;
 

  constructor(private user: UserService, private deviceService: DeviceService) { 




  }

  ngOnInit() {      
	var self = this;

    this.map = new google.maps.Map(document.getElementById('map'), {
          zoom: 3,
          center: {lat: 40, lng: -50}
        });

   this.initializeMap().then(function(resp){
	console.log('Self. Timer');
	console.log(self.timer);

     if(!self.timer){
	

     

       self.timer = setInterval(()=>{

           self.gameloop();
  
         },10000);


      }


	setTimeout(()=>{

      		  self.zoomInOnAverage();

            },1000);

	

	self.initializeMarkers();


    },function(err){

		console.log('Err initializing map');
		console.log(err);

	});

  }



  initializeMap(){
	var self = this;

	return new Promise(function(resolve, reject){

		self.deviceService.getGpsData(self.user.devices, self.user.token).then(function(resp){
			console.log('Got GPS data.');
			console.log(resp);

				resolve();

		},function(err){
				console.log('Didnt get GPS data....');
			console.log(err);
			reject();

		});

	

	});

   }


  zoomInOnAverage() {

	this.latAv = 0;
	this.lonAv = 0;
	this.minLat = 900;
	this.maxLat = -900;
	this.minLon = 900;
	this.maxLon = -900;

	this.watchingCount = 0;
	for(var i=0; i< this.user.devices.length; i++){
		if(this.user.devices[i].watching && this.user.devices[i].gpsdata[0]){
			
			console.log(this.user.devices[i].tag);
			console.log(this.user.devices[i].gpsdata[0].location.lat);
			
			var loc = this.user.devices[i].gpsdata[0].location;

		         this.latAv = this.latAv + loc.lat;
		         this.lonAv = this.lonAv + loc.lng;

			if(loc.lat < this.minLat){

				this.minLat = loc.lat;
			}
			if(loc.lat >  this.maxLat){

				this.maxLat = loc.lat;
			}

			if(loc.lng < this.minLon){

				this.minLon = loc.lng;
			}

			if(loc.lat > this.maxLon){

				this.maxLon = loc.lng;
			}

			this.watchingCount = this.watchingCount + 1;
		}

	}

         var viewPortDiff = (this.maxLon - this.minLon) >  (this.maxLat - this.minLat) ? (this.maxLon - this.minLon) : (this.maxLat - this.minLat);

	console.log('View Port Dif');
	console.log(viewPortDiff);


      this.latAv = this.latAv/this.watchingCount;
      this.lonAv = this.lonAv/this.watchingCount;
	

	this.map.setCenter({lat: this.latAv, lng: this.lonAv});
	
	var newZoom = 2;

	switch(true) {

		case (viewPortDiff > 100):{
			var newZoom = 3;
		     break;
		}
		case (viewPortDiff < 100 && viewPortDiff >= 50):{
			var newZoom = 5;
		     break;
		}
		case (viewPortDiff < 49 && viewPortDiff >= 20):{
			var newZoom = 7;
		     break;
		}
		case (viewPortDiff < 19 && viewPortDiff >= 10):{
			var newZoom = 11;
		     break;
		}
		case (viewPortDiff < 9 && viewPortDiff >= 4):{
			var newZoom = 13;
		     break;
		}
		default:{
		    var newZoom = 15;
		  break;
		}
	}
		console.log('New Zoom');
		console.log(newZoom);

	 this.map.setZoom(newZoom);

  }

   initializeMarkers(){

   	var self = this;

	console.log('Draw Markers..');
	console.log(this);

	for( var i=0; i<this.user.devices.length; i++){
	 if(this.user.devices[i].watching && this.user.devices[i].gpsdata[0]){
	
	if(this.user.devices[0].tag !== null && this.user.devices[0].tag !== undefined  && this.user.devices[0].tag !== ''){
	  var deviceTag = '<p style="text-align:center;"><b>' + this.user.devices[i].tag + '</b></p>';
	
	   deviceTag += '<p>' + this.user.devices[i].gpsdata[0].timestamp + '</p>';
	   var infowindow = new google.maps.InfoWindow({content: deviceTag});


	}
 	
	var iconImg = "assets/kidtrackmapicon.png";
	
	if(this.user.devices[i].alarm){
		iconImg = "assets/kidtrackmapiconAlarm.png";
		deviceTag += '<p style="color:red;">Alarm has been triggered!</p>';

		infowindow.setContent(deviceTag);
	}

        var marker = new google.maps.Marker({
          position: this.user.devices[i].gpsdata[0].location,
          icon: iconImg,
          map: this.map,
	  draggable: false,
          animation: google.maps.Animation.DROP,
	  title: this.user.devices[i].tag
        });


 	 marker.addListener('click', function(){
 	 	// This here is each device associated with this marker.. from the function binding..
  		 if (marker.getAnimation() !== null) {
     		     marker.setAnimation(null);
   		 } else {
   		     marker.setAnimation(google.maps.Animation.BOUNCE);
		      setTimeout(function(){
				 marker.setAnimation(null);
			},2000);
    		 }

		if(this.tag !== null && this.tag !== undefined  && this.tag !== ''){
	
		  infowindow.open(self.map, marker);

		 }
            }.bind(this.user.devices[i]));

	 var lineCoordinates = [];

	for(var j = 0; j < this.user.devices[i].gpsdata.length; j++){

		lineCoordinates.push(this.user.devices[i].gpsdata[j].location);
	}

      
        var flightPath = new google.maps.Polyline({
          path: lineCoordinates,
          geodesic: true,
          strokeColor: '#00954a',
          strokeOpacity: 0.5,
          strokeWeight: 3
        });

        flightPath.setMap(this.map);

	    this.markers.push({deviceId: this.user.devices[i].id, alarm: this.user.devices[i].alarm, marker: marker, infowindow: infowindow, flightPath: flightPath});


	  } //Is watching..

	}//draw loop
 
   }
  




  gameloop(){
	console.log('GAME LOOP');
	var self = this;
	var watchingArray = [];
	for(var j=0; j<this.user.devices.length; j++){

		if(this.user.devices[j].watching){
			watchingArray.push(this.user.devices[j]);
		}
	}
	this.deviceService.getGpsData(watchingArray, self.user.token).then(function(resp){
			console.log('Got GPS data.');
			console.log(resp);
        	
		for(var k=0; k<self.user.devices.length; k++){
		 if(self.user.devices[k].watching){

		  for(var i=0; i<self.markers.length; i++){
			  console.log('Markers id');
			 console.log(self.markers[i].deviceId);
			  console.log('self.user.devices[k].id');
		         console.log(self.user.devices[k].id);
			    if(self.markers[i].deviceId === self.user.devices[k].id){

				self.markers[i].marker.setPosition(self.user.devices[k].gpsdata[0].location);
				

			       var deviceTag = '<p style="text-align:center;"><b>' + self.user.devices[k].tag + '</b></p>';
	
	   		        deviceTag += '<p>' + self.user.devices[k].gpsdata[0].timestamp + '</p>';

				self.markers[i].infowindow.setContent(deviceTag);
				
					if(self.user.devices[k].alarm){
						self.markers[i].alarm = true;
						var iconImg = "assets/kidtrackmapiconAlarm.png";
						self.markers[i].marker.setIcon(iconImg);
						deviceTag = '<p style="text-align:center; color:red;"><b>' + self.user.devices[k].tag + '</b></p>';
	
	   		                        deviceTag += '<p  style="color:red;">' + self.user.devices[k].gpsdata[0].timestamp + '</p>';

						deviceTag += '<p style="color:red;">Alarm has been triggered!</p>';
			
						self.markers[i].infowindow.setContent(deviceTag);
					}else{
						self.markers[i].alarm = false;
						iconImg = "assets/kidtrackmapicon.png";

						self.markers[i].marker.setIcon(iconImg);

					}

				 var lineCoordinates = [];

				for(var j = 0; j < self.user.devices[k].gpsdata.length; j++){

				   lineCoordinates.push(self.user.devices[k].gpsdata[j].location);
				}

      
        			self.markers[i].flightPath.setPath(lineCoordinates);

			     }

      		   }
		 }
		}
				

		},function(err){
				console.log('Didnt get GPS data....');
			console.log(err);

		});





  }

  clearMarkers() {
        for (var i = 0; i < this.markers.length; i++) {
          this.markers[i].setMap(null);
        }
        this.markers = [];
   }

   clearAlarm(m){
	console.log('Clear Alarm')
	console.log(m);
	m.alarm = false;
	this.deviceService.clearAlarm(m.deviceId, this.user.token);

    }

  ngOnDestroy(){
	console.log('ON DESTROY MAP BABY');

    clearInterval(this.timer);

  }

}
