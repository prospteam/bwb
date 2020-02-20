import React, { Component } from 'react';
import { Alert, View, StyleSheet, Switch } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import PayPal from 'react-native-paypal-wrapper';
// import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import Helpers from '../../Helpers';
import AsyncStorage from '@react-native-community/async-storage';

import firebase from './common/Firebase';

export default class Payment extends Component {

    static navigationOptions = {
        drawerLabel: 'Payment',
        drawerIcon: () => (
            <Icon type="FontAwesome" name="paypal" style={{ fontSize: 19 }} />
        )
    };

    // state = { useLiteCreditCardInput: false };
    // _onChange = (formData) => console.log(JSON.stringify(formData, null, " "));
    // _onFocus = (field) => console.log("focusing", field);
    // _setUseLiteCreditCardInput = (useLiteCreditCardInput) => this.setState({ useLiteCreditCardInput });

    // componentDidMount() {
    // }

    async processPayPal(){

      // console.log('HERE');
      let param = this.props.navigation.getParam('params',false);
      // console.log(param.payByDistance);
      // console.log(JSON.parse(param));
      // console.log(this.props.navigation);
      // debugger;
      // // 3 env available: NO_NETWORK, SANDBOX, PRODUCTION

      const userData = JSON.parse(await AsyncStorage.getItem('userData'));

          // AsyncStorage.getItem('value').then((val) => {
          //     this.setState({ value: val });
          // })

      PayPal.initialize(PayPal.SANDBOX, "Aa0S2ymxf9Kw5CzJxtl5AuMX0mYH4Xl8zplqIXXf_iw_CDwW505itVibzvldGCix6Fp3l15WNPGomUXp");
      PayPal.pay({
        price: ''+param.payByDistance,
        // price: '40.70',
        currency: 'USD',
        description: 'Booking Payment',
      }).then(confirm => {
        // console.log('RETURNINIG');
        // console.log(param);
        // console.log(param);

        // chosenDate: "Sep 17 2019 "
        // chosenTime: ""
        // distance: 236.405
        // duration: 133.03333333333333
        // form_from_latlong: {latitude: 42.9607266, longitude: -85.495471}
        // form_from_text: "Ada, Michigan, USA"
        // form_to_latlong: {latitude: 44.7719461, longitude: -85.5014607}
        // form_to_text: "Acme, MI, USA"
        // payByDistance: 652.86375


        confirmjson = JSON.parse(JSON.stringify(confirm));
        if(confirmjson.response.state === 'approved'){
            console.log('accessing api');
          console.log(param);
          console.log('accessing api');
          // Alert.alert('accessing api');
          fetch(Helpers.rest_api_url+'common/app_customer_bookings', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                set:{
                  // user_id: "37",
                  // booking_date: param.chosenDate,
                  pickup_location: param.form_from_text,
                  dropoff_location: param.form_to_text,
                  pickup_time: param.chosenTime,
                  travel_date: param.chosenDate,
                  booking_status: "pending",
                  login_id: userData.login_id,
                  pickup_latlong: param.form_from_latlong.latitude+":"+param.form_from_latlong.longitude,
                  dropoff_latlong: param.form_to_latlong.latitude+":"+param.form_to_latlong.longitude
                },
              })
          }).then((response) => response.json())
            .then((responseJson) => {
				
            console.log(responseJson);
				
			var now = new Date().getTime();
			
			this.ref_bookings_status = firebase.firestore().collection('watch_new_pending');
			
			// SAVE 
			const ref_single = this.ref_bookings_status.doc("last_pending");
			ref_single.get().then((docSnapshot) => {
					  if (docSnapshot.exists) {
						  ref_single.update({
						  "timestamp":now,
						  })
						  .catch(function(error) {
							  console.error("Error adding document: ", error);
						  });
					  } else {
						console.log("yesA")
						ref_single.set({
						  "timestamp":now,
						})
						.catch(function(error) {
							console.error("Error adding document: ", error);
						});
					}
			  });
			  
            Alert.alert("Booking successfully paid.");
            this.props.navigation.navigate('Dashboard',{params:{can_book:'true'}});

            // Alert.alert(responseJson);
             // if(responseJson.response === 'success'){
             //      // this.setData(responseJson.data);
             //      // Actions.dashboard();
             //      // this.props.navigation.navigate('Dashboard');
             //  } else{
             //    Alert.alert(JSON.stringify(responseJson.msg));
             //  }
            }).catch((error) => {
              console.error(error);
            });
            // Alert.alert("Booking successfully paid.");
            // this.props.navigation.navigate('Dashboard',{params:{asd:'aaaa'}});
        }else{
          Alert.alert("Error processing the payment.");
        }
      }).catch(error => console.log(JSON.parse(JSON.stringify(error))));
    }

    processStripe(){
    }

    render() {
      console.log('GETTING NAVIGATION ');
      // console.log(this.props.navigation);

      const params = this.props.navigation.getParam('params',false);
      console.log(params);
      // console.log(this.props.navigation.getParam('params','asd'));
      // console.log(this.props.navigation.getParam('param2',''));
        return (
          <Container>
            <Header>
             <Left style={{ flexDirection: 'row' }}>

             {
              // <Icon onPress={() => this.props.navigation.openDrawer()} name="md-menu" style={{ color: '#d3a04c', marginRight: 15 }} />
              }
              <Text style={{ color: '#d3a04c' }}>PAYMENT</Text>
             </Left>
             <Right>
             </Right>
            </Header>
                <Content style={{margin: 30}}>
                  {params ? (
                    <>

                  <View style={{ borderWidth: 2, borderColor: '#1c1b22', marginBottom: 5 }}>
                    <Text style={{ backgroundColor: '#e3e3e3', padding: 5 }}>Pickup Location </Text><Text style={{ padding: 5, fontSize: 14 }}>{params.form_from_text}</Text>
                  </View>
                  <View style={{ borderWidth: 2, borderColor: '#1c1b22', marginBottom: 5 }}>
                    <Text style={{ backgroundColor: '#e3e3e3', padding: 5 }}>Drop-off Location </Text><Text style={{ padding: 5, fontSize: 14 }}>{params.form_to_text}</Text>
                  </View>

                      <View style={{borderWidth: 2, borderColor: '#1c1b22', marginBottom: 5}}>
                        <Text style={{backgroundColor: '#e3e3e3', padding: 5}}>Chosen Time </Text><Text style={{padding: 5, fontSize: 14}}>{params.chosenTime}</Text>
                      </View>
                      
                      <View style={{borderWidth: 2, borderColor: '#1c1b22', marginBottom: 5}}>
                        <Text style={{backgroundColor: '#e3e3e3', padding: 5}}>Chosen Date </Text><Text style={{padding: 5, fontSize: 14}}>{params.chosenDate}</Text>
                      </View>

                      <View style={{borderWidth: 2, borderColor: '#1c1b22', marginBottom: 5}}>
                        <Text style={{backgroundColor: '#e3e3e3', padding: 5}}>Travel Distance </Text><Text style={{padding: 5, fontSize: 14}}>{params.distance} mi</Text>
                      </View>
                      <View style={{borderWidth: 2, borderColor: '#1c1b22', marginBottom: 5}}>
                        <Text style={{ backgroundColor: '#e3e3e3', padding: 5 }}>Base Fare </Text><Text style={{ padding: 5, fontSize: 14 }}>$ {params.baseFare}</Text>
                      </View>
                        <View style={{backgroundColor: '#1c1b22', padding: 10, marginBottom: 5}}><Text style={{color: '#d3a04c'}}>$ {params.payByDistance.toFixed(2)}</Text></View>
                      
                    </>
                  ):null }
                {/*<View style={s.container}>
                   <Switch
                     style={s.switch}
                     onValueChange={this._setUseLiteCreditCardInput}
                     value={this.state.useLiteCreditCardInput} />

                   { this.state.useLiteCreditCardInput ?
                     (
                       <LiteCreditCardInput
                         autoFocus
                         inputStyle={s.input}

                         validColor={"black"}
                         invalidColor={"red"}
                         placeholderColor={"darkgray"}

                         onFocus={this._onFocus}
                         onChange={this._onChange} />
                     ) : (
                       <CreditCardInput
                         autoFocus

                         requiresName
                         requiresCVC
                         requiresPostalCode

                         labelStyle={s.label}
                         inputStyle={s.input}
                         validColor={"black"}
                         invalidColor={"red"}
                         placeholderColor={"darkgray"}

                         onFocus={this._onFocus}
                         onChange={this._onChange} />
                     )
                   }
                 </View>*/}
                 <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop: 30}}>
                     <Button onPress={() => this.processPayPal()} style={s.paypalBtn}>
                         <Icon type="FontAwesome" name="cc-paypal" />
                         <Text>
                          PayPal
                         </Text>
                     </Button>
                 </View>

                </Content>
                {
                  // <Footer>
                    // <FooterTab style={{backgroundColor:"#1c1b22"}}>
                    //     <Button vertical onPress={() => this.props.navigation.navigate('Dashboard')}>
                    //         <Icon name="apps" />
                    //         <Text>Dashboard</Text>
                    //     </Button>
                    //     <Button vertical>
                    //         <Icon name="map" />
                    //         <Text>Book Now</Text>
                    //     </Button>
                    //     <Button vertical>
                    //         <Icon name="navigate" />
                    //         <Text>Navigate</Text>
                    //     </Button>
                    // </FooterTab>
                    // </Footer>
                }
        </Container>
        );
    }
}

const s = StyleSheet.create({
  switch: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  container: {
    backgroundColor: "#F5F5F5",
    marginTop: 60
  },
  label: {
    color: "black",
    fontSize: 12,
  },
  input: {
    fontSize: 16,
    color: "black",
  },
  paypalBtn: {
      borderRadius: 30
  }
});
