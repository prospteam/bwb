const React = require('react-native')
const { StyleSheet } = React
const constants = {
    actionColor: '#24CE84'
};

var mapstyles2 = StyleSheet.create({
    textInput: {
        marginLeft: 0,
        marginRight: 0,
        height: 38,
        color: '#5d5d5d',
        fontSize: 16
    },
    predefinedPlacesDescription: {
        color: '#1faadb'
    },
    textInputContainer: {
        backgroundColor: 'white',
        borderTopWidth: 0,
        borderColor: 'gray',
        borderBottomWidth: 2,
        borderRadius: 10,
        width: '97%'

    },

    map: {
        ...StyleSheet.absoluteFillObject,
    },
    padding: { padding: 20 },
    textInput: {
        borderRadius: 0,
        paddingLeft: 10,
        paddingVertical: 10,
    },
    description: {
        fontWeight: 'bold'
    },
    predefinedPlacesDescription: {
        color: 'red'
    },
    listView: {}
})

module.exports = mapstyles2
module.exports.constants = constants;
