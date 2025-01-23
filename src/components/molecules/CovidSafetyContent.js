import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  Linking,
  Image,
} from 'react-native';
import {Container, Content, Card, CardItem, List, ListItem} from 'native-base';
import {TouchableOpacity} from 'react-native-gesture-handler';

const CovidSafetyContent = () => {
  const [jammuKashmirCovidStats, setJammuKashmirCovidStats] = useState({});
  const jkCovidUrl = 'https://covidrelief.jk.gov.in/';
  useEffect(() => {
    let isSubscribed = true;
    if (isSubscribed) {
      const url =
        'https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats';
      const options = {
        method: 'GET',
        url: url,
        params: {country: 'India'},
        headers: {
          'x-rapidapi-key':
            'ba2f32fee1mshb77c56edfe5b8e7p1e5073jsn6adacb7dab34',
          'x-rapidapi-host': 'covid-19-coronavirus-statistics.p.rapidapi.com',
        },
      };
      axios
        .request(options)
        .then(async (res) => {
          const data = res.data.data.covid19Stats[13];
          setJammuKashmirCovidStats(data);
        })
        .catch(function (error) {
          console.error(error);
        });
    }
    return () => {
      isSubscribed = false;
    };
  }, []);
  return (
    <Container>
      <Content style={styles.ContentStyle} showsVerticalScrollIndicator={false}>
        <Image
          source={require('../images/covid.png')}
          style={styles.CovidImg}
        />
        <Card>
          {jammuKashmirCovidStats.confirmed ? (
            <>
              <CardItem header style={styles.CovidStatsHeaderStyle}>
                <Text style={styles.HeaderTextStyle}>
                  Current COVID Count In J&K:{' '}
                </Text>
              </CardItem>
              <CardItem body>
                <List>
                  <ListItem style={styles.ItemStyle}>
                    <Text style={{fontSize: 17, color: '#5c5c5c'}}>
                      Total confirmed cases:{'    '}
                    </Text>
                    <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                      {jammuKashmirCovidStats.confirmed}
                    </Text>
                  </ListItem>
                </List>
              </CardItem>
              <CardItem>
                <List>
                  <ListItem style={styles.ItemStyle}>
                    <Text style={{fontSize: 17, color: '#5c5c5c'}}>
                      Total deaths:{'    '}
                    </Text>
                    <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                      {jammuKashmirCovidStats.deaths}
                    </Text>
                  </ListItem>
                </List>
              </CardItem>
              <CardItem>
                <List>
                  <ListItem style={styles.ItemStyle}>
                    <Text style={{fontSize: 17, color: '#5c5c5c'}}>
                      Total recovered:{'    '}
                    </Text>
                    <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                      {jammuKashmirCovidStats.recovered}
                    </Text>
                  </ListItem>
                </List>
              </CardItem>
              <Text
                style={{
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  opacity: 0.3,
                  marginBottom: 5,
                }}>
                {' '}
                {'  '}*updates every 24 hours.
              </Text>
            </>
          ) : (
            <ActivityIndicator size="large" color="#ff6347" />
          )}
        </Card>
        <Card>
          <CardItem header style={styles.CovidStatsHeaderStyle}>
            <Text style={styles.HeaderTextStyle}>Helpline Numbers (J&K): </Text>
          </CardItem>
          <CardItem body>
            <List>
              <ListItem style={{borderColor: 'transparent'}}>
                <Text style={{fontWeight: 'bold'}}>
                  Kashmir Division Control Rooms:
                </Text>
              </ListItem>
              <ListItem style={{borderColor: 'transparent'}}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel: 01942457552`)}>
                  <Text>01942440283</Text>
                </TouchableOpacity>
              </ListItem>
              <ListItem style={{borderColor: 'transparent'}}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel: 01942457552`)}>
                  <Text>01942430581</Text>
                </TouchableOpacity>
              </ListItem>
              <ListItem style={{borderColor: 'transparent'}}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel: 01942457552`)}>
                  <Text>01942452052</Text>
                </TouchableOpacity>
              </ListItem>
              <ListItem style={{borderColor: 'transparent'}}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel: 01942457552`)}>
                  <Text>01942457313</Text>
                </TouchableOpacity>
              </ListItem>
              <ListItem>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel: 01942457552`)}>
                  <Text>01942457312</Text>
                </TouchableOpacity>
              </ListItem>
              <ListItem style={{borderColor: 'transparent'}}>
                <Text style={{fontWeight: 'bold'}}>
                  Jammu Division Control Rooms:
                </Text>
              </ListItem>
              <ListItem style={{borderColor: 'transparent'}}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel: 01942457552`)}>
                  <Text>01912549676</Text>
                </TouchableOpacity>
              </ListItem>
              <ListItem style={{borderColor: 'transparent'}}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel: 01942457552`)}>
                  <Text>01912520982</Text>
                </TouchableOpacity>
              </ListItem>
              <ListItem style={{borderColor: 'transparent'}}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel: 01942457552`)}>
                  <Text>01912674444</Text>
                </TouchableOpacity>
              </ListItem>
              <ListItem style={{borderColor: 'transparent'}}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel: 01942457552`)}>
                  <Text>01912674115</Text>
                </TouchableOpacity>
              </ListItem>
              <ListItem style={{borderColor: 'transparent'}}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel: 01942457552`)}>
                  <Text>01912674908</Text>
                </TouchableOpacity>
              </ListItem>
            </List>
          </CardItem>
        </Card>
        <Card>
          <CardItem header style={styles.CovidStatsHeaderStyle}>
            <Text style={styles.HeaderTextStyle}>Some guidelines: </Text>
          </CardItem>
          <CardItem body>
            <List>
              <ListItem>
                <Text>
                  Clean your hands before you put your mask on, as well as
                  before and after you take it off, and after you touch it at
                  any time.
                </Text>
              </ListItem>
              <ListItem>
                <Text>Make sure it covers your nose, mouth and chin.</Text>
              </ListItem>
              <ListItem>
                <Text>
                  When you take off a mask, store it in a clean plastic bag, and
                  every day either wash it if it’s a fabric mask, or dispose of
                  a medical mask in a trash bin.
                </Text>
              </ListItem>
              <ListItem>
                <Text>Don’t use masks with valves.</Text>
              </ListItem>
            </List>
          </CardItem>
        </Card>
        <Card>
          <CardItem header style={styles.CovidStatsHeaderStyle}>
            <Text style={{color: '#fff'}}>
              For more details visit J&K Covid Website{' '}
            </Text>
            <TouchableOpacity onPress={() => Linking.openURL(jkCovidUrl)}>
              <Text
                style={{color: '#fff', fontWeight: 'bold', paddingRight: 20}}>
                Here
              </Text>
            </TouchableOpacity>
          </CardItem>
        </Card>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  ItemStyle: {
    borderColor: 'transparent',
  },
  ContentStyle: {
    margin: 18,
  },
  CovidStatsHeaderStyle: {
    backgroundColor: '#ff6347',
  },
  HeaderTextStyle: {
    fontWeight: 'bold',
    color: '#fff',
  },
  CovidImg: {
    width: 200,
    height: 200,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});
export default CovidSafetyContent;
