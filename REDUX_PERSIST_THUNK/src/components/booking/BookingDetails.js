import React, { Component } from 'react';
import {
  View,
} from 'react-native';
import {
Text, Icon, Card, CardItem, Item, Body, Right,  Left, 
  ListItem, List,
 Picker
} from 'native-base'
import Paypal from './Paypal.js';
import { url } from '../helpers/Helper';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import styles from "../template/style";
import firebase from "../../firestore.js";
import PopUpModals from "./modals/Modal.js";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getDatas, getDatasThunk, getsingleData, getCalculations } from '../../actions/index.js';


class BookingDetails extends Component {
  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('Booking_Payments');
    this.state = {
      curr_locss: [],
      destination_locss: [],
      selected2: undefined

    }
    this.componentDidMount = this.componentDidMount.bind(this);
    this._toggleModal = this._toggleModal.bind(this);
    this.onStarRatingPress = this.onStarRatingPress.bind(this);
  }
  onStarRatingPress(rating) {
    this.setState({ starCount: rating });
  }
  onValueChange2(value: string) {
    console.log(value);
    this.setState({
      selected2: value
    });

    this.componentDidMount(value);
  }

  _toggleModal() {
    this.setState({ isModalVisible: false });
  }

  componentDidMount(value = null) {
    console.log('mounted book details');
    const self = this;
    this.props.getDatasThunk('RIDETYPE', url() + 'api/get_ride_type');
    const body = new FormData();
    body.append('directions', JSON.stringify(this.props.RegionReducer.directionRegions));
    if (value !== null) {
      body.append('ride', value);
    } else {
      body.append('ride', '1');
    }

    axios({
      method: 'post',
      url: url() + 'apis/calculate_fare',
      data: body,
      config: { headers: { 'Content-Type': 'multipart/form-data' } }
    })
      .then(function (result) {
        self.props.getCalculations(result.data);
      })
  }

  render() {
    let locations, ridetype;
    let x = this.props.RegionReducer.directionFormattedAddress.length;
    if (this.props.RegionReducer.directionFormattedAddress !== undefined) {
      locations = this.props.RegionReducer.directionFormattedAddress.map((data, index) => {
        return (
          <ListItem noBorder thumbnail style={{ marginTop: -25 }} key={index.toString()}>
            <Left>
              <Icon type="FontAwesome" name={index === 0 ? 'circle' : 'map-marker'} style={{ fontSize: 13, color: `${index === 0 ? 'red' : 'green'}`, marginLeft: 30, marginRight: 10 }} />
            </Left>
            <Body>
              <Text style={{ fontSize: 15 }}>{data}</Text>
              <Text note style={{ color: `${index === 0 ? 'red' : 'green'}` }} numberOfLines={1}>{index === 0 ? 'My Location' : 'My Destination'}</Text>
            </Body>
            <Right>
              <Icon type="FontAwesome" name="pencil" style={{ fontSize: 14, marginLeft: 30, marginRight: 10 }} />
            </Right>
          </ListItem>
        )
      }
      );
    }

    if (this.props.ApiData.ridetype !== undefined) {
      ridetype = this.props.ApiData.ridetype.map(data =>
        <Picker.Item label={data.name} value={data.ride_type_id} key={data.toString()} />
      )
    }
    return (
      <View style={{ backgroundColor: '#fff',height:'100%' }}>
        <View>
          <CardItem>
            <Text style={{ fontWeight: 'bold' }}> Choose Ride Type: </Text>
            <Body>
              <Item picker>
                <Picker
                  mode="dropdown"
                  iosIcon={<Icon name="arrow-down" />}
                  style={{ width: undefined }}
                  placeholder="Select your SIM"
                  placeholderStyle={{ color: "#bfc6ea" }}
                  placeholderIconColor="#007aff"
                  selectedValue={this.state.selected2}
                  onValueChange={this.onValueChange2.bind(this)}
                >
                  {ridetype}
                </Picker>
              </Item>
            </Body>
          </CardItem>
        </View>
        <View style={{ height: `${x === 3 ? '30%' : '20%'}` }}>
          <Text style={{ fontWeight: 'bold', fontSize: 12, marginLeft: 10 }}> LOCATIONS </Text>
          <List style={styles.list} >
            {locations}
          </List>
        </View>

        <View>
          <Card style={{ marginTop: '15%' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 12, marginLeft: 10 }}>YOUR RIDE</Text>
            <List style={styles.list2} >
              <ListItem thumbnail noBorder>
                <Left>
                  <Icon type="FontAwesome5" name="car" style={{ color: '#BC171B', fontSize: 30, width: 70, marginLeft: 10 }} />
                </Left>
                <Body>
                  <Text note style={{ marginLeft: 0 }}>Base fare</Text>
                  <Text note style={{ marginLeft: 0 }}>Per mile fare</Text>
                  <Text note style={{ marginLeft: 0 }}>Per min fare</Text>
                </Body>
                <Right>
                  <Text style={{ marginRight: 40 }}>${this.props.ApiData.calculations.base_fare}</Text>
                  <Text style={{ marginRight: 40 }}>${this.props.ApiData.calculations.per_mile}</Text>
                  <Text style={{ marginRight: 40 }}> ${this.props.ApiData.calculations.per_minute}</Text>
                </Right>
              </ListItem>
              
              <ListItem noBorder thumbnail style={{ marginTop: -20 }}>
                <Left>
                  <Text  style={{ fontSize: 12, marginLeft: 20,fontWeight:'bold' }}> TOTAL AMOUNT TO PAY </Text>
                </Left>
                <Right>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'red', marginLeft: '20%' }}> $ {this.props.ApiData.calculations.total_fare} </Text>
                </Right>
              </ListItem>
            </List>
            <Paypal />
          </Card>
        </View>
        <PopUpModals />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    fetchData: state.fetchData,
    ApiData: state.ApiData,
    RegionReducer: state.RegionReducer
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
    getDatas: getDatas,
    getDatasThunk: getDatasThunk,
    getsingleData: getsingleData,
    getCalculations: getCalculations
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(BookingDetails);
