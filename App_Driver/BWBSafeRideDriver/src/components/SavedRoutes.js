import React, { Component } from 'react';
import { Alert, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Tab, Tabs } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Helpers from '../../Helpers';
import {Actions} from 'react-native-router-flux';

export default class SavedRoutes extends Component {
    static navigationOptions = {
        drawerLabel: 'Saved Routes',
        drawerIcon: () => (
            <Icon type="FontAwesome" name="map-pin" style={{ fontSize: 19 }} />
        )
    };

    constructor(props){
        super(props);

        this.state = {
            userid: null,
            saved_route: []
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
                       user_id: this.state.userid
                   }

                   fetch(Helpers.api_url+'get_ride_history',{
                       method: 'POST',
                       headers: {
                           'Accept': 'application/json',
                           'Content-Type': 'application/json'
                       },
                       body: JSON.stringify(data)
                   }).then((response) => response.json())
                   .then((res) => {

                       if(res.response === 'success'){
                          this.setState({saved_route: res.data});
                      }

                   }).catch((error) => {
                      console.error(error);
                   });
               }
            }
       });
    }

    onPressPinned(val = null){

        // const data = {
        //    book_id: booking_id,
        //    status: 'to_pin'
        // }

        // console.log(val);

        this.props.navigation.navigate('Dashboard',{
            booking_data: val,
            booking_data_from_latlong: {latitude: JSON.parse(val.pickup_latlong.split(":")[0]), longitude: JSON.parse(val.pickup_latlong.split(":")[1])},
            booking_data_to_latlong: {latitude: JSON.parse(val.dropoff_latlong.split(":")[0]), longitude: JSON.parse(val.dropoff_latlong.split(":")[1])},
            booking_data_region: {latitude: JSON.parse(val.pickup_latlong.split(":")[0]), longitude: JSON.parse(val.pickup_latlong.split(":")[1]), latitudeDelta:  0.015, longitudeDelta: 0.0121},
            booking_data_from_text: val.pickup_location,
            booking_data_to_text: val.dropoff_location
        });
    }

    onPressRemove(booking_id){

        const data = {
           book_id: booking_id,
           status: 'to_unpin'
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
               Alert.alert("Route removed.");
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
               this.setState({saved_route: res.data});
            }

        }).catch((error) => {
           console.error(error);
        });
    }

    render() {
        return (
            <Container>
            <Header>
            <Left style={{ flexDirection: 'row', alignItems: 'center' }}>
             <Icon onPress={() => this.props.navigation.openDrawer()} name="md-menu" style={{ color: '#d3a04c', marginRight: 15 }} />
             <Text style={{width: 300, color: '#d3a04c'}}>Saved Routes</Text>
            </Left>
             <Right>
             </Right>
            </Header>
            <Tabs tabBarUnderlineStyle={{backgroundColor: '#d3a04c'}}>
                <Tab heading="" tabStyle={{backgroundColor: '#1c1b22'}} textStyle={{color: '#fff'}} activeTextStyle={{color: '#fff'}} activeTabStyle={{backgroundColor: '#d3a04c'}}>
                    {this.state.saved_route && this.state.saved_route.map((value, index) => {
                        if(value.booking_status == 'completed' && value.saved_booking == "yes" && value.status == 1){
                        return (<View key={index} style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 25, paddingVertical: 20, borderBottomWidth: 2, borderColor: '#e3e3e3'}}>
                            <View style={styles.tabListContents}>
                                <Text style={styles.tabTextContents}>From: {value.pickup_location != null ? value.pickup_location : '-'}</Text>
                                <Text style={styles.tabTextContents}>To: {value.dropoff_location != null ? value.dropoff_location: '-'}</Text>
                            </View>
                            <TouchableOpacity style={styles.tabListContents, {width: 38, padding: 3, borderRadius: 30, borderWidth: 2, borderColor: '#e3e3e3', marginRight: 5}} onPress={() => this.onPressPinned(value)}><Icon name="pin" style={{fontSize: 25, color: '#d3a04c', textAlign: 'center'}} /></TouchableOpacity>
                            <TouchableOpacity style={styles.tabListContents, {width: 38, padding: 3, borderRadius: 30, borderWidth: 2, borderColor: '#e3e3e3'}} onPress={() => this.onPressRemove(value.booking_id)}><Icon name="close" style={{fontSize: 25, color: '#d3a04c', textAlign: 'center'}} /></TouchableOpacity>
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
