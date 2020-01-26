import React, { Component } from 'react';
import { Container, Header, Content, List, ListItem, Text, Left, Right, Button, Body, Icon, Title, Card, CardItem } from 'native-base';
export default class SideBarMenu extends Component {
  render() {
    return (
      <Container>
      <Header>
        <Body>
          <Title></Title>
        </Body>
        <Right />
        </Header>
        <Content>
          <List>
            <ListItem>
              <Text>Profile</Text>
              <Right>
               <Icon name="arrow-forward" />
             </Right>
            </ListItem>
            <ListItem>
              <Text>Payment</Text>
              <Right>
               <Icon name="arrow-forward" />
             </Right>
            </ListItem>
            <ListItem>
              <Text>History</Text>
              <Right>
               <Icon name="arrow-forward" />
             </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}
