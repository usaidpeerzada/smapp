import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Text, Card, CardItem, Body, Button} from 'native-base';

const CovidSafetyCard = () => {
  const navigation = useNavigation();
  const covidSafetyContentHandler = () => {
    navigation.navigate('CovidSafetyContent');
  };
  return (
    <Card style={styles.MainContainer}>
      <CardItem header style={{backgroundColor: '#ff6347'}}>
        <Text style={{color: '#fff', fontWeight: 'bold'}}>
          Covid Safety {'   '} {'   '}
        </Text>
      </CardItem>
      <CardItem style={{backgroundColor: '#ff6347'}}>
        <Body>
          <Text style={{color: '#fff'}}>Important guidelines to follow!</Text>
        </Body>
      </CardItem>
      <CardItem footer>
        <TouchableOpacity onPress={covidSafetyContentHandler}>
          <Text style={styles.ButtonTextStyle}>Know More</Text>
        </TouchableOpacity>
      </CardItem>
    </Card>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    textAlign: 'center',
  },
  ButtonTextStyle: {
    color: '#ff6347',
    fontWeight: 'bold',
  },
});

export default CovidSafetyCard;
