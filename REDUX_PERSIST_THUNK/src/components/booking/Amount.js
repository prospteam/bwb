import React, { Component } from 'react';
import { StyleSheet , Image, ScrollView , TouchableOpacity ,Alert} from 'react-native';
import { Container, Header, Content, Item, Input, Icon , Form ,Button ,Text, View, Thumbnail ,Spinner } from 'native-base';
import {connect} from 'react-redux';

class Amount extends Component {
  render() {
    return (
      <Container>
            <Text>
                {this.props.edu_details.name}
            </Text>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        edu_details:state.edu_details
    }
}

export default connect(mapStateToProps)(Amount);
