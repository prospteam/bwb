import React from 'react';
import { View, } from 'react-native';
import { Button, Text, Input, Form, Item, Label, DatePicker } from 'native-base';
import MapInput from './MapInput';
import MyMapView from './MyMapView';
import { getLocation } from './getLocation';
import {Actions} from 'react-native-router-flux';
import DateTimePicker from "react-native-modal-datetime-picker";
import BottomDrawer from 'rn-bottom-drawer';

const TAB_BAR_HEIGHT = 80;

class MapContainer extends React.Component {
  state = {
    isDateTimePickerVisible: false,
    region: {
      latitude: 43.7984299,
      longitude: -84.7310113,
      latitudeDelta: 3,
      longitudeDelta: 3,
    },
  };

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     isDateTimePickerVisible: false
  //   };
  // }

  componentDidMount() {
    // this.updateState({
    //   latitude: 123.9,
    //   longitude: 10.2833,
    // });
    this.getInitialState();
  }

  getInitialState() {
    getLocation().then(data => {
      this.updateState({
        latitude: data.latitude,
        longitude: data.longitude,
      });
      this.updateSelectedLatLong({
        latitude: data.latitude,
        longitude: data.longitude,
      });
    })
    .catch(err => {
      console.log('Error:'+err.message);
    });
  }

  updateState(location) {
      let latDelta = (location.latitudeDelta) ? location.latitudeDelta:0.003;
      let longDelta = (location.longitudeDelta) ? location.longitudeDelta:0.003;
      this.setState({
        region: {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: latDelta,
          longitudeDelta: longDelta,
        },
      });
  }

  updateSelectedLatLong(location) {
    this.setState({
      selectedLatLong:{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      }
    });
  }

  getCoordsFromName(loc,inputField, inputText) {
    this.updateState({
      latitude: loc.lat,
      longitude: loc.lng,
    });
    this.updateSelectedLatLong({
      latitude: loc.lat,
      longitude: loc.lng,
    });

    if (inputField==='from') {
      this.setState({
        form_from_text:inputText,
        form_from:'from',
        form_from_latlong:{
          latitude: loc.lat,
          longitude: loc.lng,
        },
      });
    }else{
      this.setState({
        form_to_text:inputText,
        form_to:'to',
        form_to_latlong:{
          latitude: loc.lat,
          longitude: loc.lng,
        },
      });
    }
  }

  onMapRegionChange(region) {
    this.setState({ region });
    // console.log(region);
    // console.log('got');
  }

  getDataFromMap(params) {
    // this.setState({ region });
    // console.log('From Map');
    // console.log(params);
      this.setState({
        distance:params.distance,
        duration:params.duration,
        height:500
      });
      // console.log(this.state);
  }

  bookNow(e){
    const { state } = this;

    // Base fare $2.75 to start $2.25 a mile during regular hours, peek hours and high volume Horus it goes to $3.50 Pick up $3.00 a mile. Traffic congestion rate is $1.00  a minute
    let baseFare = 2.75;
    let baseFarePeekHours = 3.50;

    let payByDistance = baseFare*(state.distance+1);

    const formData = {
      chosenDate:state.chosenDate.toString().substr(4, 12),
      chosenTime:state.chosenTime.toString().substr(15, 24),
      distance:state.distance,
      duration:state.duration,
      form_from_latlong:state.form_from_latlong,
      form_from_text:state.form_from_text,
      form_to_latlong:state.form_to_latlong,
      form_to_text:state.form_to_text,
      payByDistance:payByDistance,
    };

    // Actions.payment();
    this.props.navigate('Payment',{params:formData});
    // this.props.navigate('Payment');
    // console.log('Booknow');
    // console.log(formData);
    // console.log('state');
    // console.log(state);
    // console.log(state.form_from_latlong);
    // console.log(state.form_from_latlong);
  }

  setDate(newDate) {
    // console.log('setting');
    this.setState({ chosenDate: newDate });
    // console.log(this.state);
    // console.log(newDate);
    //   console.log('settted');
  }

  // how to handle the cases where time is one digit
  makeTwoDigits (time) {
    const timeString = `${time}`;
    if (timeString.length === 2) return time;
    return `0${time}`;
  }

