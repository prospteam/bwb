import React, { Component } from 'react';
import { StyleSheet , Image, ScrollView , TouchableOpacity ,Alert} from 'react-native';
import { Container, Header, Content, Item, Input, Icon , Form ,Button ,Text, View, Thumbnail ,Spinner } from 'native-base';
import {url} from '../helpers/Helper';
import logo from  '../../assets/images/logo.png';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import Amount from  './Amount.js';
import Paypal from  './Paypal.js';
import {connect} from 'react-redux';


class PayNow  extends Component{
    constructor(props){
        super(props);
        this.state = {
                hehe:[
                    {
                        question :'a',
                        answer   :'a',
                        option   :['1','2','3','4']
                    }
                ]
        }
    }
    render(){
        console.log(this.props.locations);
        return(
             <Container>
                         <Text>Redux</Text>
                         <Button onPress={this.props.increment}><Text>Plus</Text></Button>
                         <Button onPress={this.props.decrement}><Text>Minus</Text></Button>
                         <Button onPress={this.props.BookingDetails}><Text>Minus</Text></Button>
              </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        locations:state.locations,
        // counter:state.counter,
    }
}

const mapPropsToDispatch = (dispatch) => {
    return {
            BookingDetails: () => dispatch({type : {
                question :'a',
                answer   :'a',
                option   :['1','2','3','4']
            }
            }),
            increment: () => dispatch({type:'KITA'}),
            decrement: () => dispatch({type:'DI_KITA'}),
            alvin_handle_changes: (e) => dispatch({type:'HANDLE',payload:e,state_name:'alvin_details'}),
            edu_handle_changes: (e) => dispatch({type:'HANDLE',payload:e,state_name:'edu_details'}),
    }
}

export default connect(mapStateToProps,mapPropsToDispatch)(PayNow);
