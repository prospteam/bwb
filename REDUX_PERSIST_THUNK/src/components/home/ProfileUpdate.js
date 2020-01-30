import React, { Component } from 'react';
import { Alert, View, StyleSheet, Switch, TouchableOpacity, Image,YellowBox ,ImageBackground  } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Item, Input, Text, ListItem, Separator ,List, Thumbnail} from 'native-base';
import {url} from '../helpers/Helper';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';

// styles
import formStyles from '../../assets/styles/FormStyles';
import commonStyles from '../../assets/styles/CommonStyles';

export default class ProfileUpdate extends Component {
    constructor(props){
        super(props);
        this.state = {
            Name: '',
            Email: '',
            Phone: '',
            userid: 0,
        }
        this.onSubmit=this.onSubmit.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }

    componentDidMount(){
        this.getData();
    }

    async getData() {
        try {
            let userData = await AsyncStorage.getItem("userData");
            let data = JSON.parse(userData);
            this.setState( {userid: data.userid} );

            this.getProfile();
        } catch (error) {
            console.log("Something went wrong", error);
        }
    }

    async getProfile() {
        const self = this;
        profileData = new FormData();
        profileData.append('userid', this.state.userid);
        await axios({
            method  : 'post',
            url     : url()+'apis/get_profile',
            data    : profileData,
            config  : { headers: {'Content-Type': 'multipart/form-data' }}

        })
        .then(function(result){
            if(result.data.response_status) {
                self.setState({
                    Email: result.data.data.email,
                    Name: result.data.data.name,
                    Phone: result.data.data.contact_number,
                });
            }
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const inputs = {
            Email        :  this.state.Email,
            Name        :  this.state.Name,
            Phone        :  this.state.Phone,
        }
         this.onSubmit(inputs);
    }

    onSubmit (data){
        const api = url()+'apis/forgotpasswordrequest';
        const bodyFormData  =  new FormData();

        for(var i  = 0; i  < Object.keys(data).length; i++){
                bodyFormData.append(Object.keys(data)[i],this.state[Object.keys(data)[i]]);
        }
        axios({
            method  : 'post',
            url     : api,
            data    : bodyFormData,
            config  : { headers: {'Content-Type': 'multipart/form-data' }}
        })
        .then((res) => {
            this.setState( {errMsg: res.data.message} );

            if(res.data.response_status == true){
                this.props.navigation.navigate('ResetPasswordValidation');
            }
        });
    }

    render() {
        console.log(this.state);
        return (
             <Container>
                <Header style={{ backgroundColor: '#A31510' }} transparent>
                    <Left>
                        <Button transparent>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
                                <Icon name='arrow-back' style={{color: 'white', marginLeft: 10}} />
                            </TouchableOpacity>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Edit Profile</Title>
                    </Body>
                </Header>

                <Content>
                    <View style={commonStyles.content}>
                        <View style={formStyles.formGroup}>
                            <Text style={formStyles.label}>Name:</Text>
                            <Item style={formStyles.inputs}>
                                <Input value={this.state.Name} onChangeText={(Name) => this.setState({Name})}/>
                            </Item>
                        </View>

                        <View style={formStyles.formGroup}>
                            <Text style={formStyles.label}>Email:</Text>
                            <Item style={formStyles.inputs}>
                                <Input value={this.state.Email} keyboardType="email-address" onChangeText={(Email) => this.setState({Email})}/>
                            </Item>
                        </View>

                        <View style={formStyles.formGroup}>
                            <Text style={formStyles.label}>Phone:</Text>
                            <Item style={formStyles.inputs}>
                                <Input value={this.state.Phone} keyboardType="phone-pad" onChangeText={(Phone) => this.setState({Phone})}/>
                            </Item>
                        </View>
                        <Button block type="submit" style={formStyles.submitBtn} onPress={this.handleSubmit}>
                            <Text>Submit</Text>
                        </Button>

                    </View>
                </Content>
             </Container>
           );
    }
}
