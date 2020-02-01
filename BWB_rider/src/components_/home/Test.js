import React, { Component } from 'react';
import { Alert, View, StyleSheet, Switch, TouchableOpacity, Image,YellowBox ,ImageBackground  } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, ListItem, Separator ,List, Thumbnail} from 'native-base';
// import {url} from '../helpers/Helper';
// import axios from 'axios';
// import AsyncStorage from '@react-native-community/async-storage';
// import { Actions } from 'react-native-router-flux';

export default class Test extends Component {
    
    constructor(props){
        super(props);
        // this.state = {
        //     Profile :[
        //         {
        //             name            : '',
        //             contact_number  : '',
        //             email           : '',
        //             date_registered : '',
        //         }
        //     ]
        // }
    }

    //   async componentDidMount(){
    //      let bodyFormData , usertype, userid, he_he;
    //      let userData = await AsyncStorage.getItem("userData");
    //      let data = JSON.parse(userData);
    //      const token    = data.type;
    //             if (token!==null) {
    //                 const       str   = token.toString(),
    //                             he_he = str.charAt(str.length-1);;
    //                             this.setState({type:he_he});
    //                   }
    //      const self = this;
    //            userid     = data.userid;
    //            bodyFormData = new FormData();
    //            bodyFormData.append('usertype',this.state.type);
    //            bodyFormData.append('userid',userid);

    //      axios({
    //          method  : 'post',
    //          url     : url()+'login/get_profile',
    //          data    : bodyFormData,
    //          config  : { headers: {'Content-Type': 'multipart/form-data' }}

    //      })
    //      .then(function(result){
    //          self.setState({Profile:result.data});

    //      })
    //  }
    // static navigationOptions = {
    //     drawerLabel: 'Profile',
    //     drawerIcon: () => (
    //         <Icon type="FontAwesome" name="user" style={{ fontSize: 19 }} />
    //     )
    // };
    render() {
        // console.log(this.state.Profile);
        // console.log(this.state.Profile);
        return (
          <View>
            <Text>
              XD
            </Text>
          </View>
        );
    }
}
// const s = StyleSheet.create({
//     backImage:{
//       height: 180,
//       width:'120%',
//       justifyContent: 'center',
//       alignItems: 'center'
//     },
//     innerText:{
//         color:'white',
//         fontSize: 30,
//         textTransform: 'uppercase',
//         textAlign: 'center'
//     },
//     innerText2:{
//         color:'white',
//         fontSize: 16,
//         textAlign: 'center'
//     },
// });
