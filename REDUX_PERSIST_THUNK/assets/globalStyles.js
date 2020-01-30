import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
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
