import React, {	Component} from 'react';
import { Modal, View, Text, ActivityIndicator } from 'react-native';
var Spinner = require('react-native-spinkit');

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

class CommonProgressBar extends Component {
  render() {
    return(
      <Modal onRequestClose={() => null}>
        <View style={{ flex: 1, backgroundColor: '#dcdcdc', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ borderRadius: 10, backgroundColor: 'white', padding: 25 ,alignItems: 'center'}}>
            <Text style={{ fontSize: 20, fontWeight: '200' }}>Loading.. {"\n"}</Text>

            <Spinner type="9CubeGrid" color="#d3a04c" />
          </View>
        </View>
      </Modal>
    );
  }
}
export default CommonProgressBar; // Don’t forget to use export default!
