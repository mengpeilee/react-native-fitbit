/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import config from './config.js';
import qs from 'qs';

import {
  AppRegistry,
  StyleSheet,
  Text,
  Linking,
  View
} from 'react-native';

function OAuth(client_id, cb) {

   // Listen to redirection
  Linking.addEventListener('url', handleUrl);
  function handleUrl(event){
    console.log(event.url);
    Linking.removeEventListener('url', handleUrl);
    const [, query_string] = event.url.match(/\#(.*)/);
    console.log(query_string);

    const query = qs.parse(query_string);
    console.log(`query: ${JSON.stringify(query)}`);

    cb(query.access_token);

    /*if (query.state === state) {
      cb(query.code, getProfileData, 'access_token');
    } else {
      console.error('Error authorizing oauth redirection');
    }*/
  }


   // Call OAuth
  const oauthurl = 'https://www.fitbit.com/oauth2/authorize?'+
            qs.stringify({
              client_id,
              response_type: 'token',
              scope: 'heartrate activity activity profile sleep',
              redirect_uri: 'mppy://fit',
              expires_in: '31536000',
              //state,
            });
  console.log(oauthurl);

  Linking.openURL(oauthurl).catch(err => console.error('Error processing linking', err));
}

function getProfileData(access_token) {
  fetch(
     'https://api.fitbit.com/1/user/-/profile.json',
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${ access_token}`
      },
      //body: `root=auto&path=${Math.random()}`

    }
  ).then((res) => {
    console.log('res: ', res);
  }).catch((err) => {
    console.error('Error: ', err);
  });
}

class OauthExample extends Component {


  componentDidMount() {
    OAuth(config.client_id, getProfileData);
  }


  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React Native!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit index.ios.js
        </Text>
        <Text style={styles.instructions}>
          Press Cmd+R to reload,{'\n'}
          Cmd+D or shake for dev menu
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('OauthExample', () => OauthExample);
