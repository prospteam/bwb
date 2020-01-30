import React, { Component } from "react";
import { Image ,ImageBackground, View} from "react-native";
import {
  Content,
  Text,
  List,
  ListItem,
  Icon,
  Container,
  Left,
  Right,
  Badge
} from "native-base";
import { Actions } from 'react-native-router-flux';
import styles from "./style";

const drawerCover = require("../../assets/images/building2.png");
const drawerImage = require("../../assets/images/app-logo.png");
const datas = [
    {
      name: "Add",
      route: "Add",
      icon: "person",
      bg: "#C5F442",
      types: "1111"
    },
    {
      name: "My Profile",
      route: "Profile",
      icon: "person",
      bg: "#C5F442",
      types: "1111"
    },
  {
    name: "Booking Payment",
    route: "PayNow",
    icon: "paper",
    bg: "#C5F442",
    types: "1111"
  },
  {
    name: "BookingDetails",
    route: "BookingDetails",
    icon: "paper",
    bg: "#C5F442",
    types: "1111"
  },
  {
    name: "Firebase",
    route: "Firebase",
    icon: "arrow-up",
    bg: "#477EEA",
    types: "11"
  },
  {
    name: "Notifictaions",
    route: "Drivers",
    icon: "bulb",
    bg: "#477EEA",
    types: "1111"
  },
  {
    name: "Trip History",
    route: "TripHistory",
    icon: "speedometer",
    bg: "#DA4437",
    types: "4"
  },
  {
    name: "Payment History",
    route: "PaymentHistory",
    icon: "paper",
    bg: "#C5F442",
    types: "5"
  },
  {
    name: "Pinned Locations",
    route: "PinnedLocation",
    icon: "md-pin",
    bg: "#C5F442",
    types: "5"
  },
  {
    name: "Settings",
    route: "Settings",
    icon: "settings",
    bg: "#4DCAE0",
    types: "1111"
  },
  {
    name: "Logout",
    route: "Logout",
    icon: "exit",
    bg: "#1EBC7C",
    types: "9"
  }

];

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shadowOffsetWidth: 1,
      shadowRadius: 4
    };
  }

  render() {
    return (
      <Container>
        <Content
          bounces={false}
          style={{ flex: 1, backgroundColor: "#fff", top: -1 }}
        >
          <ImageBackground source={drawerCover} style={styles.drawerCover} >
               <Image  style={styles.drawerImage} source={drawerImage} />
               <View style={{marginLeft:'10%',marginBottom:'8%',marginTop:'8%'}}>
                   <Text style={styles.innerText}>Adminnistrator Name</Text>
                   <Text  style={{
                                    borderBottomColor: '#fff',
                                    borderBottomWidth: 0.5,
                                    borderBottomStartRadius: 20,
                                    marginRight:10,
                                  }}>
                   </Text>
               </View>
          <List
            style={{backgroundColor:'#fff'}}
            dataArray={datas}
            renderRow={data =>
              <ListItem
                button
                noBorder
                onPress={() => Actions[data.route].call({route:data.route})}
              >
                <Left>
                  <Icon
                    active
                    name={data.icon}
                    style={{fontSize: 20, width: 30 }}
                  />
                  <Text style={styles.text}>
                    {data.name}
                  </Text>
                </Left>
                {data.types &&
                  <Right style={{ flex: 1 }}>
                    <Badge
                      style={{
                        borderRadius: 3,
                        height: 20,
                        width: 50,
                        backgroundColor: data.bg
                      }}
                    >
                      <Text
                        style={styles.badgeText}
                      >{`${data.types}`}</Text>
                    </Badge>
                  </Right>}
              </ListItem>}
              keyExtractor= {(item,index)=> index.toString()}
          />
          </ImageBackground>
        </Content>
      </Container>
    );
  }
}

export default Sidebar;
