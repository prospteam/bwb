import React, {
	Component,
} from 'react';
import {
	Animated,
	Dimensions,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableHighlight,
	View,
	Alert
} from 'react-native';

import {
	SCLAlert,
	SCLAlertButton
} from 'react-native-scl-alert';


import { Icon, Header, Left, Right, Button } from 'native-base';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-community/async-storage';
import Helpers from '../../Helpers';
import Modal from "react-native-modal";

var Spinner = require('react-native-spinkit');

export default class Bookings extends Component {
    static navigationOptions = {
        drawerLabel: 'Bookings',
        drawerIcon: () => (
            <Icon type="FontAwesome" name="clipboard" style={{ fontSize: 19 }} />
        )
    };

	state = {
		isModalVisible: false
	};

	toggleModal = () => {
		this.setState({ isModalVisible: !this.state.isModalVisible });
	};

	constructor(props) {
		super(props);
		// const val = ["Booking 1", "Booking 2", "Booking 3", "Booking 4"];

		this.displayBookings();

		// console.error(this.state.listViewData);

		this.state = {
			isLoading: true,
		   listType: 'Pending',
		   details: [],
		   user: [],
		   reserve_button: 'Start',
		   listViewData_p: [],
		   listViewData_r: [],
		   listViewData_c: [],
		   sectionListData: Array(5).fill('').map((_,i) => ({title: `title${i + 1}`, data: [...Array(5).fill('').map((_, j) => ({key: `${i}.${j}`, text: `item #${j}`}))]})),
	   

			scl_alert: {
				show: false,
				title: "title",
				message: "message",
			},
		};

		this.rowSwipeAnimatedValues = {};
		Array(20).fill('').forEach((_, i) => {
			this.rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
		});
	}

	async componentDidMount(){

		this.setState({ user: JSON.parse(await AsyncStorage.getItem('userData')) });

		this.displayBookings();
		setTimeout(() => {
			this.setState({isLoading: false});
		}, 1000);
	}

