import React, { Component } from 'react';
import { Alert, View, StyleSheet, Switch, TouchableOpacity, Image,YellowBox ,ImageBackground, Dimensions  } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, ListItem, List, Card, CardItem, Textarea } from 'native-base';
import {url} from '../helpers/Helper';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import {connect} from 'react-redux';
import driver_profile from '../../assets/images/app-logo.png';
// import driver_profile from '../../assets/images/driver-profile.png';
import StarRating from 'react-native-star-rating';

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width

export default class DriverRating extends Component {

    constructor(props){
        super(props);

        this.state = {
          starCount: 5,
          commentReview: '',
          userid: null,
          driver_id: '1991063817Ec1e1rckwlj',
          average: 0
        };

        this.getData();

        const api = url()+'api/get_avg_rating';

        const data = {
            'driver_id': this.state.driver_id
        }

        fetch(api, {
         method: 'POST',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
       },
       body: JSON.stringify(data)
       }).then((response) => response.json())
         .then((res) => {
             if(res.response === 'success'){
                 this.setState({average: res.data.avg})
             }

         }).catch((error) => {
           console.error(error);
         });
    }

    async getData(){
        try {
            let userData = await AsyncStorage.getItem("userData");
            let data = JSON.parse(userData);

            if(data.userid !== null){
                this.setState({ userid: data.userid });
            }

        } catch (error) {
            console.log("Something went wrong", error);
        }
    }

    onStarRatingPress(rating) {
      this.setState({
        starCount: rating
      });
    }

    onCommentChange(comment){
        this.setState({
            commentReview: comment
        });
    }

    onFeedbackSubmit(){
        const star = this.state.starCount;
        const comment = this.state.commentReview;
        const api = url()+'api/save_driver_ratings';

        const data = {
            'rating_count'	: this.state.starCount,
			'rating_comment': this.state.commentReview,
			'driver_id'		: '1991063817Ec1e1rckwlj', //static for now; need to pass driver id
			'rider_id'		: this.state.userid
        }

        fetch(api, {
         method: 'POST',
         headers: {
           'Accept': 'application/json',
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(data)
       }).then((response) => response.json())
         .then((res) => {
             if(res.response === 'success'){
                 Alert.alert(
                     'Success',
                      res.msg,
                      [
                          { text: 'OK', onPress: () => Actions.Dashboard() },
                      ],
                      { cancelable: false }
                 );
             }

         }).catch((error) => {
           console.error(error);
         });
    }

    render(){
        return (
             <Container>
               <Header style={{ backgroundColor: '#A31510' }} transparent>
                     <Left>
                           <Button transparent>
                               <TouchableOpacity onPress={() => this.props.navigation.navigate('Dashboard')}>
                                    <Icon name='arrow-back' style={{color: 'white', marginLeft: 10}} />
                                 </TouchableOpacity>
                           </Button>
                         </Left>
                     <Body>
                           <Title>Driver Rating</Title>
                     </Body>
                     <Right>
                     </Right>
               </Header>
               <Content>
               <ImageBackground style={styles.drawerCover} source={require('../../assets/images/building2.png')} >
                    <View style={{flexDirection: 'row', flex: 1}}>
                        <View style={{justifyContent: 'center', width: '40%', alignItems: 'center'}}><Image source={driver_profile} title="driver" /></View>
                        <View style={{justifyContent: 'center'}}><Text style={{color: '#fff', fontWeight: 'bold', fontSize: 20}}>Driver Name</Text><View style={{flexDirection: 'row', alignItems: 'center'}}><Icon name="star" style={{color: "yellow", fontSize: 14}} /><Text style={{fontSize: 14, color: '#fff'}}> {(Math.round(this.state.average * 10) / 10).toFixed(1)}</Text></View></View>
                    </View>
                </ImageBackground>
                <View style={{margin: 30}}>
                <View>
                    <Text style={{fontWeight: 'bold', fontSize: 20, color: '#3e3e3e', marginBottom: 10}}>Ride complete</Text>
                    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginVertical: 10, borderWidth: 2, borderColor: '#c1191c', width: 100, textAlign: 'center', padding: 5}}><Icon name="cash" style={{color: '#c1191c'}} /><Text style={{ fontSize: 12, color: '#c1191c', fontWeight: 'bold' }}>  Send Tips</Text></TouchableOpacity>
                    <Text style={{fontSize: 14, color: '#3e3e3e'}}>Dummy text for the reader to review. </Text><Text style={{fontSize: 14, color: '#3e3e3e'}}>Words shown on this layout are placeholders.</Text>
                </View>
                <View style={{flexDirection: 'row', marginVertical: 20}}>
                    <StarRating
                        disabled={false}
                        emptyStar={'ios-star-outline'}
                        fullStar={'ios-star'}
                        iconSet={'Ionicons'}
                        maxStars={5}
                        rating={this.state.starCount}
                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                        fullStarColor={'#ffcd00'}
                        starSize={35}
                        buttonStyle={{marginHorizontal: 5}}
                     />
                </View>
                <Textarea style={{backgroundColor: '#f5f5f5', borderColor: 'transparent', fontSize: 12, padding: 20}} rowSpan={4} bordered placeholder="Additional comments..." value={this.state.commentReview} onChangeText={(comment) => this.onCommentChange(comment) } />
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <TouchableOpacity style={{backgroundColor: '#c1191c', padding: 13, borderRadius: 3, width: 180, marginTop: 15, marginRight: 10}}><Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold', textAlign: 'center'}} onPress={() => this.onFeedbackSubmit()}>SUBMIT FEEDBACK</Text></TouchableOpacity>
                    <TouchableOpacity style={{backgroundColor: '#fff', padding: 13, borderRadius: 3, width: 150, marginTop: 15, borderWidth: 2, borderColor: '#e3e3e3'}} onPress={() => this.props.navigation.navigate('Dashboard')}><Text style={{ color: '#a1a1a1', fontSize: 14, fontWeight: 'bold', textAlign: 'center'}}>SKIP</Text></TouchableOpacity>
                </View>
                </View>
               </Content>
             </Container>
           );
    }
}

const styles = StyleSheet.create({
    drawerCover: {
      alignSelf: "stretch",
      height: deviceHeight / 4.5,
      width: null,
      position: "relative",
      marginBottom: 10
    }
});
