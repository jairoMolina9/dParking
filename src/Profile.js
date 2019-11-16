import React, {Component} from 'react';
import GoogleMap from 'google-map-react';
import Marker from 'google-maps-react';

import './Marker2.css';

import {
  Person,
} from 'blockstack';

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';
const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default class Profile extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
      latitude: null,
      longitude: null,

  	  person: {
  	  	name() {
          return 'Anonymous';
        },
  	  	avatarUrl() {
  	  	  return avatarFallbackImage;
  	  	},
  	  },
  	};
  }

componentWillMount() {
  const { userSession } = this.props;
  this.setState({
    person: new Person(userSession.loadUserData().profile),
  });

    navigator.geolocation.getCurrentPosition(
      position => {
        var crd = position.coords;

        this.setState({
          latitude: crd.latitude,
          longitude: crd.longitude
        });

        console.log(this.state.latitude, this.state.longitude)
      },
      error => console.warn(`ERROR(${error.code}): ${error.message}`),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
}

renderMarkers(map, maps){
  var parkingIMG = {
    url: "parking.png", // url
    scaledSize: new window.google.maps.Size(30, 30), // scaled size
    origin: new window.google.maps.Point(0,0), // origin
    anchor: new window.google.maps.Point(0, 0) // anchor
  };

  var carIMG = {
    url: "rsz_car1.png", // url
    scaledSize: new window.google.maps.Size(60, 60), // scaled size
    origin: new window.google.maps.Point(0,0), // origin
    anchor: new window.google.maps.Point(0, 0) // anchor
  };
  let parking = new maps.Marker({
    position: {lat:40.871851, lng:-73.891480},
    map,
    title: 'Parking location',
    icon: parkingIMG,
    animation:window.google.maps.Animation.BOUNCE

  });

  let user = new maps.Marker({
    position: {lat:this.state.latitude, lng:this.state.longitude},
    map,
    title: 'Car location',
    icon: carIMG,
    animation: window.google.maps.Animation.BOUNCE,


});

setTimeout(function(){ parking.setAnimation(null); }, 1200);
setTimeout(function(){ user.setAnimation(null); }, 1200);
}

  render() {
    const { handleSignOut, userSession } = this.props;
    const { person } = this.state;


    return (
      <div style={{ height: '100vh', width: '100%' }}>

      <GoogleMap
        defaultCenter={{lat: this.state.latitude, lng: this.state.longitude}}
        defaultZoom={16}
        onGoogleApiLoaded={({map, maps}) => this.renderMarkers(map, maps)}
        yesIWantToUseGoogleMapApiInternals
      >
      </GoogleMap>
    </div>

    );
  }


}
