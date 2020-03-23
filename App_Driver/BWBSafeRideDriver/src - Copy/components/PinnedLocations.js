import React, { Component } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon, Text, Card, CardItem } from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Helpers from '../../Helpers';

export default class PinnedLocations extends Component {
    static navigationOptions = {
        drawerLabel: 'Pinned Locations',
        drawerIcon: () => (
            <Icon type="FontAwesome" name="map" style={{ fontSize: 19 }} />
        )
    };

    state = {
        login_id: null,
        locations_list: []
    };

    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.getSavedLoc();
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.locations_list != this.state.locations_list){
            this.getSavedLoc();
        }
    }

    async getSavedLoc(){

        const data = JSON.parse(await AsyncStorage.getItem('userData'));

        this.setState({login_id: data.login_id});

        const data2 = {
            login_id: this.state.login_id
        }

        fetch(Helpers.api_url+'get_saved_locations', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
            body: JSON.stringify(data2)
        }).then((response) => response.json())
        .then((res) => {
            // Alert.alert(res.response);
            if(res.response === 'success'){
                this.setState({
                    locations_list: res.data,
                    function(){
                        console.log(this.state.locations_list);
                    }
                });
            }

        }).catch((error) => {
            console.error(error);
        });
    }

    deleteLocation($id = null){
        // Alert.alert($id);

        const data2 = {
            location_id: $id
        }

        fetch(Helpers.api_url+'delete_saved_location', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
            body: JSON.stringify(data2)
        }).then((response) => response.json())
        .then((res) => {
            // Alert.alert(res.response);
            if(res.response === 'success'){
                Alert.alert('Location has been deleted.')
                // this.getSavedLoc();
            }

        }).catch((error) => {
            console.error(error);
        });
    }

    render() {
        return (
            <Container>
            <Header>
             <Left style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon onPress={() => this.props.navigation.openDrawer()} name="md-menu" style={{ color: '#d3a04c', marginRight: 15 }} />
              <Text style={{width: 300, color: '#d3a04c'}}>Pinned Locations</Text>
             </Left>
             <Right>
             </Right>
            </Header>
                <Container>
                <Content padder>
                {this.state.locations_list.map((location, index) => {
                    return <View key={location.location_id} style={{borderWidth: 3, borderColor: '#a1a1a1', margin: 5, padding: 10, borderRadius: 5}}>
                        <Text>{location.location_name}</Text>
                        <View style={{position: 'absolute', top: 0, right: 0, backgroundColor: '#000', padding: 5}}>
                            <TouchableOpacity onPress={() => this.deleteLocation(location.location_id)} ><Icon type="FontAwesome" name="times" style={{fontSize: 18, color: '#fff' }} /></TouchableOpacity>
                        </View>
                        <View style={{backgroundColor: '#000', padding: 5, marginTop: 10}}>
                            <TouchableOpacity onPress={() => {this.props.navigation.navigate('Dashboard',{
                                pinned_loc_lat: location.latitude,
                                pinned_loc_long: location.longitude,
                                pinned_stat: true,
                            })}}><Text style={{color: '#d3a04c', textAlign: 'center', padding: 5}}>Pin Location</Text></TouchableOpacity>
                        </View>
                    </View>
                })}
                    </Content>
                </Container>
                <Footer>
                    <FooterTab style={{backgroundColor:"#1c1b22"}}>
                        <Button vertical onPress={() => this.props.navigation.navigate('Dashboard')}>
                            <Icon name="apps" />
                            <Text>Dashboard</Text>
                        </Button>
                        <Button vertical>
                            <Icon name="map" />
                            <Text>Book Now</Text>
                        </Button>
                        <Button vertical>
                            <Icon name="navigate" />
                            <Text>Navigate</Text>
                        </Button>
                    </FooterTab>
                </Footer>
        </Container>
        );
    }
}
