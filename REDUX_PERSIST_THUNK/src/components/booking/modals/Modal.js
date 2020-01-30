import React ,{Component} from 'react';
import { StyleSheet , Image, ScrollView , TouchableOpacity ,Alert,ListView,
 SafeAreaView ,
 SectionList,
 StatusBar,
 View,
 AppState,
 Switch
} from 'react-native';
import { Container, Header, Title, Content, Text, Icon,DeckSwiper, Card, CardItem, Item, Body, Right, Button, Input, Form, Textarea, Left ,Thumbnail,
    ListItem,List,
    Footer,FooterTab,Picker
} from 'native-base'
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import styles from "../../template/style";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Geocoder from 'react-native-geocoding';
import Modal from "react-native-modal";
import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import StarRating from 'react-native-star-rating';
import {getDatas,getDatasThunk,getsingleData,getCalculations} from '../../../actions/index.js';
import firebase from "../../../firestore.js";

const drawerImage = require("../../../assets/images/app-logo.png");

class PopUpModals extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalFindingDriver: false,
            isModalFoundDriver: false,
            starCount: 3,
        }

        this.unsubscribe = null;
        this.onStarRatingPress= this.onStarRatingPress.bind(this);
        this.ref = firebase.firestore().collection('Booking_Payments');
        console.log('PopUpModals constructor');
    }

    componentDidMount(){
        console.log('PopUpModals miunt');
     this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    }

    onCollectionUpdate = (onSnapshot) => {
        const id = '1982771702Esz5i0ft6vb';
      const users = [];
      const self = this;
      onSnapshot.forEach((doc) => {
          console.log(doc);
        const {ride_status,rider_id} = doc.data();
        console.log(doc.data());
        if (ride_status==='1' && rider_id===id) {
           self.setState({isModalFindingDriver:true});
           console.log(ride_status);
           console.log(rider_id);
       }else if (ride_status==='2' && rider_id===id) {
           self.setState({isModalFoundDriver:true});
           console.log(ride_status);
           console.log(rider_id);
       }else {
            self.setState({isModalFoundDriver:false,isModalFindingDriver:false});
       }
      });
    }

    onStarRatingPress(rating){
        this.setState({starCount:rating});
    }
    render(){
        console.log('PopUpModals render');
        console.log('modal',this.state);
        console.log('modal props', this.props.singleData.findDriver);
        let addDestination ;
        if (this.props.fetchData.locations_destination!==undefined) {
             addDestination = this.props.fetchData.locations_destination.map( (data,index ) => {
                 if (index !==0) {
                     return (
                         <ListItem icon key ={index}>
                               <Left>
                               <Icon type="FontAwesome" name="map-marker" style={{fontSize: 14, color: 'green',  marginRight: 10 }} />
                               </Left>
                               <Body>
                               <Text style={{ fontSize: 15 }} >{data}</Text>
                               <Text style={{ fontSize: 14 }} note> to</Text>
                               </Body>
                         </ListItem>
                     )
                 }
             }

            );
        }

        return(
            <View>
            {this.state.isModalFindingDriver===true
                &&
                <View style={{ flex: 1 }}>
                    <Modal isVisible={this.state.isModalFindingDriver}>
                        <View style={styles.content}>
                        <Button style={{backgroundColor:'#BC171B'}} testID={'close-button'} title="Close" >
                        <Text >Finding you a driver👋 </Text></Button>
                        </View>
                      <View style={{ backgroundColor:'#fff',height:130}}>
                          <SafeAreaView style={styles.customBackdrop}>
                          <View style={{alignItems:'center',justifyContent: 'center',marginTop:30}}>
                              <Bars size={30} color="#BC171B" />
                          </View>
                          </SafeAreaView>
                      </View>
                    </Modal>
                  </View>
            }
                        {this.state.isModalFoundDriver===true
                            &&
                            <View style={{ flex: 1 }} >
                                <Modal isVisible={this.state.isModalFoundDriver}>
                                    <View style={styles.content}>
                                    <Button style={{backgroundColor:'#BC171B'}} testID={'close-button'} title="Close" >
                                    <Text style={{fontWeight:'bold'}}>Driver is already found for you👋 </Text></Button>
                                    </View>
                                  <View style={{ backgroundColor:'#F0F0F0',height:280}}>
                                  <ScrollView>
                                      <SafeAreaView style={styles.customBackdrop}>
                                      <ListItem  thumbnail style={styles.listitem_box_booking_details}>
                                        <Left>
                                          <Thumbnail square source={drawerImage} style={styles.avatar_drivr_bookingdetails} />
                                        </Left>
                                        <Body>
                                          <Text>Driver Name</Text>
                                          <Text note numberOfLines={1}>Female</Text>
                                          <Text note numberOfLines={1}>Ride Type</Text>
                                          <Text note numberOfLines={1}>Vehicle plate no. ABC-8476</Text>
                                          <Text note numberOfLines={1}>Vehicle color: red</Text>
                                          <Text note numberOfLines={1}>Model: Honda Civic</Text>
                                      <View style={{width:'40%'}}>
                                      <StarRating
                                             disabled={false}
                                             emptyStar={'ios-star-outline'}
                                             fullStar={'ios-star'}
                                             halfStar={'ios-star-half'}
                                             iconSet={'Ionicons'}
                                             maxStars={5}
                                             rating={this.state.starCount}
                                             selectedStar={(rating) => this.onStarRatingPress(rating)}
                                             fullStarColor={'#BC171B'}
                                             starSize= {15}
                                           />
                                      </View>
                                        </Body>
                                      </ListItem>
                                              <ListItem icon>
                                                    <Left>
                                                          <Icon type="FontAwesome" name="circle" style={{fontSize: 12, color: 'red',  marginRight: 10 }} />
                                                    </Left>
                                                    <Body>
                                                      <Text style={{ fontSize: 15 }} >{this.props.fetchData.locations_destination[0]}</Text>
                                                      <Text style={{ fontSize: 14 }} note> from</Text>
                                                    </Body>
                                              </ListItem>
                                        {addDestination}
                                      </SafeAreaView>
                                      </ScrollView>
                                  </View>
                                  <View style={{backgroundColor:'white'}}>
                                  <ListItem   >
                                    <Left>
                                    <Button style={{backgroundColor:'#BC171B',width:'80%'}} testID={'close-button'} title="Close" >
                                      <Text >See details </Text></Button>
                                    </Left>
                                    <Body>
                                    <Button style={{backgroundColor:'#F0F0F0',width:'80%'}} testID={'close-button'} title="Close" >
                                      <Text style={{color:'#BC171B'}}>CANCEL BOOKING</Text></Button>
                                    </Body>
                                  </ListItem>
                                  </View>
                                </Modal>
                              </View>

                        }
            </View>
        )
    }
}


const mapStateToProps = (state) => {
        console.log('redux state',state);
    return {
            fetchData    : state.fetchData,
            ApiData      : state.ApiData,
            singleData      : state.singleData,
    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({
        getDatas         : getDatas,
        getDatasThunk    : getDatasThunk,
        getsingleData    : getsingleData,
        getCalculations    : getCalculations
    },dispatch)
}

export default connect(mapStateToProps,matchDispatchToProps)(PopUpModals);
