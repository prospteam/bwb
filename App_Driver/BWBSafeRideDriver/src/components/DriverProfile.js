import React, { Component } from 'react';
import { TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Actions} from 'react-native-router-flux';
import ValidationComponent from 'react-native-form-validator';
import { Alert, View, StyleSheet, Image, TouchableOpacity, Modal, TouchableHighlight } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Item, ListItem, List, Input, Label } from 'native-base';
import Helpers from '../../Helpers';
import PhotoUpload from 'react-native-photo-upload';
// import RNFetchBlob from 'react-native-fetch-blob';
import RNFS from 'react-native-fs';

var Spinner = require('react-native-spinkit');

export default class DriverProfile extends ValidationComponent {
    static navigationOptions = {
        drawerLabel: 'Driver Profile',
        drawerIcon: () => (
            <Icon type="FontAwesome" name="user" style={{ fontSize: 22 }} />
        )
    };

    constructor(props){
        super(props);
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);

        this.state = {
            userData: [],
            modalVisible: false,
            isLoading: true
        }
    }

    forceUpdateHandler(){
      this.forceUpdate();
    };

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
        this.setUserData();
    }

    componentDidMount(){
        this.setUserData();
        setTimeout(() => {
          this.setState({
            isLoading: false,
            });
          }, 1000);
    }

