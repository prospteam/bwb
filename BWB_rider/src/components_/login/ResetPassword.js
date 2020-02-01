import React, { Component } from 'react';
import { StyleSheet , Image, ScrollView } from 'react-native';
import { Item, Input, Button ,Text, View } from 'native-base';
import logo from '../../assets/images/logo.png';
import { Actions } from 'react-native-router-flux';

export default class ResetPassword extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            errMsg: '',
            userInfo: {},
        }
    }

  render() {

    return (
        <ScrollView style= {{ marginBottom: '10%'}} >
              <View style={styles.container}>
                    <View style={{height:100}}></View>
                    <View style  ={styles.image}>
                        <Image source ={logo} />
                    </View>

                    <View>
                        <Text style={styles.heading}>Reset your password</Text>

                        <Item style={styles.inputs}>
                            <Input placeholder='New password' value={this.state.username}   onChangeText={(username) => this.setState({username})}/>
                        </Item>

                        <Item style={styles.inputs}>
                            <Input placeholder='Re-enter new password' value={this.state.username}   onChangeText={(username) => this.setState({username})}/>
                        </Item>

                        <Button block  onPress={this.handleSubmit}  type="submit" style={styles.loginBtn}>
                            <Text style={{marginTop: -10}}>Change Password</Text>
                        </Button>
                        <Text style={{color:'#3885B6', marginRight:'20%'}} onPress={() => this.props.navigation.navigate('Login')}>Return to Login</Text>

                    </View>

              </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
    centerText: {
        width: '100%', justifyContent: 'center', alignItems: 'center'
    },
    heading: {
        fontSize: 24,
        color: '#910506',
        marginBottom: 10
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30
    },
    errorMessage:{
        backgroundColor: '#dd4b39',
        padding: 7,
        marginBottom: 10,
        color: '#fff'
    },
    container: {
        paddingHorizontal: 15,
        flex: 1,
        justifyContent: 'center',

    },
    inputs:{
        borderColor: 'gray',
        borderLeftWidth:0.5 ,
        borderRightWidth:0.5 ,
        borderBottomWidth:0.5 ,
        borderTopWidth:0.5 ,
        borderRadius:3,
        paddingHorizontal: 10,
        marginBottom: 8
    },
    loginBtn:{
        marginTop:'8%',
        marginBottom:'5%',
        backgroundColor: '#910506',
        borderRadius:3,
    }

});
