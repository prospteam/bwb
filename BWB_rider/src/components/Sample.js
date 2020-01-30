import React from 'react';
import {Text} from 'react-native';

const Sample = (props) => {
    return(
        <Text>This is a sample. {props.sampleAttr}</Text>
    );
};

export default Sample;
