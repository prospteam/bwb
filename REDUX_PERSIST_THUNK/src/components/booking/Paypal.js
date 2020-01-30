import React, { Component } from 'react';
import RNPaypal from 'react-native-paypal-lib';
import {
    StyleSheet, Image, ScrollView, TouchableOpacity
} from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Badge } from 'native-base';
import firebase from "../../firestore.js";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getDatas, getDatasThunk, getsingleData, getCalculations } from '../../actions/index.js';
class Paypal extends Component {
    constructor(props) {
        super(props);
        this.pay = this.pay.bind(this);
        this.ref = firebase.firestore().collection('Booking_Payments');
    }
    componentDidMount() {
        console.log('paypal mounted');
    }

    pay() {
        const self = this;
        RNPaypal.paymentRequest({
            clientId: 'AaPrAOxKMOYWEDsEmuj5SP4ZK3sCc6qPk3sj0fFo8aIUn6POWZu3p_HRHlrnBrP1M1YT-Ku9C8bszInX',
            environment: RNPaypal.ENVIRONMENT.SANDBOX,
            intent: RNPaypal.INTENT.ORDER,
            price: parseFloat(self.props.ApiData.calculations.total_fare),
            currency: 'USD',
            description: `MAXI Booking Payment`,
            acceptCreditCards: false
        })
            .then(response => {
                this.ref.doc(response.response.id).set({
                    driver: '',
                    date_time: response.response.create_time,
                    ride_status: '1',
                    rider_id: '1982771702Esz5i0ft6vb'
                })
                    .then((docRef) => {
                        console.log(docRef);
                        self.props.getsingleData('FIND_DRIVER_DATA', true)
                    })
                    .catch((error) => {
                        console.error("Error adding document: ", error);
                    });
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    render() {
        return (
            <TouchableOpacity style={{
                flexDirection: 'row',marginTop:20, backgroundColor: '#BC171B', color: '#A31510', width: '100%', borderRadius: 5, height: 50, marginBottom: 10, alignItems: 'center', justifyContent: "center"
            }} onPress={this.pay}>
                <Text style={{ fontWeight: "bold",color:'#fff' }}>Cofirm Now</Text>
            </TouchableOpacity>
        );
    }
}
const mapStateToProps = (state) => {
    console.log('redux', state);
    return {
        ApiData: state.ApiData
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        getDatas: getDatas,
        getDatasThunk: getDatasThunk,
        getsingleData: getsingleData,
        getCalculations: getCalculations
    }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Paypal);
