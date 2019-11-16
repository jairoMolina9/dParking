import React, {Component} from 'react';
import GoogleMapReact from 'google-map-react';

import {
  Person,
  lookupProfile
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
      placement: 'bottom',
      visibleQR: false, // for qr code
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
  // begin of QRcode
  // for showing QR code
  showQR = () => {
    this.setState({
      visibleQR: true,
    });
  };
  // close the QRcode
  handleOkQR = e => {
    console.log(e);
    this.setState({
      visibleQR: false,
    });
  };
  // close the QR code
  handleCancelQR = e => {
    console.log(e);
    this.setState({
      visibleQR: false,
    });
  };
  // end of QRcode

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
        
        <h1>Hello, <span id="heading-name">{ person.name() ? person.name() : 'Nameless Person' }</span>!</h1>
        <p className="lead">
          <button
            className="btn btn-primary btn-lg"
            id="signout-button"
            onClick={ handleSignOut.bind(this) }
          >
            Logout
            
          </button>
          <QR 
              userId={username}
              visibleQR={this.state.visibleQR}
              showModal={this.showQR}
              handleOkQR={this.handleOkQR}
              handleCancelQR={this.handleCancelQR} 
            />
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
  componentDidMount() {
    this.fetchData()
  }
  // for fetching data
  fetchData() {
    const { userSession } = this.props
    this.setState({ isLoading: true })
    if (this.isLocal()) {
      const options = { decrypt: false }
      userSession.getFile('statuses.json', options)
        .then((file) => {
          var statuses = JSON.parse(file || '[]')
          this.setState({
            person: new Person(userSession.loadUserData().profile),
            username: userSession.loadUserData().username,
            statusIndex: statuses.length,
            statuses: statuses,
          })
        })
        .finally(() => {
          this.setState({ isLoading: false })
        })
    } else {
      const username = this.props.match.params.username

      lookupProfile(username)
        .then((profile) => {
          this.setState({
            person: new Person(profile),
            username: username
          })
        })
        .catch((error) => {
          console.log('could not resolve profile')
        })
      const options = { username: username, decrypt: false }
      userSession.getFile('statuses.json', options)
        .then((file) => {
          var statuses = JSON.parse(file || '[]')
          this.setState({
            statusIndex: statuses.length,
            statuses: statuses
          })
        })
        .catch((error) => {
          console.log('could not fetch statuses')
        })
        .finally(() => {
          this.setState({ isLoading: false })
        })
    }

  }
  // for verifying if this is "checking valid parking page"?
  isLocal() {
    return this.props.match.params.username ? false : true
  }
}
