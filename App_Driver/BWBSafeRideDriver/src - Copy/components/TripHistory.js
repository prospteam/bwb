import React, { Component } from 'react';
import { Alert, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Tab, Tabs } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Helpers from '../../Helpers';

export default class TripHistory extends Component {
    static navigationOptions = {
        drawerLabel: 'Trip History',
        drawerIcon: () => (
            <Icon type="FontAwesome" name="taxi" style={{ fontSize: 19 }} />
        )
    };

    constructor(props){
        super(props);

        this.state = {
            userid: null,
            trip_history: []
        }
    }


    componentDidMount(){

        AsyncStorage.getItem("userData", (errs,result) => {
           if (!errs) {
               if (result !== null) {
                   // this.setState({activeID:result});
                   let res = JSON.parse(result);
                   // console.error(res.userid)
                   this.setState({userid: res.login_id});

                   const data = {
                       driver_id: this.state.userid
                   }

                   fetch(Helpers.api_url+'get_driver_history',{
                       method: 'POST',
                       headers: {
                           'Accept': 'application/json',
                           'Content-Type': 'application/json'
                       },
                       body: JSON.stringify(data)
                   }).then((response) => {
                        console.log("response");
                        console.log(response);
                       return response.json()
                    })
                   .then((res) => {

                    console.log('data');
                    console.log(data);

                    console.log('res');
                    console.log(res);

                       if(res.response === 'success'){
                          this.setState({trip_history: res.data});
                      }

                   }).catch((error) => {
                      console.error(error);
                   });
               }
            }
       });
    }

    onPressPinned(booking_id){

        const data = {
           book_id: booking_id,
           status: 'to_pin'
        }

        fetch(Helpers.api_url+'pin_ride',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((response) => response.json())
        .then((res) => {
            if(res.response === 'success'){
               Alert.alert("Booking locations have been saved.");
           }else{
               console.log(res.response);
           }

        }).catch((error) => {
           console.error(error);
        });

        const data2 = {
            user_id: this.state.userid
        }

        fetch(Helpers.api_url+'get_ride_history',{
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data2)
        }).then((response) => response.json())
        .then((res) => {
            if(res.response === 'success'){
               this.setState({trip_history: res.data});
            }

        }).catch((error) => {
           console.error(error);
        });
    }

    


    render() {

        console.log('State History');
        console.log(this.state);
        return (
            <Container>
            <Header>
            <Left style={{ flexDirection: 'row', alignItems: 'center' }}>
             <Icon onPress={() => this.props.navigation.openDrawer()} name="md-menu" style={{ color: '#d3a04c', marginRight: 15 }} />
             <Text style={{width: 300, color: '#d3a04c'}}>Trip History</Text>
            </Left>
             <Right>
             </Right>
            </Header>
            <Tabs tabBarUnderlineStyle={{backgroundColor: '#d3a04c'}}>
                <Tab heading="Completed Bookings" tabStyle={{backgroundColor: '#1c1b22'}} textStyle={{color: '#fff'}} activeTextStyle={{color: '#fff'}} activeTabStyle={{backgroundColor: '#d3a04c'}}>
                    {this.state.trip_history && this.state.trip_history.map((value, index) => {
                        if(value.booking_status == 'completed'){
                        return (<View key={index} style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 25, paddingVertical: 20, borderBottomWidth: 2, borderColor: '#e3e3e3'}}>
                            <View style={styles.tabListContents}>
                                <Text style={styles.tabTextContents}>From: {value.pickup_location != null ? value.pickup_location : '-'}</Text>
                                <Text style={styles.tabTextContents}>To: {value.dropoff_location != null ? value.dropoff_location: '-'}</Text>
                            </View>
                            <View style={styles.tabListContents, {width: 80}}><Text style={{fontSize: 11}}>{value.travel_date}</Text></View>
                            {value.saved_booking == "no" && <TouchableOpacity style={styles.tabListContents, {width: 38, padding: 3, borderRadius: 30, borderWidth: 2, borderColor: '#e3e3e3'}} onPress={() => this.onPressPinned(value.booking_id)}><Icon name="bookmark" style={{fontSize: 25, color: '#d3a04c', textAlign: 'center'}} /></TouchableOpacity>}
                        </View>);}
                    })}
                </Tab>
            </Tabs>
        </Container>
        );
    }
}

 const styles = StyleSheet.create({
    tabListContents: {
        paddingHorizontal: 5,
        flex: 1
    },
    tabTextContents: {
        fontSize: 13,
    },
    tabTextContents2: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#6aa534'
    },
    tabTextContents3: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#dd2825'
    }
 });
