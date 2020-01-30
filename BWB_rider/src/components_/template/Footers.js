import React, { Component } from 'react';
import { Alert, View, StyleSheet, Switch, TouchableOpacity, Image ,BackHandler, Platform, Dimensions, ImageBackground , ScrollView} from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text,Badge } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import styles from "../template/style";
import {connect}  from 'react-redux';

export default class Footers extends Component {
    constructor(props){
        super(props);
        this.state = {
            active :''
        }
    }

    render() {
        return (
               <Footer style={{height:70}}>
                     <FooterTab style={{ backgroundColor: '#A31510'}}>
                           <Button badge vertical  style={(this.state.active===2) ? styles.active : styles.inactive} onPress={()=>this.setState({active:2})} >
                            <Badge><Text>2</Text></Badge>
                             <Icon name="car" style={{color:'#fff'}} />
                              <Text style={styles.footertext}>Book A Ride</Text>
                           </Button>
                         <Button badge vertical  style={(this.state.active===3) ? styles.active : styles.inactive} onPress={()=>this.setState({active:3})} >
                             <Badge ><Text>51</Text></Badge>
                             <Icon active name="clock"  style={{color:'#fff'}}/>
                              <Text style={styles.footertext}>Trip History</Text>
                           </Button>
                            <Button badge vertical  style={(this.state.active===4) ? styles.active : styles.inactive} onPress={()=>this.setState({active:4})} >
                            <Badge ><Text>51</Text></Badge>
                             <Icon name="md-pin" style={{color:'#fff'}}   />
                                  <Text style={styles.footertext}>Pinned Locations</Text>
                           </Button>
                     </FooterTab>
               </Footer>
        );

    }
}

const s = StyleSheet.create({

    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: undefined,
      height: undefined
  },


});
