import React, {Component} from 'react';
import GoogleMap from 'google-map-react';
import Marker from 'google-maps-react';
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
  TimePicker,
  List
} from 'antd';
import moment from 'moment';
import CheckingValidParking from './ValidParking';

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
      username: "",
      visible: false,
      placement: 'bottom',
      visibleQR: false, // for qr code
      summaryVisible: false,
      value: null,
      open: false,
      transactions: [], // all the parking transactinos
      transactionIndex: 0, // index for transaction to prevent warning when doing mapping
  	};
    this.showDrawer = this.showDrawer.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  handleOpenChange = open => {
   this.setState({ open });
  };

  handleClose = () => this.setState({ open: false });

  onChange = time => {
    console.log(time);
    this.setState({ value: time });
  };

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
      position: {lat:40.872133, lng:-73.896822},
      map,
      title: 'Opened 12:12 pm',
      icon: parkingIMG,
      animation:window.google.maps.Animation.BOUNCE

    });

    let parking1 = new maps.Marker({
      position: {lat:40.869912, lng:-73.893915},
      map,
      title: 'Opened 12:10 pm',
      icon: parkingIMG,
      animation:window.google.maps.Animation.BOUNCE

    });

    let parking2 = new maps.Marker({
      position: {lat:40.871851, lng:-73.891480},
      map,
      title: 'Opened 12:20 pm',
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

  setTimeout(function(){ parking.setAnimation(null); }, 2000);
  setTimeout(function(){ parking1.setAnimation(null); }, 2000);
  setTimeout(function(){ parking2.setAnimation(null); }, 2000);
  setTimeout(function(){ user.setAnimation(null); }, 2000);
  }
  render() {
    console.log("first");
    const { handleSignOut, userSession } = this.props;
    const { person, username } = this.state;
    console.log(username);
    const { Search } = Input;
    return (
      !userSession.isSignInPending() ?
      this.isLocal() && !this.isLoading ?
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

             <GoogleMap
               defaultCenter={{lat: this.state.latitude, lng: this.state.longitude}}
               defaultZoom={16}
               onGoogleApiLoaded={({map, maps}) => this.renderMarkers(map, maps)}
               yesIWantToUseGoogleMapApiInternals
             >
             </GoogleMap>
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
          <TimePicker
            defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
            value={this.state.value}
            onChange={this.onChange}
            defaultValue={moment('00:00', format)}
            format={format} minuteStep={10}
            size="large"
            open={this.state.open}
            onOpenChange={this.handleOpenChange}
            addon={() => (
              <Button size="small" type="primary" onClick={this.handleClose}>
                Ok
              </Button>
            )}
          />
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
          height={320}
        >
          <List
            bordered
          >
            <List.Item><strong>Address:</strong>  </List.Item>
            <List.Item><strong>Duration:</strong> {this.state.summaryVisible ? moment(this.state.value._d).format("HH:mm") : ''} </List.Item>
            <List.Item><strong>Price:</strong> ${this.state.summaryVisible ? (((moment.duration(moment(this.state.value._d).format("HH:mm"))).asMinutes() / 10) * .5).toFixed(2) : ''}</List.Item>
          </List>
          <br />
          <button
            className="btn btn-primary btn-lg"
            id="signout-button"
            onClick={this.sendData}
          >
            Confirm Parking
          </button>
        </Drawer>
      </div> :
      <CheckingValidParking transactions={this.state.transactions}/>
      : null
    );
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
      userSession.getFile('transactions.json', options)
        .then((file) => {
          var transactions = JSON.parse(file || '[]')
          this.setState({
            person: new Person(userSession.loadUserData().profile),
            username: userSession.loadUserData().username,
            transactionIndex: transactions.length,
            transactions: transactions,
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
      userSession.getFile('transactions.json', options)
        .then((file) => {
          var transactions = JSON.parse(file || '[]')
          this.setState({
            transactionIndex: transactions.length,
            transactions: transactions
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

  // for sending the data
  sendData = (data) => {
    var currentdate = new Date();
    var datetime = (currentdate.getMonth()+1) + "/"
                + currentdate.getDate()  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
    const { userSession } = this.props
    let transactions = this.state.transactions

    let transaction = {
      id: this.state.transactionIndex++,
      created_at: datetime,
      duration: (((moment.duration(moment(this.state.value._d).format("HH:mm"))).asMinutes() / 10) * .5).toFixed(2),
      longitude: this.state.longitude,
      latitude: this.state.latitude,
      price: (((moment.duration(moment(this.state.value._d).format("HH:mm"))).asMinutes() / 10) * .5).toFixed(2)
      // TODO need modify this depend on the information that we want to store
    }
    console.log("herere");

    transactions.unshift(transaction)
    const options = { encrypt: false }
    userSession.putFile('transactions.json', JSON.stringify(transactions), options)
      .then(() => {
        this.setState({
          transactions: transactions,
          summaryVisible: false,
          visible: false
        })
      })
  }

}
