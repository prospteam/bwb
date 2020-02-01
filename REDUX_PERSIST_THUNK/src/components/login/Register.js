import React, { Component } from 'react';
import { StyleSheet , Image, ScrollView , TouchableOpacity ,Alert} from 'react-native';
import { Container, Header, Content, Item, Input, Icon , Form ,Button ,Text, View, Thumbnail ,Spinner } from 'native-base';
import {url} from '../helpers/Helper';
import logo from  '../../assets/images/logo.png';
import axios from 'axios';

import { Actions } from 'react-native-router-flux';


export default class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            Name           : '',
            Mobile         : '',
            Email          : '',
            Password       : '',
            Username       : '',
            RepeatPassword : '',
            Verification   : '',
            response       : {},
            showAlert            :false,
            email_exist          :false,
            user_exist           :false,
            mobile_exist         :false,
            input_error          :false,
            email_error          :false,
            reg_form             :true,
            spinner              :false
        }
        this.onSubmit           = this.onSubmit.bind(this);

        this.handleSubmit       = this.handleSubmit.bind(this);
        this.onVerify           = this.onVerify.bind(this);
        this.Verified           = this.Verified.bind(this);
    }

    componentDidMount(){
        console.log('isMounted register');
    }

  Verified (){
      this.setState({
          reg_form : true
      });
  }

    handleSubmit(e) {
        e.preventDefault();
            const inputs = {
                Name            :  this.state.Name,
                Mobile          :  this.state.Mobile,
                Email           :  this.state.Email,
                Password        :  this.state.Password,
                Username        :  this.state.Username,
                RepeatPassword  :  this.state.RepeatPassword
            }
         this.onSubmit(inputs);
    }

        onSubmit (data){
                this.setState({spinner:true});
                const api       = url()+'login/register';
                const bodyFormData  =  new FormData();
                const self = this;
                for(var i  = 0; i  < Object.keys(data).length; i++){
                        bodyFormData.append(Object.keys(data)[i],this.state[Object.keys(data)[i]]);
                }
                        bodyFormData.append('POST_TYPE','add');
                        bodyFormData.append('user_type','2');
                axios({
                            method  : 'post',
                            url     : api,
                            data    : bodyFormData,
                            config  : { headers: {'Content-Type': 'multipart/form-data' }}
                    })
                    .then(function(result){
                        console.log(result);
                        self.setState({response:result.data});
                        let res_stats , msg, resp;
                        const res = result.data.response_status;
                        if (res===false) {
                            resp      = result.data.return;
                                if (resp.input_error) {
                                    msg  =  result.data.message;
                                }
                                if (resp.email_error) {
                                    msg  =  result.data.message;
                                }

                                if (result.data.check_user===true) {
                                    msg  =  resp.msg[0];
                                }

                                if (resp.pass_error) {
                                    msg  =  result.data.message;
                                }


                                Alert.alert(
                                  'Error!',
                                  msg,
                                  [
                                    {text: 'OK', onPress: () => self.setState({spinner:false}) },
                                  ],
                                  { cancelable: false }
                                )
                        }else {
                            msg = result.data.message;
                            self.setState(
                                {
                                    Name         : '',
                                    Mobile       : '',
                                    Email        : '',
                                    Password     : '',
                                    Username     : '',
                                    RepeatPassword: '',
                                    spinner:false
                                });
                                Alert.alert(
                                  'Success!',
                                  msg,
                                  [
                                    {text: 'OK', onPress: () => self.setState({reg_form:false,spinner:false}) },
                                  ],
                                  { cancelable: false }
                                )
                        }
                })
        }

        onVerify (){
            console.log( this.state.Verification);
                const api_V       = url()+'Login/verify_Registrants';
                const bodyFormData2  =  new FormData();
                const self = this;
                        bodyFormData2.append('verCode', this.state.Verification);
                axios({
                            method  : 'post',
                            url     : api_V,
                            data    : bodyFormData2,
                            config  : { headers: {'Content-Type': 'multipart/form-data' }}
                    })
                    .then(function(result){
                        const res = result.data.response_status;
                        console.log(result);
                        if (res===false) {
                                Alert.alert(
                                  'Error!',
                                  result.data.message,
                                  [
                                    {text: 'OK', onPress: () => console.log('hehe') },
                                  ],
                                  { cancelable: false }
                                )
                        }else {
                            self.setState(
                                {
                                    Verification:''
                                });
                                Alert.alert(
                                  'Success!',
                                  result.data.msg,
                                  [
                                    {text: 'OK', onPress: () => self.Verified()},
                                  ],
                                  { cancelable: false }
                                )
                        }
                        self.setState({response_Verify:result.data});
                })
        }
  render() {
           if (this.state.reg_form===true) {
               return (
                   <ScrollView  >
                         <View style={styles.container}>
                                 <View style={{height:50}}>
                                 </View>
                               <View style  ={styles.image}>
                                   <Image
                                       source ={logo}
                                   />
                               </View>
                                    <View style ={styles.form}>

                                                     <Item id="Name"  style={[styles.inputs]} >
                                                       <Icon  name='person' />
                                                       <Input placeholder='Name' value={this.state.Name} onClick={this.textClick}  onChangeText={(Name) => this.setState({Name})} />
                                                 </Item>
                                                 <Item  id="Username" ref="Username"  style={styles.inputs}>
                                                       <Icon  name='person' />
                                                       <Input  placeholder='Username' value={this.state.Username}  onChangeText={(Username) => this.setState({Username})} />
                                                 </Item>
                                                  <Item  id="Mobile" ref="Mobile" style={styles.inputs}>
                                                     <Icon type="FontAwesome" name='mobile' style={{ fontSize: 30 }} />
                                                     <Input placeholder='Phone Number' value={this.state.Mobile} keyboardType="phone-pad"   onChangeText={(Mobile) => this.setState({Mobile})}/>
                                                 </Item>
                                                  <Item   ref="Email" id="Email" style={[styles.inputs]}>
                                                     <Icon   name='mail' />
                                                     <Input placeholder='Email Address' value={this.state.Email}   keyboardType="email-address"  onChangeText={(Email) => this.setState({Email})}/>
                                                 </Item>
                                                  <Item   ref="Password" id="Password"  style={styles.inputs}>
                                                     <Icon  name='lock' />
                                                     <Input placeholder='Password' value={this.state.Password} secureTextEntry={true}  onChangeText={(Password) => this.setState({Password})}/>
                                                 </Item>
                                                  <Item style={styles.inputs}>
                                                     <Icon  name='lock' />
                                                     <Input placeholder='Repeat Password' value={this.state.RepeatPassword} secureTextEntry={true}  onChangeText={(RepeatPassword) => this.setState({RepeatPassword})}/>
                                                 </Item>
                                                    {this.state.spinner===true &&
                                                        <Spinner color='red' />
                                                    }
                                                    {this.state.spinner===false &&
                                                        <TouchableOpacity  >
                                                            <Button block ref="buton"  onPress={this.handleSubmit}  type="submit" value="sas" style={styles.btnregister}>
                                                              <Text style={styles.register_text}>Register</Text>
                                                           </Button>
                                                       </TouchableOpacity>
                                                    }

                                               <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                                   <Text style={{marginLeft:'20%'}}>Already a user?</Text>
                                                   <Text style={{color:'#3885B6', marginRight:'20%'}}onPress= {() =>{ Actions.Login();}}>Login Here</Text>
                                               </View>
                                      </View>
                         </View>
                 </ScrollView>
               );
           }else {
               return (

                         <View style={styles.container}>

                               <View style  ={styles.image}>
                                   <Image
                                       source ={require('../../assets/images/logo.png')}

                                   />
                               </View>
                                    <View style ={styles.form}>
                                                     <Item id="Name" ref="Name" style={[styles.inputs]} >
                                                       <Icon  name='lock' />
                                                       <Input  placeholder='Enter Verification Code' value={this.state.Verification} onChangeText={(Verification) => this.setState({Verification})} />
                                                 </Item>

                                                 <TouchableOpacity  >
                                                     <Button block ref="buton"  onPress={this.onVerify}    type="submit" value="sas" style={styles.btnregister}>
                                                       <Text style={styles.register_text}>Submit Verication Code</Text>
                                                    </Button>
                                                </TouchableOpacity>
                                      </View>
                         </View>

               );

           }
          }
}

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
