import React, { Component } from 'react';
import { StyleSheet , Image, ScrollView , TouchableOpacity ,Alert} from 'react-native';
import { Container, Header, Content, Item, Input, Icon , Form ,Button ,Text, View, Thumbnail ,Spinner,List ,ListItem} from 'native-base';
import {url} from '../helpers/Helper';
import logo from  '../../assets/images/logo.png';
import axios from 'axios';
 import firebase_ from "../booking/firestore.js";
import firebase from 'react-native-firebase';
import FCM ,{ RemoteMessage,FCMEvent, NotificationType, WillPresentNotificationResult, RemoteNotificationResult  } from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-community/async-storage';

// firebase.auth()
//       .signInAnonymously()
//       .then(credential => {
//         if (credential) {
//           console.log('default app user ->', credential.user.toJSON());
//         }
//       });

class Add extends Component {
        constructor(props){
            super(props);
        // this.unsubscribe = null;
            this.state = {
                Username           : '',
                Mobile         : '',
                users: []
            };
            this.handleSubmit = this.handleSubmit.bind(this);
              // this.ref = firebase.firestore().collection('test');
                console.log('constructor');
        }

        async componentDidMount() {
        this.checkPermission();
        this.createNotificationListeners();
    }
    componentWillUnmount() {
          this.notificationListener;
          this.notificationOpenedListener;
    }

        async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
        } else {
            this.requestPermission();
        }
 }


 async getToken() {
   let fcmToken = await AsyncStorage.getItem('fcmToken');
   if (!fcmToken) {
     fcmToken = await firebase.messaging().getToken();
     if (fcmToken) {

       console.log('fcmToken:', fcmToken);
       await AsyncStorage.setItem('fcmToken', fcmToken);
     }
   }
   console.log('fcmToken:', fcmToken);
 }


 async requestPermission() {
   try {
     await firebase.messaging().requestPermission();

     this.getToken();
   } catch (error) {

     console.log('permission rejected');
   }
 }

 async createNotificationListeners() {

       this.notificationListener = firebase.notifications().onNotification((notification) => {
             const { title, body } = notification;
             console.log('onNotification:');

               const localNotification = new firebase.notifications.Notification({
                 sound: 'sampleaudio',
                 show_in_foreground: true,
               })
               .setSound('sampleaudio.wav')
               .setNotificationId(notification.notificationId)
               .setTitle(notification.title)
               .setBody(notification.body)
               .android.setChannelId('fcm_channel')


               .android.setPriority(firebase.notifications.Android.Priority.High);


               firebase.notifications()
                 .displayNotification(localNotification)
                 .catch(err => console.error(err));
       });

       const channel = new firebase.notifications.Android.Channel('fcm_channel', 'Demo app name', firebase.notifications.Android.Importance.High)
         .setDescription('Demo app description')
         .setSound('sampleaudio.wav');
       firebase.notifications().android.createChannel(channel);


       this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
             const { title, body } = notificationOpen.notification;
             console.log('onNotificationOpened:');
             Alert.alert(title, body)
       });


       const notificationOpen = await firebase.notifications().getInitialNotification();
       if (notificationOpen) {
             const { title, body } = notificationOpen.notification;
             console.log('getInitialNotification:');
             Alert.alert(title, body)
       }

       this.messageListener = firebase.messaging().onMessage((message) => {
             //process data message
             console.log("JSON.stringify:", JSON.stringify(message));
       });
 }



        // onCollectionUpdate = (onSnapshot) => {
        //   const users = [];
        //   onSnapshot.forEach((doc) => {
        //     const { email, mobile } = doc.data();
        //     users.push({
        //       key: doc.id,
        //       doc, // DocumentSnapshot
        //       email,
        //       mobile,
        //     });
        //
        //   });
        //
        //   this.setState({
        //     users,
        //     isLoading: false,
        //  });
        // }

        handleSubmit(){
           //  const self = this;
           //  this.ref.add({
           //      email:self.state.Username,
           //      mobile: self.state.Mobile
           // })
           // .then((docRef) => {
           //     console.log(docRef);
           // })
           // .catch((error) => {
           //       console.error("Error adding document: ", error);
           // });
        }
    render(){
                        console.log('render');

        return(
            <ScrollView >
            <Item  id="Username" ref="Username"  style={styles.inputs}>
                  <Icon  name='person' />
                  <Input  placeholder='Username' value={this.state.Username}  onChangeText={(Username) => this.setState({Username})} />
            </Item>
             <Item  id="Mobile" ref="Mobile" style={styles.inputs}>
                <Icon type="FontAwesome" name='mobile' style={{ fontSize: 30 }} />
                <Input placeholder='Phone Number' value={this.state.Mobile} keyboardType="phone-pad"   onChangeText={(Mobile) => this.setState({Mobile})}/>
            </Item>

            <TouchableOpacity  >
                <Button block ref="buton" onPress={this.handleSubmit}    type="submit" value="sas" style={styles.btnregister}>
                  <Text style={styles.register_text}>Register</Text>
               </Button>
           </TouchableOpacity>

      {/*
        this.state.users.map((item, i) =>
                  <Text key={i}>{item.email}</Text>
        )
      */}
         </ScrollView>
        )
    }
}

export default Add;
const styles = StyleSheet.create({
      image: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
    },
    form:{
        marginTop:'10%'
    },
        container: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        flex: 1,
        justifyContent: 'center',

    },
    inputs:{
         borderLeftWidth:0.5 ,
         borderRightWidth:0.5 ,
         borderBottomWidth:0.5 ,
         borderTopWidth:0.5 ,
         paddingHorizontal: 10,
         marginVertical : 4,
         borderRadius:3,

    },
    inputs2:{
    borderColor:'red'

    },
    btnregister:{
        marginTop:'10%',
        marginBottom:'5%',
        backgroundColor: '#910506',
         borderRadius:3,
    },
    register_text :{
        paddingBottom:'10%'
    }

});
