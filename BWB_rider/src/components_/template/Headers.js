import React, { Component } from 'react';
import { Alert, View, StyleSheet, Switch, TouchableOpacity, Image ,BackHandler, Platform, Dimensions, ImageBackground , ScrollView} from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text,Badge } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import styles from "../template/style";




export default class Headers extends Component {
    constructor(props){
        super(props);
        this.state = {
            active :false,
            route  :false
        }
        this.toggle = this.toggle.bind(this);
    }
        componentDidMount(){

        }

        toggle(){
            this.setState({active: !this.state.active});
        }


    render() {
        if (this.state.route) {
            return (
                <Header style={{ backgroundColor: '#A31510' }} transparent>
                      <Left>
                        <Button transparent>
                          <TouchableOpacity onPress={()=>Actions.drawerOpen()}>
                                  <Icon name='menu' style={{color: 'white', marginLeft: 10}} />
                          </TouchableOpacity>
                        </Button>
                      </Left>
                  <Right>

                          <Button transparent  style={(this.state.active) ? styles.active : styles.inactive} onPress={this.toggle} >
                                <Text style={{color:'#fff'}} > </Text>
                                <Icon name="bulb" style={{color:'#fff'}} />
                                <Badge><Text>2</Text></Badge>
                          </Button>

                  </Right>
                 </Header>
            );
        }else {
            return (
                <Header style={{ backgroundColor: '#A31510' }} transparent>
                     <Left>
                           <Button transparent>
                             <TouchableOpacity onPress={() =>Actions.Dashboard() }>
                             <Icon name='arrow-back' />
                             </TouchableOpacity>
                             <Text>Back</Text>
                           </Button>
                     </Left>
                     <Body>
                        <Title>Booking Details</Title>
                     </Body>
               </Header>
            );
        }


    }
}
