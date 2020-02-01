const React = require("react-native");
const { Platform, Dimensions } = React;

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

export default {
  drawerCover: {

    height: deviceHeight,
    width: null,
    position: "relative"
  },
  drawerImage: {
    position: "absolute",
    left: Platform.OS === "android" ? deviceWidth / 15 : deviceWidth / 14,
    top: Platform.OS === "android" ? deviceHeight / 14 : deviceHeight / 13,
    width: 85,
    height: 85,
    resizeMode: "cover",
    borderRadius: 150 / 2,
    overflow: "hidden",
    borderWidth: 5,
    borderColor: "#fff"
  },
  text: {
    fontWeight: Platform.OS === "ios" ? "400" : "300",
    marginLeft: 15,
    width: 110,
  },
  badgeText: {
    fontSize: Platform.OS === "ios" ? 13 : 11,
    fontWeight: "400",
    textAlign: "center",
    marginTop: Platform.OS === "android" ? -2 : undefined
  },
  innerText:{
     color:'white',
     fontSize: 15,
    textTransform: 'uppercase',
    marginTop: 120
   },

   footertext:{
       width:120,
       color:'#fff',
   },
   active: {
   backgroundColor:'gray',
   height:70
 },
 inactive : {
      backgroundColor:null
 },
  tabStyle :{
      backgroundColor:'#fff',
      color:'black'
  },
  blacks :{
      color:'black'
  },
  tabbg_white:{
      backgroundColor:'#F0F0F0'
  },
  avatar :{
      marginLeft:10,
      borderRadius: 100 / 2,
      overflow: "hidden",
      borderWidth: 3,
      borderColor: "#BC171B"
  },
  avatar_drivr_bookingdetails :{

      borderRadius: 100 / 4,
      overflow: "hidden",
      borderWidth: 3,
      borderColor: "#BC171B"
  },
  listitem_box:{
        backgroundColor:'#F0F0F0',
        height:120,
        borderColor:'red',
        borderRadius:10,
        marginBottom:10,
        borderWidth: 1,
         borderColor: '#ddd',
         shadowOpacity: 0.8,
         shadowRadius: 2,
         elevation: 1
  },
  listitem_box_booking_details:{
        backgroundColor:'#F0F0F0',
  },
  listitem_box_for_book:{
        backgroundColor:'#F0F0F0',
        height:70,
        borderColor:'red',
        borderRadius:10,
        marginBottom:10,
        borderWidth: 1,
         borderColor: '#ddd',
         shadowOpacity: 0.8,
         shadowRadius: 2,
         elevation: 1

  },
  listitem_box_for_book_footer:{
      shadowOffset:{  width: 30,  height: 30,  },
        shadowColor: 'black',
        shadowOpacity: 4.0,
        marginRight:20,
        marginLeft:20,
      backgroundColor:'#F0F0F0',


  },
  listitem_box_rider:{
        backgroundColor:'#F0F0F0',
        height:90,
        borderColor:'red',
        borderRadius:10,
        marginBottom:10,
        borderWidth: 1,
         borderColor: '#ddd',
         shadowOpacity: 0.8,
         shadowRadius: 2,
         elevation: 1
  },
  listitem_box_rider_for_booking_details:{
        backgroundColor:'#F0F0F0',
        height:80,
        borderRadius:10,
        borderWidth: 1,
         borderColor: '#ddd',
         shadowOpacity: 0.3,
         shadowRadius: 0,
         elevation: -5
  },
  list:{
        marginTop:3
  },
  list2:{
        marginTop:-30,
  },
  Bookinglist:{
      shadowOffset:{  width: 30,  height: 30,  },
        shadowColor: 'black',
        shadowOpacity: 4.0,
        marginTop:12,
        marginRight:10,
        borderWidth: 1,
         borderColor: '#ddd',
         shadowOpacity: 0.8,
         shadowRadius: 2,
         elevation: 1,
                 borderRadius:10,
                 marginLeft:10

  },
  RiderProfileImage: {
    position: "absolute",
    left: Platform.OS === "android" ? deviceWidth / 15 : deviceWidth / 14,
    top: Platform.OS === "android" ? deviceHeight / 25 : deviceHeight / 24,
    width: 85,
    height: 85,
    resizeMode: "cover",
    borderRadius: 150 / 2,
    overflow: "hidden",
    borderWidth: 5,
    borderColor: "#fff"
  },
  container: {
    flex: 1
  },
  bodyViewStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLayoutStyle: {
    height: 80,
    width: 500,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slidingPanelLayoutStyle: {
    backgroundColor: '#7E52A0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commonTextStyle: {
    color: 'white',
    fontSize: 18,
  },
};
