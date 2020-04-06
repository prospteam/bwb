import React from 'react';
import {Text, View, Button} from 'react-native';

import { getData } from '../my_library/FirestoreCrud.js';

const sampleProcess = async () => {
    console.log("start");
    let asd = await console.log(getData('pending', '123', ''));
    console.log(asd);
    console.log("asd");
}

const Sample = (props) => {
    return(
        <View>
            <Button
                onPress={() => sampleProcess()}
                title="Press MeSS">
            </Button>
        </View>
    );
};
export default Sample;