import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 10,
    borderWidth: 1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: '#d2843b'
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center'
  },
  label1: {
    fontSize: 14,
    color: '#676767',
  },
  hr: {
    borderBottomColor: '#d9d9d9',
    borderBottomWidth: 2,
    marginBottom:10,
    marginTop:10,
  },
  center_pick_icon:{
    position:'absolute',
    top:'50%',
    left:'50%',
    marginLeft: -14,
    marginTop: -52,
    color: 'blue',
    fontSize: 50
  }
});