	async displayBookings() {
		console.log('url');
		console.log(Helpers.api_url+'get_rider_bookings');
		const data = JSON.parse(await AsyncStorage.getItem('userData'));

		console.log('dataaassss');
		console.log(data);
	 fetch(Helpers.api_url+'get_rider_bookings', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
		  rider_id: data.login_id
      })
    }).then((response) => response.json())
      .then((responseJson) => {
		  console.log(responseJson.data.response);
		  console.log("responseJsonXDXD");

		// console.error( responseJson.data.map(Object.values).map((_,i) => ({key: `${i}`, text: `Date: ${_[2]} - From: ${_[3]} - To: ${_[4]}`})) );
		// console.error(responseJson.data.map(Object.values).map((_,i) => ({key: `${i}`, text: `${_}`})));
		// const val = ["Booking 1", "Booking 2", "Booking 3", "Booking 4"];
		// console.error(val.map((_,i) => ({key: `${i}`, text: `${_}`})));

		if(responseJson.data.response === 'success'){
			console.log('data');
			console.log(data);
				
			this.setState({listViewData_p: responseJson.data.data_pending.map(Object.values).map((_,i) => ({key: `${i}`, id: `${_[0]}`, user: `${_[1]}`, text: `Booking Date: ${_[3]}`})),
							listViewData_r: responseJson.data.data_reserved.map(Object.values).map((_,i) => ({key: `${i}`, id: `${_[0]}`, user: `${_[1]}`, text: `Booking Date: ${_[3]}`})),
							listViewData_c: responseJson.data.data_completed.map(Object.values).map((_,i) => ({key: `${i}`, id: `${_[0]}`, user: `${_[1]}`, text: `Booking Date: ${_[3]}`}))
			});
		}else{
			if (responseJson.data.response === 'error') {
				// this.setState({listViewData_p: responseJson.data.data_pending.map(Object.values).map((_,i) => ({key: `${i}`, id: `${_[0]}`, user: `${_[1]}`, text: `Booking Date: ${_[2]}`})),
				// 				listViewData_r: responseJson.data.data_reserved.map(Object.values).map((_,i) => ({key: `${i}`, id: `${_[0]}`, user: `${_[1]}`, text: `Booking Date: ${_[2]}`})),
				// 				listViewData_c: responseJson.data.data_completed.map(Object.values).map((_,i) => ({key: `${i}`, id: `${_[0]}`, user: `${_[1]}`, text: `Booking Date: ${_[2]}`}))
			}

			// this.setState({
			// 	scl_alert: {
			// 		show: true,
			// 		title: "Alert",
			// 		message: responseJson.response,
			// 	}
			// });
		}

		// console.error(this.state.listViewData);

      }).catch((error) => {
		alert('You have encountered issued on your internet connection, Please try again later!');
        //console.error(error);
      });
	}

	displayBookDetails(id){
		console.log('displayBooking');
		console.log(id);
		console.log(Helpers.api_url+'get_booking_detail');
		fetch(Helpers.api_url+'get_booking_detail', {
		 method: 'POST',
		 headers: {
		   'Accept': 'application/json',
		   'Content-Type': 'application/json',
		 },
		 body: JSON.stringify({
   			booking_id: id
		 })
	   }).then((response) => response.json())
		 .then((responseJson) => {

			 if(responseJson.response === 'success')
	          {
					console.log('success');
					console.log(responseJson);
				  const details = responseJson.data;
				  // let string = '';
				  //
				  // for (const [ key, value ] of Object.entries(details)){
					//   string = string + key.replace(/_/g,' ').toUpperCase() + ": " + value + '\n';
				  // }

				  this.setState({details});
				  this.setState({ isModalVisible: !this.state.isModalVisible });

	          }else{
				//    Alert.alert("No data available.");
				 this.setState({
					 scl_alert: {
						 show: true,
						 title: "Alert",
						 message: "No data available",
					 }
				 });
			  }
		 }).catch((error) => {
			alert('You have encountered issued on your internet connection, Please try again later!');
		   //console.error(error);
		 });
	}

	async updateBooking(id){

		const data = JSON.parse(await AsyncStorage.getItem('userData'));

		fetch(Helpers.api_url+'update_booking_status', {
		 method: 'POST',
		 headers: {
		   'Accept': 'application/json',
		   'Content-Type': 'application/json',
		 },
		 body: JSON.stringify({
   			booking_id: id,
			driver_id: data.user_id
		 })
	   }).then((response) => response.json())
		 .then((responseJson) => {
			//  Alert.alert(JSON.stringify(responseJson.msg)+"2");
			 this.displayBookings();

			 if(JSON.stringify(responseJson.reserve_button) !== ''){
				 this.setState({ reserve_button: responseJson.reserve_button });
			 }

		 }).catch((error) => {
			alert('You have encountered issued on your internet connection, Please try again later!');
		   //console.error(error);
		 });
	}

	async removeBooking(id){

		const data = JSON.parse(await AsyncStorage.getItem('userData'));

		fetch(Helpers.api_url+'remove_booking', {
		 method: 'POST',
		 headers: {
		   'Accept': 'application/json',
		   'Content-Type': 'application/json',
		 },
		 body: JSON.stringify({
   			booking_id: id
		 })
	   }).then((response) => response.json())
		 .then((responseJson) => {
			 Alert.alert(JSON.stringify(responseJson.msg)+"3");
			 this.displayBookings();

		 }).catch((error) => {
			alert('You have encountered issued on your internet connection, Please try again later!');
		   //console.error(error);
		 });
	}

	closeRow(rowMap, rowKey) {
		if (rowMap[rowKey]) {
			rowMap[rowKey].closeRow();
		}
	}

	deleteRow(rowMap, rowKey) {
		this.closeRow(rowMap, rowKey);
		const newData = [...this.state.listViewData_p];
		const prevIndex = this.state.listViewData_p.findIndex(item => item.key === rowKey);
		newData.splice(prevIndex, 1);
		this.setState({listViewData_p: newData});
	}

	deleteSectionRow(rowMap, rowKey) {
		this.closeRow(rowMap, rowKey);
		var [section, row] = rowKey.split('.');
		const newData = [...this.state.sectionListData];
		const prevIndex = this.state.sectionListData[section].data.findIndex(item => item.key === rowKey);
		newData[section].data.splice(prevIndex, 1);
		this.setState({sectionListData: newData});
	}

	onRowDidOpen = (rowKey, rowMap) => {
		console.log('This row opened', rowKey);
	}

	onSwipeValueChange = (swipeData) => {
		const { key, value } = swipeData;
		this.rowSwipeAnimatedValues[key].setValue(Math.abs(value));
	}

	render() {



			const { isLoading } = this.state;

			if(isLoading){
        return (
            <View style={styles.container2}>
	            <Spinner type="9CubeGrid" color="#d3a04c" />
            </View>
          );
      }

			const data = this.state.details;

			// console.log(this.state);
			// console.log("XDXD");
			let string = '';
			let temp_var = '';
			for (const [ key, value ] of Object.entries(data)){
				if(value)
				temp_var=value;
				else
				temp_var="Not Available";
			    string = string + key.replace(/_/g,' ').toUpperCase() + ": " + temp_var + '\n';
			}

			const details = string;

		return (
			<View style={styles.container}>
                <Header>
                 <Left style={{ flexDirection: 'row' }}>
                  <Icon onPress={() => this.props.navigation.openDrawer()} name="md-menu" style={{ color: '#d3a04c', marginRight: 15 }} />
                 </Left>
                 <Right>
                 </Right>
                </Header>

				{/*<View style={styles.standalone}>
					<SwipeRow
						leftOpenValue={75}
						rightOpenValue={-75}
					>
						<View style={styles.standaloneRowBack}>
							<Text style={styles.backTextWhite}>Left</Text>
							<Text style={styles.backTextWhite}>Right</Text>
						</View>
						<View style={styles.standaloneRowFront}>
							<Text>I am a standalone SwipeRow</Text>
						</View>
					</SwipeRow>
				</View>*/}

				<Modal isVisible={this.state.isModalVisible} onBackdropPress={() => this.setState({ isVisible: false })}>
				  <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
				  	<View style={{backgroundColor: '#d3a04c', paddingVertical: 30, width: '100%', alignItems: 'center'}}><Text style={{color: 'white'}}>{'Booking Details'.toUpperCase()}</Text></View>
					<View style={{ width: 300, height: 300, borderWidth: 2, borderColor: '#d3a04c', paddingVertical: 10, paddingHorizontal: 10, marginVertical: 20, backgroundColor: 'white'}}><Text>{details}</Text></View>

					<TouchableOpacity style={{backgroundColor: '#1c1b22', paddingVertical: 10, paddingHorizontal: 20}} onPress={this.toggleModal}><Text style={{color: '#d3a04c'}}>Close</Text></TouchableOpacity>
				  </View>
				</Modal>

				<View style={styles.controls}>
					<View style={styles.switchContainer}>
						{ ['Pending', 'Reserved', 'Completed'].map( type => (
							<TouchableOpacity
								key={type}
								style={[
									styles.switch,
                                    {backgroundColor: this.state.listType === type ? '#d3a04c' : 'white'},
									{color: this.state.listType === type ? '#fff' : '#ddd'}
								]}
								onPress={ () => this.setState({listType: type}) }
							>
								<Text>{type}</Text>
							</TouchableOpacity>
						))}
					</View>
					{
						this.state.listType === 'Pending' &&
						<Text>(Pending customer bookings)</Text>
					}
					{
						this.state.listType === 'Reserved' &&
						<Text>(Your reserved customer bookings)</Text>
					}
					{
						this.state.listType === 'Completed' &&
						<Text>(Completed customer bookings)</Text>
					}
				</View>

				{

					this.state.listType === 'Pending' &&

					<SwipeListView
						data={this.state.listViewData_p}
						renderItem={ (data, rowMap) => (
							<TouchableHighlight
								style={styles.rowFront}
								underlayColor={'#AAA'}
								onPress={ () => this.displayBookings() }
							>
								<View>
									<Text>{data.item.text}</Text>
								</View>
							</TouchableHighlight>
						)}
						renderHiddenItem={ (data, rowMap) => (

							<View style={styles.rowBack}>
							<TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnView]} onPress={ () => this.displayBookDetails(data.item.id) }>
								<Animated.View
									style={[
										styles.trash,
										{
											
										}
									]}
								>
									<Icon type="FontAwesome" name="eye" style={{ fontSize: 19, color: 'white' }} />
								</Animated.View>
								</TouchableOpacity>
								<TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnReserve]} onPress={ () => this.displayBookDetails(data.item.id) }>
								<Animated.View
									style={[
										styles.trash,
										{
											
										}
									]}
								>
									<Icon type="FontAwesome" name="eye" style={{ fontSize: 19, color: 'white' }} />
								</Animated.View>
								</TouchableOpacity>
							{/* </TouchableOpacity>
								<TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnReserve]} onPress={ () => this.updateBooking(data.item.id) }>
									<Text style={styles.backTextWhite}>Reserve</Text>
								</TouchableOpacity> */}
								{/*}<TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={ _ => this.deleteRow(rowMap, data.item.key) }>
									<Animated.View
										style={[
											styles.trash,
											{
												transform: [
													{
														scale: this.rowSwipeAnimatedValues[data.item.key].interpolate({
															inputRange: [45, 90],
															outputRange: [0, 1],
															extrapolate: 'clamp',
														}),
													}
												],
											}
										]}
									>
										<Icon type="FontAwesome" name="trash" style={{ fontSize: 19, color: 'white' }} />
									</Animated.View>
								</TouchableOpacity>*/}
							</View>
						)}
						leftOpenValue={75}
						rightOpenValue={-75}
						previewRowKey={'0'}
						previewOpenValue={-40}
						previewOpenDelay={3000}
						onRowDidOpen={this.onRowDidOpen}
						onSwipeValueChange={this.onSwipeValueChange}
					/>
				}

				{
					this.state.listType === 'Reserved' &&

					<SwipeListView
						data={this.state.listViewData_r}
						renderItem={ (data, rowMap) => (
							<TouchableHighlight
								style={styles.rowFront}
								underlayColor={'#AAA'}
							>
								<View>
									<Text>{data.item.text}</Text>
								</View>
							</TouchableHighlight>
						)}
						renderHiddenItem={ (data, rowMap) => (
							<View style={styles.rowBack}>
							<TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnView]} onPress={ () => this.displayBookDetails(data.item.id) }>
								<Animated.View
									style={[
										styles.trash,
										{

											transform: [
												{
													scale: this.rowSwipeAnimatedValues[data.item.key].interpolate({
														inputRange: [45, 90],
														outputRange: [0, 1],
														extrapolate: 'clamp',
													}),
												}
											],
										}
									]}
								>
									<Icon type="FontAwesome" name="eye" style={{ fontSize: 19, color: 'white' }} />
								</Animated.View>
							</TouchableOpacity>
							<TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnReserve]} onPress={ () => this.displayBookDetails(data.item.id) }>
								<Animated.View
									style={[
										styles.trash,
										{
											
										}
									]}
								>
									<Icon type="FontAwesome" name="eye" style={{ fontSize: 19, color: 'white' }} />
								</Animated.View>
								</TouchableOpacity>6
								{/* <TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnReserve]} onPress={ () => this.updateBooking(data.item.id) }>
									<Text style={styles.backTextWhite}>{this.state.reserve_button}</Text>
							</TouchableOpacity> */}
							</View>
						)}
						leftOpenValue={75}
						rightOpenValue={-75}
						previewRowKey={'0'}
						previewOpenValue={-40}
						previewOpenDelay={3000}
						onRowDidOpen={this.onRowDidOpen}
						onSwipeValueChange={this.onSwipeValueChange}
					/>
				}

				{
					this.state.listType === 'Completed' &&
					<SwipeListView
						data={this.state.listViewData_c}
						renderItem={ (data, rowMap) => (
							<TouchableHighlight
								style={styles.rowFront}
								underlayColor={'#AAA'}
							>
								<View>
									<Text>{data.item.text}</Text>
								</View>
							</TouchableHighlight>
						)}
						renderHiddenItem={ (data, rowMap) => (
							<View style={styles.rowBack}>
							<TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnView]} onPress={ () => this.displayBookDetails(data.item.id) }>
								<Animated.View
									style={[
										styles.trash,
										{

											transform: [
												{
													scale: this.rowSwipeAnimatedValues[data.item.key].interpolate({
														inputRange: [45, 90],
														outputRange: [0, 1],
														extrapolate: 'clamp',
													}),
												}
											],
										}
									]}
								>
									<Icon type="FontAwesome" name="eye" style={{ fontSize: 19, color: 'white' }} />
								</Animated.View>
							</TouchableOpacity>
								<TouchableOpacity style={[styles.backRightBtn, styles.backRightBtnDelete]} onPress={ () => this.removeBooking(data.item.id) }>
								<Animated.View
									style={[
										styles.trash,
										{

											transform: [
												{
													scale: this.rowSwipeAnimatedValues[data.item.key].interpolate({
														inputRange: [45, 90],
														outputRange: [0, 1],
														extrapolate: 'clamp',
													}),
												}
											],
										}
									]}
								>
									<Icon type="FontAwesome" name="trash" style={{ fontSize: 19, color: 'white' }} />
								</Animated.View>
								</TouchableOpacity>

								<SCLAlert
									show={this.state.scl_alert.show}
									onRequestClose={() => { this.setState({ scl_alert: { show: false } }) }}
									theme="info"
									title={this.state.scl_alert.title}
									subtitle={this.state.scl_alert.message}
								>
									<SCLAlertButton theme="info" onPress={() => { this.setState({ scl_alert: { show: false } }) }}>OK</SCLAlertButton>
								</SCLAlert>
							</View>
						)}
						leftOpenValue={75}
						rightOpenValue={-75}
						previewRowKey={'0'}
						previewOpenValue={-40}
						previewOpenDelay={3000}
						onRowDidOpen={this.onRowDidOpen}
						onSwipeValueChange={this.onSwipeValueChange}
					/>
				}

			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flex: 1
	},
	container2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: undefined,
        height: undefined
    },
	standalone: {
		marginTop: 30,
		marginBottom: 30,
	},
	standaloneRowFront: {
		alignItems: 'center',
		backgroundColor: '#CCC',
		justifyContent: 'center',
		height: 50,
	},
	standaloneRowBack: {
		alignItems: 'center',
		backgroundColor: '#8BC645',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 15
	},
	backTextWhite: {
		color: '#FFF'
	},
	rowFront: {
		alignItems: 'center',
		backgroundColor: '#d3a04c',
		borderBottomColor: 'white',
		borderBottomWidth: 1,
		justifyContent: 'center',
		height: 50
	},
	rowBack: {
		alignItems: 'center',
		backgroundColor: '#DDD',
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 15,
	},
	backRightBtn: {
		alignItems: 'center',
		bottom: 0,
		justifyContent: 'center',
		position: 'absolute',
		top: 0,
		width: 75,
		paddingLeft: 8
	},
	backRightBtnLeft: {
		backgroundColor: '#006600',
		right: 75
	},
	backRightBtnRight: {
		backgroundColor: '#990000',
		right: 0
	},
	backRightBtnView: {
		backgroundColor: '#0033CC',
		borderBottomColor: 'white',
		borderBottomWidth: 1
	},
	backRightBtnReserve: {
		backgroundColor: '#0033CC',
		right: 0,
		borderBottomColor: 'white',
		borderBottomWidth: 1
	},
	backRightBtnDelete: {
		backgroundColor: '#990000',
		right: 0,
		borderBottomColor: 'white',
		borderBottomWidth: 1
	},
	controls: {
		alignItems: 'center',
        marginTop: 30,
		marginBottom: 30
	},
	switchContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginBottom: 5
	},
	switch: {
		alignItems: 'center',
		borderWidth: 2,
		borderColor: '#a1a1a1',
		paddingVertical: 10,
		width: Dimensions.get('window').width / 4,
	},
	trash: {
		height: 25,
		width: 25,
	}
});
