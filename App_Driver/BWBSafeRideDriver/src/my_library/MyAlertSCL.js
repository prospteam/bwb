import React, { Component } from 'react';
import { Modal, View, Text, ActivityIndicator } from 'react-native';
var Spinner = require('react-native-spinkit');
import {
    SCLAlert,
    SCLAlertButton
} from 'react-native-scl-alert'

// const CommonProgressBar = ({ visible }) => (
//   <Modal onRequestClose={() => null} visible={visible}>
//     <View style={{ flex: 1, backgroundColor: '#dcdcdc', alignItems: 'center', justifyContent: 'center' }}>
//       <View style={{ borderRadius: 10, backgroundColor: 'white', padding: 25 }}>
//         <Text style={{ fontSize: 20, fontWeight: '200' }}>Loading</Text>
//         <ActivityIndicator size="large" />
//       </View>
//     </View>
//   </Modal>
// );
// import React, { Component } from 'react';

class MyAlertSCL extends Component {

    state = {
        show: true,
    }

    handleClose = () => {
        this.setState({ show: false });
    }
    
    render() {
        console.log("this.propsxx");
        console.log(this.props);
        
        return (
            <SCLAlert
                show={this.state.show}
                onRequestClose={this.handleClose}
                theme="info"
                title={this.props.alert_title}
                subtitle={this.props.alert_message}
            >
                <SCLAlertButton theme="info" onPress={this.handleClose}>Done</SCLAlertButton>
                <SCLAlertButton theme="default" onPress={this.handleClose}>Cancel</SCLAlertButton>
            </SCLAlert>
        );
    }
}
export default MyAlertSCL; // Don’t forget to use export default!
