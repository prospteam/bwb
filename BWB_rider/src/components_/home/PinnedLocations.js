import React, { Component } from 'react';
import { Alert, View, StyleSheet, Switch, TouchableOpacity, Image,YellowBox ,ImageBackground  } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, ListItem, List, Card, CardItem } from 'native-base';
import {url} from '../helpers/Helper';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import {connect} from 'react-redux';
import {set_pinned} from '../../actions/index.js';
import {bindActionCreators} from 'redux';

 class PinnedLocations extends Component {

    constructor(props){
        super(props);

        this.getData2 = this.getData2.bind(this);

        this.state = {
            'userid': null,
            'saved_location': [],
            'pinned_locs'   : [],
        }
        this.pressPinned = this.pressPinned.bind(this);
    }

    pressPinned(lat,long,name){
        let pinned = [];
        pinned = [
            {
                latitude: lat,
                longitude: long,
                addressname : name
            }
        ]
          this.props.set_pinned('PinnedLocations',pinned);
          Actions.Dashboard();
    }
    async componentDidMount(){
        try {
            let userData = await AsyncStorage.getItem("userData");
            let data = JSON.parse(userData);
            if(data.userid !== null){
                const  self = this;
                const api = url()+'api/get_location2/'+ data.userid;
                console.log( data.userid);
                axios.get(api).then(function(res){
                    console.log(res);
                    self.setState({saved_location: res.data});
                });
            }
        } catch (error) {
            console.log("Something went wrong", error);
        }
    }

    async getData2(responseJson){

        try {
            let userData = await AsyncStorage.getItem("userData");
            let data = JSON.parse(userData);
            if(data.userid !== null){
                this.setState({ userid: data.userid });
                // console.error(this.state.userid);
            }
        } catch (error) {
            console.log("Something went wrong", error);
        }
    }

    getSavedLoc(){

        console.log('getSavedLoc');
        // console.error(this.state.userid);
        const api = url()+'api/get_location';

        const data = {
            user_id: this.state.userid
        }

        console.log(data);

        const self = this;

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
                self.setState({saved_location: res.data});
            }
         }).catch((error) => {
           console.error(error);
         });

    }

    async deleteLoc(id){
        const api = url()+'api/delete_location';

        const data = {
            location_id: id
        }

        const self = this;

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
                Alert.alert('Location has been removed.');
            }

         }).catch((error) => {
           console.error(error);
         });

         try {
             let userData = await AsyncStorage.getItem("userData");
             let data = JSON.parse(userData);
             if(data.userid !== null){
                 const  self = this;
                 const api = url()+'api/get_location2/'+ data.userid;
                 axios.get(api).then(function(res){
                     self.setState({saved_location: res.data});
                 });
             }
         } catch (error) {
             console.log("Something went wrong", error);
         }

    }

    render() {
        console.log(this.state.saved_location);
        const locations = this.state.saved_location.map((prop) => {
                return(
                    <Card key={prop.location_id}>
                    <CardItem button onPress={() => this.pressPinned(prop.latitude,prop.longitude, prop.location_name)}>
                        <Body>
                            <Text>
                                {prop.location_name}
                            </Text>
                        </Body>
                    </CardItem>
                    <TouchableOpacity style={{position: 'absolute', top: 0, left: 0, right: 0, top: 0, justifyContent: 'flex-end', alignItems: 'flex-end'}} onPress={() => this.deleteLoc(prop.location_id)}>
                        <Icon type="FontAwesome" name="times-circle" style={{fontSize: 18, color: '#000' }} />
                    </TouchableOpacity>
                </Card>
                )
        });

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
                           <Title>Pinned Locations</Title>
                     </Body>
                     <Right>
                     </Right>
               </Header>
               <Content padder>
                   <View>
                        {locations}
                    </View>
               </Content>
             </Container>
           );
    }
}

const s = StyleSheet.create({

    backImage:{
      height: 180,
      width:'120%',
      justifyContent: 'center',
      alignItems: 'center'
    },
    innerText:{
        color:'white',
        fontSize: 30,
        textTransform: 'uppercase',
        textAlign: 'center'
    },
    innerText2:{
        color:'white',
        fontSize: 16,
        textAlign: 'center'
    },
});

const mapStateToProps = (state) => {
    console.log('redux state', state);
    return {

    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({
        set_pinned         : set_pinned,
    },dispatch)
}


export default connect(mapStateToProps,matchDispatchToProps)(PinnedLocations);
