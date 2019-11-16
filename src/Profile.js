import React, {Component} from 'react';
import GoogleMapReact from 'google-map-react';

import {
  Person,
} from 'blockstack';
import {
  Drawer,
  Button,
  Card,
  Row,
  Col,
  Input,
  TimePicker
} from 'antd';
import moment from 'moment';

const format = 'HH:mm';
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
      visible: false,
      placement: 'bottom',
      summaryVisible: false,
  	};
    this.showDrawer = this.showDrawer.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  showSummaryDrawer = () => {
    this.setState({
      summaryVisible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

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
    const { Search } = Input;
    return (
      !userSession.isSignInPending() ?
      <div className="panel-welcome" id="section-2">
        <div className="avatar-section">
          <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="img-rounded avatar" id="avatar-image" alt=""/>
        </div>
        <h1>Hello, <span id="heading-name">{ person.name() ? person.name() : 'Nameless Person' }</span>!</h1>
        <p className="lead">
          <button
            className="btn btn-primary btn-lg"
            id="signout-button"
            onClick={ handleSignOut.bind(this) }
          >
            Logout
          </button>
        </p>
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
        <Row>
          <Col span={24}>
            <Card title={`Hello, ${person.name() ? person.name() : 'Nameless Person'}`} bordered={false}>
              <Search
                size="large"
                placeholder="Enter Address"
                onSearch={value => console.log(value)}
              />
              <br />
              <br />
              <br />
              <button
                className="btn btn-primary btn-lg"
                id="signout-button"
                onClick={this.showDrawer}
              >
                Confirm Address
              </button>
            </Card>
          </Col>
        </Row>
        <Drawer
          title="Select Duration"
          placement={this.state.placement}
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <TimePicker defaultValue={moment('00:00', format)} format={format} minuteStep={10} size="large" />
          <br />
          <br />
          <br />
          <button
                className="btn btn-primary btn-lg"
                id="signout-button"
                onClick={this.showSummaryDrawer}
              >
                Next
              </button>
        </Drawer>
        <Drawer
          title="Summary"
          placement={this.state.placement}
          closable={false}
          onClose={this.onClose}
          visible={this.state.summaryVisible}
        >

          summaryDrawer
        </Drawer>
      </div> : null
    );
  }


}