  handleDatePicked = date => {
    // console.log("A date has been picked: ", date);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    this.setState({ chosenTime: `${hours}:${minutes}` });
    // console.log(`${hours}:${minutes}:${seconds}`);
    // console.log('GOT time');
    this.hideDateTimePicker();
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  render() {
    // console.log('props');
    // console.log(this.props);
    // console.log('MapContainer Rendered');
    const { distance, duration } = this.state;
    return (
      <View style={{ flex: 1 }}>
        {this.state.region['latitude'] ? (
          <View style={{ flex: 1 }}>
            <MyMapView
              region={this.state.region}
              form_from={this.state.form_from_latlong}
              form_to={this.state.form_to_latlong}
              selectedLatLong={this.state.selectedLatLong}
              onRegionChange={reg => this.onMapRegionChange(reg)}
              getData={params => this.getDataFromMap(params)}
            />
            <BottomDrawer
              containerHeight={400}
              offset={10}
              backgroundColor='rgba(255, 0, 0, 0)'
            >
              <View style={{
                zIndex:1,
                position: 'absolute',
                top:0,
                flex: 0.4,
                textAlign:'center',
                width:'100%',
                paddingVertical: 10,
                paddingHorizontal: 30,
              }}>
                <View style={{
                  padding:20,
                  borderRadius:10,
                  shadowColor: "#000",
                  shadowOffset: {
                  	width: 0,
                  	height: 5,
                  },
                  shadowOpacity: 0.34,
                  shadowRadius: 6.27,
                  elevation: 10,
                  backgroundColor:'white',
                }}>
                    <Text style={{
                      width:'100%',
                      height:3,
                      textAlign:'center',
                      position:'relative',
                      bottom:10
                    }}>
                      <Text style={{
                        width:100,
                        backgroundColor:'black',
                      }}>asd
                      </Text>
                    </Text>

                    <Text style={{
                      width:'100%',
                      textAlign: 'left',
                      fontWeight:'bold',
                      fontSize:20,
                      marginBottom:15
                    }}>
                    Where are you going?
                    </Text>
                  <Label>Pickup</Label>
                  <MapInput notifyChange={(loc,loc_text) => this.getCoordsFromName(loc,'from',loc_text)} placeholder='Enter pickup location.'/>
                  <View
                    style={{
                      borderBottomColor: '#d9d9d9',
                      borderBottomWidth: 2,
                    }}
                  />
                  <Label>Drop-Off</Label>
                  <MapInput notifyChange={(loc,loc_text) => this.getCoordsFromName(loc,'to',loc_text)} placeholder='Enter drop-off location' />
                  {distance ?(
                      <Form>
                      <View
                        style={{
                          borderBottomColor: '#d9d9d9',
                          borderBottomWidth: 2,
                          marginTop: 20,
                          marginLeft: -20,
                          marginRight: -20,
                        }}
                      />
                      <View style={{display:'flex',flexDirection:'row',marginTop: 20}}>
                          <View style={{width:'50%'}}>
                            <Label style={{marginTop: 0}}>Pickup Date</Label>
                            <DatePicker
                              defaultDate={new Date()}
                              minimumDate={new Date(2018, 1, 1)}
                              locale={"en"}
                              modalTransparent={false}
                              animationType={"fade"}
                              androidMode={"default"}
                              placeHolderText="Select date"
                              textStyle={{ color: "black", border: 1 }}
                              placeHolderTextStyle={{ color: "#d3d3d3" }}
                              onDateChange={(e) => this.setDate(e)}
                              disabled={false}
                              />
                            </View>
                            <View style={{width:'50%'}}>
                              <Label>Pickup Time</Label>
                              <Text onPress={this.showDateTimePicker} style={{
                                marginLeft: 10,
                                marginTop: 10,
                                textAlign: 'left',
                              }}>{this.state.chosenTime?this.state.chosenTime:'00:00 AM'}</Text>

                              <DateTimePicker
                                mode='time'
                                isVisible={this.state.isDateTimePickerVisible}
                                onConfirm={this.handleDatePicked}
                                onCancel={this.hideDateTimePicker}
                              />
                              </View>
                        </View>
                      <Button style={{marginTop: 30}} onPress={(e) => this.bookNow(e)}>
                        <Text style={{
                          width:'100%',
                          textAlign: 'center',
                        }}>Book Now</Text>
                      </Button>
                    </Form>
                    ) : null}
                </View>

              </View>
            </BottomDrawer>

          </View>
        ) : null}


      </View>
    );
  }
}

export default MapContainer;
