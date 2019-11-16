import React, {Component} from 'react';
import GoogleMapReact from 'google-map-react';

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
  render() {
    console.log("first");
    const { handleSignOut, userSession } = this.props;
    const { person } = this.state;
    return (
      <div style={{ height: '100vh', width: '100%' }}>

      <GoogleMapReact
        bootstrapURLKeys={{ key: 'AIzaSyCpj8L3lbWNzrkw4-1csPoc26g1wnoP_4A' }}
        defaultCenter={{lat: this.state.latitude, lng: this.state.longitude}}
        defaultZoom={16}
      >
        <AnyReactComponent
          lat={this.state.latitude}
          lng={this.state.longitude}
          text="markpoint"
        />
      </GoogleMapReact>
    </div>
    );
  }


}
