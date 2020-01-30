// Dependencies
import React, { Component } from 'react';
import { Button, Dimensions, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { globalStyles } from '../assets/globalStyles';

// Actions
import { login } from '../redux/actions/authActions';
import { decreaseCounter,increaseCounter } from '../redux/actions/counterActions';

//Dimensions
const { height, width } = Dimensions.get('window');


//Counter
class Counter extends React.Component{
    render (){
        return (
            <SafeAreaView style={globalStyles.container}>
                <View style={globalStyles.loggedInContainer}>
                    <Text style={globalStyles.logedInText}>Logged In:</Text>
                    <Text style={globalStyles.logedInText}>{`${this.props.loggedIn}`}</Text>
                    <Button title="Login" onPress={this.props.loggedIn === false ? () => this.props.reduxLogin(true) : () => this.props.reduxLogin(false)}
                    style={globalStyles.loginButton}/>
                </View>
                <Text style={globalStyles.counterTitle}>
                    Counter
                </Text>
                <View style={globalStyles.counterContainer}>
                    <TouchableOpacity onPress={() => this.props.reduxIncreaseCounter()}>
                        <Text style={globalStyles.buttonText}>+</Text>
                    </TouchableOpacity>
                    <Text style={globalStyles.counterTitle}>
                        {this.props.counter}
                    </Text>
                    <TouchableOpacity onPress={() => this.props.reduxDecreaseCounter()}>
                        <Text style={globalStyles.buttonText}>-</Text>
                    </TouchableOpacity>

                </View>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = (state) => ({
        counter: state.counterReducer.counter,
        loggedIn: state.authReducer.loggedIn,
});

//const mapStateToProps = (state) => {
//    return {
//        counter: state.counterReducer.counter,
//        loggedIn: state.authReducer.loggedIn,
//    };
//};

const mapDispatchToProps = (dispatch) => {
  // Action
    return {
      // Increase Counter
        reduxIncreaseCounter: () => dispatch(increaseCounter()),
      // Decrease Counter
        reduxDecreaseCounter: () => dispatch(decreaseCounter()),
      // Login
        reduxLogin: (trueFalse) => dispatch(login(trueFalse)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
