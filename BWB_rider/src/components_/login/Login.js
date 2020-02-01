import React, { Component } from 'react';
import { StyleSheet , Image, ScrollView, Alert } from 'react-native';
import { Item, Input, Icon , Form ,Button ,Text, View , Spinner} from 'native-base';
import logo from '../../assets/images/logo.png';
import {url} from '../helpers/Helper';
import axios from 'axios';
import { setData, set_TRUE_FALSE } from '../../actions';
import { connect} from 'react-redux';
import { bindActionCreators} from 'redux';
import { Actions } from 'react-native-router-flux';


 class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            errMsg: '',
            userInfo: {},
            is_Logged : false,
            spinner : false
        }

        this.onSubmit=this.onSubmit.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }


    
    // handleSubmit(e) {
    //     e.preventDefault();
    //     this.setState({
    //         spinner:true,
    //         errMsg:''
    //     });
    //     const inputs = {
    //         username        :  this.state.username,
    //         password        :  this.state.password
    //     }
    //     setTimeout(() => {
    //         this.setState({spinner:false});
    //          this.onSubmit(inputs);
    //     }, 500);

    // }
    // onSubmit (data){
    //     const self = this;
    //     const api = url()+'apis/authenticate';
    //     const bodyFormData  =  new FormData();

    //     for(var i  = 0; i  < Object.keys(data).length; i++){
    //             bodyFormData.append(Object.keys(data)[i],this.state[Object.keys(data)[i]]);
    //     }
    //     axios({
    //         method  : 'post',
    //         url     : api,
    //         data    : bodyFormData,
    //         config  : { headers: {'Content-Type': 'multipart/form-data' }}
    //     })
    //     .then((res) => {
    //         this.setState( {userInfo: res.data.userdata, errMsg: res.data.msg} );
    //         if(res.data.response_status == true){
    //             self.props.set_TRUE_FALSE('SET_TRUE_FALSE', data = { state: 'isLoggedIn'} );
    //             self.props.setData('SET_DATA', data = { state: 'loggedinData', value: res.data.userdata} );
    //             Actions.Dashboard();
    //         }

    //     });
    // }


  render() {
      return (

      );
    // return (
    //     <ScrollView style= {{ marginBottom: '10%'}} >
    //           <View style={styles.container}>
    //                 <View style={{height:100}}></View>
    //                 <View style  ={styles.image}>
    //                     <Image source ={logo} />
    //                 </View>

    //                 { this.state.errMsg != '' ? (
    //                     <Text style={styles.errorMessage}> {this.state.errMsg} </Text>
    //                 ) : null  }

    //                 <View>
    //                     <Item style={styles.inputs}>
    //                         <Icon  name='person' />
    //                         <Input placeholder='Username / Email Address' value={this.state.username} keyboardType="email-address" onChangeText={(username) => this.setState({username})}/>
    //                     </Item>
    //                     <Item style={styles.inputs}>
    //                         <Icon  name='lock' />
    //                         <Input placeholder='Password' value={this.state.password} secureTextEntry={true} onChangeText={(password) => this.setState({password})}/>
    //                     </Item>
    //                     <Text style={{color:'#3885B6', marginTop: 20}}  onPress= {() =>{ Actions.ForgotPassword();}}>Forgot password?</Text>
    //                     {this.state.spinner===true &&
    //                         <Spinner color='red' />
    //                     }
    //                     {this.state.spinner===false &&
    //                         <Button block  onPress={this.handleSubmit}  type="submit" style={styles.loginBtn}>
    //                             <Text style={{marginTop: -15}}>Log in</Text>
    //                         </Button>
    //                     }

    //                     <View style={styles.centerText}>
    //                         <Text>New User? <Text style={{color:'#3885B6', marginRight:'20%'}}  onPress= {() =>{ Actions.Register();}} > Sign up for an account</Text></Text>
    //                     </View>

    //                 </View>

    //           </View>
    //   </ScrollView>
    // );
  }
}

// function reduxState(state){
//     console.log('redaux stae from lgin ', state)
//     return {
//         RiderReducer: state.RiderReducer
//     }
// }

// function dispatchState(dispatch){
//     return bindActionCreators({
//         setData        : setData,
//         set_TRUE_FALSE : set_TRUE_FALSE,
//     },dispatch);
// }
// export default connect(reduxState,dispatchState)(Login);

// const styles = StyleSheet.create({
//     centerText: {
//         width: '100%', justifyContent: 'center', alignItems: 'center'
//     },
//     image: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 30
//     },
//     errorMessage:{
//         backgroundColor: '#dd4b39',
//         padding: 7,
//         marginBottom: 10,
//         color: '#fff'
//     },
//         container: {
//         paddingHorizontal: 15,
//         flex: 1,
//         justifyContent: 'center',

//     },
//     inputs:{
//         borderColor: 'gray',
//         borderLeftWidth:0.5 ,
//         borderRightWidth:0.5 ,
//         borderBottomWidth:0.5 ,
//         borderTopWidth:0.5 ,
//         borderRadius:3,
//         paddingHorizontal: 10,
//         marginBottom: 8
//     },
//     loginBtn:{
//         marginTop:'8%',
//         marginBottom:'5%',
//         backgroundColor: '#910506',
//         borderRadius:3,
//     }

// });
