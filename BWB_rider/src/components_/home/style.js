const React = require('react-native')
import { Dimensions } from 'react-native';
const { StyleSheet } = React
const constants = {
    actionColor: '#24CE84'
};
var styles = StyleSheet.create({
    contentContainer: {
        marginTop: 50
    },
    inputs: {
        borderColor: '#e3e3e3',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderRadius: 5,
        width: 150
    },
    bookingHeader: {
        paddingHorizontal: 5,
        fontSize: 20,
        fontWeight: "800",
        textAlign: 'center',
        marginBottom: -20,
        color: 'white',
        marginTop: -15
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    animated: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    adddestinationView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    },
    infocircleView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center"
    },
    infocircleTouchableOpacity: {
        flexDirection: 'column', backgroundColor: '#fff', color: '#A31510', width: '40%', borderRadius: 5, marginLeft: '25%', height: 40, marginTop: 5, marginBottom: 10, alignItems: 'center', justifyContent: "center"
    },
    adddestinationTouchableOpacity: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    parentview1: {
        flexDirection: 'row', alignItems: 'center', marginTop: 0, marginBottom: 5 
    },
    parentview2: {
        flexDirection: 'row', alignItems: 'center', marginTop: 0, marginBottom: -2
    },
    done: {
        flexDirection: 'column', backgroundColor: '#fff', color: '#A31510', width: '40%', borderRadius: 5, marginLeft: '25%', height: 40, marginTop: 5, marginBottom: 10, flexDirection: 'column', alignItems: 'center', justifyContent: "center"
    },
    adddestinationIcon: {
        fontSize: 20,
        color: '#fff',
        marginLeft: 25,
        marginRight: 10
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: undefined,
        height: undefined
    }
})

module.exports = styles
module.exports.constants = constants;
