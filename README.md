# react-native-fitbit

We will create an app and link to OAuth2 of <a href="https://dev.fitbit.com/docs/" title="Title">Fitbit API</a> which is focusing on iOS.

In Android, you can ignore Step 2(but you still need to do Step 2.5), and you have to set your Android APP url scheme. About how to set url scheme, it can be find <a href="https://stackoverflow.com/questions/36244507/how-to-set-a-url-scheme-link-for-a-react-native-app" title="Title">here</a>.

Thanks to <a href="https://github.com/pyliaorachel/yahoo-oauth2-react-native/tree/tutorial" title="Title">this tutorial </a> for great instructions on using Yahoo API. Many of the project are based on this article.

Different APIs have different limitations, so it would be harmful if you follow the guide above to try to create a Fitbit app. Follow this one if you want to save your time.

# Step 1
Open your terminal and enter the code below

```
react-native init OauthExample
npm install qs --save
```

# Step 2
Set up your environment:

  1. Open `ios/your_project_name.xcodeproj` file to do the following configuration:

  2. Link the Linking library in the project
  
    - Click on your project. Go to `Build Settings > Search Paths > Header Search Paths` and add a path to the Linking library.
    - Here I choose to add `$(SRCROOT)/../node_modules/react-native/Libraries` and select `recursive`.
     
   <img src="http://i.imgur.com/h0mHw5z.png" alt="URL Scheme" width="680" height="447" border="50" />

  3. Open `AppDelegate.m` and add the following code after `@implementation AppDelegate`:
  
    ```
    - (BOOL)application:(UIApplication *)application
          openURL:(NSURL *)url
          sourceApplication:(NSString *)sourceApplication
          annotation:(id)annotation {
            return [RCTLinkingManager
                    application:application
                    openURL:url
                    sourceApplication:sourceApplication
                    annotation:annotation];
          }
    ```
   Also add it on the top
    
    ```
    #import "RCTLinkingManager.h"
    ```
    
    - More information on [Linking](https://facebook.github.io/react-native/docs/linking.html).


  4. Register your app with a custom URL

    - Click on your project. Go to `Info > URL Types` and add a custom **Identifier** and **URL Scheme** for your app.
      + Creating a custom **URL scheme** makes your app directable through typing `yoururlscheme://` in the address bar of a browser.
      + **Identifier** makes different apps with the same URL scheme differentiable.
      
  <img src="http://i.imgur.com/mYuGCF7.png" alt="URL Scheme" width="602" height="195" border="50" />

  5. Goto <a href="https://dev.fitbit.com/" title="Title">Fitbit dev</a> and create an app
   - In the **Callback Domain** field, it has to be the domain of the server or app for redirection after authentication.
   
   <img src="http://i.imgur.com/wX3JJ9e.png" 
alt="URL Scheme" width="392" height="275" border="50" />

# Step3

Add a `config.js` file to the root of directory, which contains:

```
export default {
  client_id: 'YOUR_CLIENT_ID',
  client_secret: 'YOUR_CLIENT_SECRET'
}
```
Then run

```
npm install
react-native run-ios
```
Ready to write codes into `index.ios.js`.

1. Remember to 
  
    ```javascript
    import {Linking} from 'react-native';
    import config from './config.js';
    import qs from 'qs';
    ```
    
2. add the below cdoe into `index.ios.js` before `class`:
  ```
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

//get your API data
function getData(access_token) {
  fetch(
     'https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json',
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access_token}`
      },
      //body: `root=auto&path=${Math.random()}`

    }
  ).then((res) => {
    return res.json()
  }).then((res) => {
    console.log(`res: ${JSON.stringify(res)}`);
  }).catch((err) => {
    console.error('Error: ', err);
  });
}
```

3. write it into the class before `render`:

   ```
    componentDidMount() {
      OAuth(config.client_id, getAPIData);
    }
    ```
    

# Note
Thanks <a href="https://github.com/pyliaorachel" title="Title">pyliaorachel</a> for teaching me! Really thank you!

 <img src="http://i.imgur.com/oxM7lUu.png" 
alt="URL Scheme" width="369" height="660" border="50" />