// <<<<<<< HEAD
//     setUserData = async () => {
//       if(await AsyncStorage.getItem('userData')){
//           const data = JSON.parse(await AsyncStorage.getItem('userData'));
//         this.setState({ userData: data });
//       }
// =======
    updateSubmit(){
        this.validate({
          first_name: {required: true},
          last_name: {required: true},
          email: {email: true, required: true},
          contact_number: {required: true},
          city: {required: true},
          zip_code: {numbers: true, required: true},
          vehicle_number: {required: true},
          vehicle_model: {required: true}
        });

        if(this.isFormValid()){
            fetch(Helpers.api_url+'update_driver_profile', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                login_id: this.state.userData.login_id,
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                contact_number: this.state.contact_number,
                city: this.state.city,
                zip_code: this.state.zip_code,
                user_id: this.state.user_id,
                vehicle_number: this.state.vehicle_number,
                vehicle_model: this.state.vehicle_model
              })

            }).then((response) => response.json())
              .then((responseJson) => {
                console.log('update profile data');
                console.log(this.state);            
                console.log(responseJson);
                 Alert.alert(JSON.stringify(responseJson.msg));
              }).catch((error) => {
                console.error(error);
              });

          }else{
              Alert.alert(this.getErrorMessages());
          }
        }

      updateSubmitDriver = async (e) => {
        if(await AsyncStorage.getItem('userData')){
          const data = JSON.parse(await AsyncStorage.getItem('userData'));
    
          console.log(data);
          console.log(this.state.user_id);
          
          // fetch(Helpers.api_url+'get_profile_driver',{
          //   method: 'POST',
          //   header: {
          //     'Accept': 'application/json',
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify({
          //     login_id: data.login_id
          //   })
          // }).then((response) => response.json())
          //   .then((responseJson) => {
          //   }).catch((error) => {
          //     //console.error(error);
          //   });
    
        }
      }  

      updatePhoto(){
          fetch(Helpers.api_url+'update_photo', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              photo: this.state.photo,
              user_id: this.state.user_id
            })

          }).then((response) => response.json())
            .then((responseJson) => {
              console.log('Photo response');
              console.log(responseJson);
               Alert.alert(responseJson.msg);
            }).catch((error) => {
              console.error(error);
            });
      }

  setUserData = async (e) => {
      if(await AsyncStorage.getItem('userData')){
          const data = JSON.parse(await AsyncStorage.getItem('userData'));
          
          console.log('driver profile data');
          console.log(data);

      fetch(Helpers.api_url+'get_driver_profile', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login_id: data.login_id
       })
      }).then((response) => response.json())
        .then((responseJson) => {
          console.log('response');
          console.log(responseJson);
          console.log(this.state);
          
         if(responseJson.response === 'success')
          {
              this.setState({ userData: responseJson.data });
              this.setState({ first_name: responseJson.data.first_name });
              this.setState({ last_name: responseJson.data.last_name });
              this.setState({ email: responseJson.data.email });
              this.setState({ contact_number: responseJson.data.contact_number });
              this.setState({ city: responseJson.data.city });
              this.setState({ zip_code: responseJson.data.zip_code });
              this.setState({ user_id: responseJson.data.user_id });
              this.setState({ vehicle_number: responseJson.data2.vehicle_number });
              this.setState({ vehicle_model: responseJson.data2.vehicle_model });
              this.setState({ photo: responseJson.data.photo });
          }else{
              Alert.alert('Please provide an Vehicle number and Vehicle Model');
              this.setState({ userData: responseJson.data });
              this.setState({ first_name: responseJson.data.first_name });
              this.setState({ last_name: responseJson.data.last_name });
              this.setState({ email: responseJson.data.email });
              this.setState({ contact_number: responseJson.data.contact_number });
              this.setState({ city: responseJson.data.city });
              this.setState({ zip_code: responseJson.data.zip_code });
              this.setState({ user_id: responseJson.data.user_id });
              this.setState({ vehicle_number: responseJson.data2.vehicle_number });
              this.setState({ vehicle_model: responseJson.data2.vehicle_model });
              this.setState({ photo: responseJson.data.photo });
          }

        }).catch((error) => {
          //console.error(error);
        });

      }
    }

    destroySession = async () => {
      await AsyncStorage.removeItem('userData');
      this.props.navigation.navigate('Logout');
      // Actions.dashboard();
      // PAGE REDIRECTION HERE
    }

    render() {

        const { isLoading } = this.state;
        if(isLoading){
          return (
              <View style={styles.container}>
               <Spinner type="9CubeGrid" color="#d3a04c" />
              </View>
            );
        }
        return (
        <Container>
             <Modal
             animationType="slide"
             transparent={false}
             visible={this.state.modalVisible}
             >
                 <View style={styles.modal}>
                     <View style={{color: '#d3a04c', backgroundColor: '#1c1b22', textAlign: 'center', alignSelf: 'stretch', paddingVertical: 20, marginVertical: 20, color: '#fff'}}>
                         <Text style={{textAlign: 'center', color: '#fff'}}>Update Profile</Text>
                     </View>
                    <View style={styles.inputWrap}>
                        <TextInput style={styles.inputBox2} placeholder="First Name" defaultValue={this.state.userData.first_name} onChangeText={(first_name) => this.setState({first_name})} />
                        <TextInput style={styles.inputBox2} placeholder="Last Name" defaultValue={this.state.userData.last_name} onChangeText={(last_name) => this.setState({last_name})} />
                    </View>
                    <View style={styles.inputWrap}>
                        <TextInput style={styles.inputBox2} placeholder="Email" keyboardType="email-address" defaultValue={this.state.userData.email} onChangeText={(email) => this.setState({email})} />
                        <TextInput style={styles.inputBox2} placeholder="Phone Number" keyboardType="phone-pad" defaultValue={this.state.userData.contact_number} onChangeText={(contact_number) => this.setState({contact_number})} />
                    </View>
                    <View>
                        <Item>
                            <Icon active name='home' />
                            <TextInput style={styles.inputBox} placeholder="City" defaultValue={this.state.userData.city} onChangeText={(city) => this.setState({city})} />
                        </Item>
                        <Item>
                            <Icon active name='home' />
                            <TextInput style={styles.inputBox} placeholder="ZIP Code" keyboardType="number-pad" defaultValue={this.state.userData.zip_code} onChangeText={(zip_code) => this.setState({zip_code})} />
                        </Item>
                        <Item>
                            <Icon active name='car' />
                            <TextInput style={styles.inputBox} placeholder="Vehicle Number" defaultValue={this.state.userData.vehicle_number} onChangeText={(vehicle_number) => this.setState({vehicle_number})} />
                        </Item>
                        <Item>
                            <Icon active name='car' />
                            <TextInput style={styles.inputBox} placeholder="Vehicle Model" defaultValue={this.state.userData.vehicle_model} onChangeText={(vehicle_model) => this.setState({vehicle_model})} />
                        </Item>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity style={styles.modalButtonContainer1} onPress={() => this.updateSubmit() }>
                            <Icon type="FontAwesome" name="edit" style={{ fontSize: 22, color: 'white', paddingRight: 10 }} />
                            <Text style={styles.buttonText}>Update</Text>
                        </TouchableOpacity>
                         <TouchableOpacity style={styles.modalButtonContainer2} onPress={() => { this.setModalVisible(!this.state.modalVisible); }}>
                            <Icon type="FontAwesome" name="window-close" style={{ fontSize: 22, color: 'white', paddingRight: 10 }} />
                             <Text style={styles.buttonText}>Close</Text>
                         </TouchableOpacity>
                     </View>
                 </View>
             </Modal>
          <Header>
           <Left style={{ flexDirection: 'row' }}>
             <Icon onPress={() => this.props.navigation.openDrawer()} name="md-menu" style={{ color: '#d3a04c', marginRight: 15 }} />
           </Left>
           <Right>
             <Button onPress={() => this.destroySession()} ><Text>Log Out</Text></Button>
           </Right>
          </Header>
          <Content>
           <View style={styles.header}></View>
           <View style={styles.body}>
               <PhotoUpload
                  onPhotoSelect={avatar => {
                    if (avatar) {
                      // Alert.alert("data:image/png;base64${avatar}", avatar);
                      console.log(this.state);
                      this.setState({ photo: avatar});
                      this.updatePhoto();
                    }
                  }}
                >
                <Image
                 style={{
                   width: 130,
                   height: 130,
                   borderRadius: 75
                 }}
                 resizeMode='cover'
                 source={(this.state.photo == '' || this.state.photo == null) ? require('../assets/images/avatar.png') : {uri: `data:image/gif;base64,${this.state.photo}`}}
               />

               {/*<Image style={styles.avatar} source={{uri: `data:image/gif;base64,${this.state.userData.photo}`}} />*/}
                <Text style={{textAlign: 'center', color: '#a1a1a1', fontSize: 13}}>Click to update</Text>
               </PhotoUpload>
             <View style={styles.bodyContent}>
               <Text style={styles.name}>{this.state.userData.first_name} {this.state.userData.last_name}</Text>
               <Text style={styles.info}>{this.state.userData.username}</Text>
               <List>
                <ListItem>
                    <Text style={[styles.description, {fontWeight: '600'}]}>Email Address:  </Text>
                    <Text style={styles.description}>{this.state.userData.email}</Text>
                </ListItem>
                <ListItem>
                  <Text style={[styles.description, {fontWeight: '600'}]}>Contact Number:  </Text>
                  <Text style={styles.description}>{this.state.userData.contact_number}</Text>
                </ListItem>
                <ListItem>
                  <Text style={[styles.description, {fontWeight: '600'}]}>Address:  </Text>
                  <Text style={styles.description2}>{this.state.userData.city} {this.state.userData.zip_code}</Text>
                </ListItem>
                <ListItem>
                  <Text style={[styles.description, {fontWeight: '600'}]}>Vehicle Number:  </Text>
                  <Text style={styles.description2}>{this.state.vehicle_number}</Text>
                </ListItem>
                <ListItem>
                  <Text style={[styles.description, {fontWeight: '600'}]}>Vehicle Model:  </Text>
                  <Text style={styles.description2}>{this.state.vehicle_model}</Text>
                </ListItem>
                  <Text> </Text>
              </List>
               <TouchableOpacity style={styles.buttonContainer} onPress={() => { this.setModalVisible(true); }}>
                 <Icon type="FontAwesome" name="edit" style={{ fontSize: 22, color: 'white', paddingRight: 10 }} />
                 <Text style={styles.buttonText}>Update Profile</Text>
               </TouchableOpacity>
             </View>
         </View>
          </Content>
          <Footer>
              <FooterTab style={{backgroundColor:"#1c1b22"}}>
                  <Button vertical onPress={() => this.props.navigation.navigate('Dashboard')}>
                      <Icon name="apps" />
                      <Text>Dashboard</Text>
                  </Button>
              </FooterTab>
          </Footer>
         </Container>
       );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: undefined,
        height: undefined
    },
    header: {
        backgroundColor: "#d3a04c",
        height: 50,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom:10,
        alignSelf:'center',
        position: 'absolute',
        marginTop: 30,
        backgroundColor: "white"
    },
    body:{
        marginTop:40,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding:30,
    },
    name:{
        fontSize:28,
        color: "#696969",
        fontWeight: "600",
        textTransform: 'capitalize'
    },
    info:{
        fontSize:16,
        color: "#d3a04c",
        marginTop:10
    },
    description:{
        fontSize:14,
        color: "#696969"
    },
    description2:{
        fontSize:14,
        color: "#696969",
        textTransform: 'capitalize'
    },
    buttonContainer: {
        marginTop:10,
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width:250,
        borderRadius:30,
        backgroundColor: "#d3a04c",
    },
    buttonText: {
        color: '#fff'
    },
    modalButtonContainer1: {
        marginTop: 20,
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width: 150,
        borderRadius:30,
        backgroundColor: '#d3a04c',
        marginRight: 10
    },
    modalButtonContainer2: {
        marginTop: 20,
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width: 150,
        borderRadius:30,
        backgroundColor: '#660000',
        marginLeft: 10
    },
    modal: {
        backgroundColor: '#ddd',
        alignSelf: 'center',
        alignItems: 'center',
        padding: 30
    },
    inputWrap: {
        flexDirection: 'row'
    },
    inputBox: {
        width: 300,
        backgroundColor: '#eeeeee',
        borderRadius: 2,
        paddingHorizontal: 16,
        fontSize: 14,
        color: '#4d4d4d',
        marginVertical: 10,
        paddingVertical: 8
    },
    inputBox2: {
        width: 145,
        backgroundColor: '#eeeeee',
        borderRadius: 2,
        paddingHorizontal: 16,
        fontSize: 14,
        color: '#4d4d4d',
        marginVertical: 10,
        marginLeft: 5,
        marginRight: 5,
        paddingVertical: 8
    }
});
