import React, { Component } from 'react';
import { Alert, View, StyleSheet, Switch } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text } from 'native-base';
import PayPal from 'react-native-paypal-wrapper';
// import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import Helpers from '../../Helpers';

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

    processPayPal(){
      // console.log('HERE');
      let param = this.props.navigation.getParam('params',false);
      // console.log(param.payByDistance);
      // console.log(JSON.parse(param));
      // console.log(this.props.navigation);
      // debugger;
      // // 3 env available: NO_NETWORK, SANDBOX, PRODUCTION
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
          console.log(param);
          console.log('accessing api');
          Alert.alert('accessing api');
          fetch(Helpers.rest_api_url+'common/app_customer_bookings', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                set:{
                  user_id: "37",
                  booking_date: param.chosenDate,
                  pickup_location: param.form_from_text,
                  dropoff_location: param.form_to_text,
                  pickup_time: param.chosenDate,
                  travel_date: param.chosenDate,
                  booking_status: "",
                },
              })
            // }).then((responseJson) => {
              // console.log(responseJson);
              // Alert.alert(responseJson);
               // if(responseJson.response === 'success'){
               //      // this.setData(responseJson.data);
               //      // Actions.dashboard();
               //      // this.props.navigation.navigate('Dashboard');
               //  } else{
               //    Alert.alert(JSON.stringify(responseJson.msg));
               //  }
              // }).catch((error) => console.error(error));
          }).then((response) => response.json())
            .then((responseJson) => {
            console.log(responseJson);
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
          Alert.alert("Booking successfully paid.");
        }else{
          Alert.alert("Error processing the payment.");
        }
      }).catch(error => JSON.parse(JSON.stringify(error)));
    }

    processStripe(){
    }

    render() {
      console.log('try to get passed params');
      const params = this.props.navigation.getParam('params',false);
      console.log(params);
      // console.log(this.props.navigation.getParam('params','asd'));
      // console.log(this.props.navigation.getParam('param2',''));
        return (
          <Container>
            <Header>
             <Left style={{ flexDirection: 'row' }}>
              <Icon onPress={() => this.props.navigation.openDrawer()} name="md-menu" style={{ color: '#d3a04c', marginRight: 15 }} />
              <Text style={{ color: '#d3a04c' }}>PAYMENT</Text>
             </Left>
             <Right>
             </Right>
            </Header>
                <Content>
                  {params ? (
                    <>
                      <Text>
                        Chosen Date:
                        {params.chosenDate}
                      </Text>
                      <Text>
                        Chosen Time:
                        {params.chosenTime}
                      </Text>
                      <Text>
                        Total Travel Distance:
                        {params.distance}
                      </Text>
                      <Text>
                        Pickup Location:
                        {params.form_from_text}
                      </Text>
                      <Text>
                        Dropoff Location:
                        {params.form_to_text}
                      </Text>
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
                <Footer>
                    <FooterTab style={{backgroundColor:"#1c1b22"}}>
                        <Button vertical onPress={() => this.props.navigation.navigate('Dashboard')}>
                            <Icon name="apps" />
                            <Text>Dashboard</Text>
                        </Button>
                        <Button vertical>
                            <Icon name="map" />
                            <Text>Book Now</Text>
                        </Button>
                        <Button vertical>
                            <Icon name="navigate" />
                            <Text>Navigate</Text>
                        </Button>
                    </FooterTab>
                </Footer>
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
