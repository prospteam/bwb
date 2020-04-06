import React, { Component } from 'react';
import { Footer, FooterTab, Button, Icon, Text } from 'native-base';

export default class FooterSection extends Component {
    render(){
        return(
            <Footer>
                <FooterTab style={{backgroundColor:"#1c1b22"}}>
                    <Button vertical active>
                        <Icon active name="map" />
                        <Text>Book Now</Text>
                    </Button>
                </FooterTab>
            </Footer>
        );
    }
}
