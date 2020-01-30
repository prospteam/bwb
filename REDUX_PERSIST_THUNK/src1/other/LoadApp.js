// Dependencies
import React, { Component } from 'react';
import { Button, Dimensions, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';

// Actions
//import { login } from '../redux/actions/authActions';
//import { decreaseCounter,increaseCounter } from '../redux/actions/counterActions';

//Dimensions
//const { height, width } = Dimensions.get('window');


//Counter
class LoadApp extends React.Component{
    render (){
        return (
			
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'center',
        alignItems: 'center',

    },
    loggedInContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems:'center',
        marginBottom:40,

    },
    loginButton: {
        marginTop:20,
        paddingTop:20,

    },
    counterContainer: {
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems: 'center',
    },
    loggedInText:{
        fontFamily:'System',
        fontSize:17,
        fontWeight:'400',
        color: '#000',
    },
    counterTitle: {
        fontFamily:'System',
        fontSize:32,
        fontWeight:'700',
        color:'#000',

    },
    buttonText:{
        fontFamily:'System',
        fontSize:50,
        fontWeight:'300',
        color:'#007AFF',
        marginLeft:40,
        marginRight:40,
    },

});

const mapStateToProps = (state) => {
    return {
        counter: state.counterReducer.counter,
        loggedIn: state.authReducer.loggedIn,
    };
};

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
