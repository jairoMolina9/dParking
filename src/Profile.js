import React, {Component} from 'react';
import GoogleMapReact from 'google-map-react';

import {
  Person,
} from 'blockstack';
import QR from './Qrcode';
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
  	  person: {
  	  	name() {
          return 'Anonymous';
        },
  	  	avatarUrl() {
  	  	  return avatarFallbackImage;
  	  	},
      },
      username: "",
      visible: false,
      placement: 'bottom'
  	};
    this.showDrawer = this.showDrawer.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  showDrawer = () => {
    this.setState({
      visible: true,
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

  render() {
    const { handleSignOut, userSession } = this.props;
    const { person, username } = this.state;
    console.log(username);
    const { Search } = Input;
    return (
      !userSession.isSignInPending() ?
      <div className="panel-welcome" id="section-2">
        <div className="avatar-section">
          <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="img-rounded avatar" id="avatar-image" alt=""/>
        </div>
        <QR userId={username} />
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
            defaultCenter={this.props.center}
            defaultZoom={this.props.zoom}
          >
            <AnyReactComponent
              lat={59.955413}
              lng={30.337844}
              text="userprofilename"
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
        </Drawer>
      </div> : null
    );
  }

  componentWillMount() {
    const { userSession } = this.props;
    this.setState({
      person: new Person(userSession.loadUserData().profile),
      username: userSession.loadUserData().username
    });
  }
}
