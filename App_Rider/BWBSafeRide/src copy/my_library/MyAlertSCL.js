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
    render() {
        return (
            <View>
                <SCLAlert
                    show={true}
                    onRequestClose={this.handleClose}
                    theme="info"
                    title="Info"
                    subtitle="You can setup the colors using the theme prop"
                    >
                    {/* <SCLAlertButton theme="info" onPress={this.handleClose}>Done</SCLAlertButton>
                    <SCLAlertButton theme="default" onPress={this.handleClose}>Cancel</SCLAlertButton> */}
                </SCLAlert>
            </View>
        );
    }
}
export default MyAlertSCL; // Don’t forget to use export default!
