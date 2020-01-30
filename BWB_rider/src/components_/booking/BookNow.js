import React, { Component } from 'react';
import { StyleSheet , Image, ScrollView , TouchableOpacity ,Alert,ListView,
 SafeAreaView ,
 SectionList,
 StatusBar,
 View,
 AppState
} from 'react-native';
import { Container, Header, Title, Content, Text, Icon, Card, CardItem, Item, Body, Right, Button, Input, Form, Textarea, Left } from 'native-base'
import {url} from '../helpers/Helper';
import logo from  '../../assets/images/logo.png';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import firebase from "../../firestore.js";
import PushController from './pushnotification/PushController';
import PushNotification from 'react-native-push-notification';

class BookNow extends Component {
          constructor(props) {
            super(props);
                this.state = {
                    name: null,
                    mobile: null,
                    email:null,
                    msg: null,
                    isSubmited: true,
                    new_booking:0
                };
            this.ref = firebase.firestore().collection('users');
            this.addGevie = this.addGevie.bind(this);
            this.firebaseUpdate = this.firebaseUpdate.bind(this);
           this.handleAppStateChange = this.handleAppStateChange.bind(this);

          }

          firebaseUpdate(){
              let observer = this.ref.onSnapshot(docSnapshot => {
                console.log(`Received doc snapshot: ${docSnapshot}`);
              }, err => {
                console.log(`Encountered error: ${err}`);
              });

          }

          componentDidMount(){
              AppState.addEventListener('change', this.handleAppStateChange);
               this.ref.get()
                .then(function(querySnapshot) {
                  querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());
                });
                });
          }
            addGevie (){
                const self = this;
                 this.ref .add({
                     email:this.state.email,
                     mobile: this.state.mobile,
                     msg: this.state.msg,
                    name: this.state.name
                })
                .then((docRef) => {
                    console.log(docRef);
                    self.setState({new_booking:1});
                })
                .catch((error) => {
                      console.error("Error adding document: ", error);
                });
            }

              componentWillUnmount() {
                AppState.removeEventListener('change', this.handleAppStateChange);
              }

              handleAppStateChange(appState) {
                  console.log('appState:'+ appState);
                  console.log('new booking:'+ this.state.new_booking );
                if (appState === 'background') {
                          console.log('appState background');
                  let date = new Date(Date.now() + (this.state.new_booking * 1000));

                  if (Platform.OS === 'ios') {
                    date = date.toISOString();
                  }

                  PushNotification.localNotificationSchedule({
                    message: "My Notification Message",
                    date,
                  });
                }

                if (appState === 'active') {
                      console.log('appState active');
                    let date = new Date(Date.now() + (this.state.new_booking * 1000));
                    if (Platform.OS === 'ios') {
                      date = date.toISOString();
                    }

                    PushNotification.localNotificationSchedule({
                      message: "My Notification Message",
                      date,
                    });
                }
              }

            render() {
                return (
                  <Container>
                  <Header androidStatusBarColor="#1362af" style={{ backgroundColor: '#1976D2' }}>
                    <Body style = {{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                      <Title>CONTACT</Title>
                    </Body>
                  </Header>
                    <Content>

                      <Card style={styles.postCard}>
                      <View>
                          <CardItem>
                              <Item>
                                  <Input placeholder='Name' onChangeText={(name) => this.setState({name})} />
                              </Item>
                          </CardItem>
                          <CardItem>
                              <Item>
                                  <Input placeholder='Mobile' onChangeText={(mobile) => this.setState({mobile})}  keyboardType = {'phone-pad'}/>
                              </Item>
                          </CardItem>
                          <CardItem>
                              <Item>
                                  <Input placeholder='Email' onChangeText={(email) => this.setState({email})}  keyboardType = {'email-address'}/>
                              </Item>
                          </CardItem>
                              <Form style = {{ marginLeft: 20, marginRight:20 }}>
                                  <Textarea rowSpan={5} bordered placeholder="Type your message" onChangeText={(msg) => this.setState({msg})} />
                              </Form>
                          <CardItem>
                              <Left>
                              </Left>
                              <Body>
                                  <Button success onPress={()=> this.addGevie()}>
                                  <Text>SUBMIT</Text>
                                  </Button>
                              </Body>
                              <Right>
                              </Right>
                          </CardItem>
                      </View>

                      </Card>
                    </Content>
                  </Container>
                );
    }

}
export default BookNow;


const styles = StyleSheet.create({
  loading:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    backgroundColor: '#1C97F7',
  },
  alertText: {
    fontSize:12,
    color: '#ffffff',
  },
  conCard: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 20,
  },
  conCardItem: {
    marginLeft: 5,
    marginTop:5,
  },
  conDetails: {
    fontSize: 15,
    color: 'black',
    marginLeft: 5,
  },
  postCard: {
    marginLeft: 25,
    marginRight: 25,
    marginTop: 20,
    marginBottom: 20,
  }
});
