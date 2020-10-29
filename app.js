'use strict';

const Homey = require('homey');
let cloudLib = require('crownstone-cloud')
let cloud = new cloudLib.CrownstoneCloud();
let accessToken;

/**
 * This class gets the data from the form shown to the user when the latter install the Crownstone app. There are
 * only two fields, email and password. This is used to retrieve all information from the Crownstone cloud. 
 */
class CrownstoneApp extends Homey.App {

  /**
   * This method is called when the App is initialized.
   * The email and password for the Crownstone Cloud from the user will be obtained using the data from the form.
   */
  onInit(){

    let myAction = new Homey.FlowCardTrigger('rain_start');
    myAction
        .register()
        .registerRunListener(( args, state ) => {
          // ...
        })
        .getArgument('my_autocomplete')
        .registerAutocompleteListener(( query, args ) => {
          return Promise.resolve([
            {
              icon: 'https://path.to/icon.svg', // or use "image: 'https://path.to/icon.png'" for non-svg icons.
              name: 'Item name',
              description: 'Optional description',
              some_value_for_myself: 'that i will recognize when fired, such as an ID'
            },
            {
              name: 'Name 2'
              // ...
            }
          ]);
        })



    this.log(`App ${Homey.app.manifest.name.en} is running...`);
    this.email = Homey.ManagerSettings.get('email');
    this.password = Homey.ManagerSettings.get('password');
    loginToCloud(this.email, this.password).catch((e) => { console.log('There was a problem making a connection with the cloud:', e);});

    /**
     * This function will fire when a user changed the credentials in the settings-page.
     */
    Homey.ManagerSettings.on('set', function (){
      this.email = Homey.ManagerSettings.get('email');
      this.password = Homey.ManagerSettings.get('password');
      loginToCloud(this.email, this.password).catch((e) => { console.log('There was a problem making a connection with the cloud:', e);});
    });
  }

  /**
   * This method will call the function to retrieve the access token.
   */
  getUserToken(callback){
    retrieveAccessToken(function(){
      callback(accessToken);
    });
  }

  /**
   * This method will return the instance of the cloud.
   */
  getCloud(){
    return cloud;
  }
}

/**
 * This function will make a connection with the cloud and obtain the userdata.
 */
async function loginToCloud(email, password){
  await cloud.login(email, password);
  let userData = await cloud.me();
  accessToken = userData.rest.tokenStore.accessToken;
}

/**
 * This function will return the access token as soon as it is obtained.
 */
function retrieveAccessToken(callback){
  if(typeof accessToken !== 'undefined') {
    callback();
  } else{
    setTimeout(function(){
      retrieveAccessToken(callback);}, 50);
  }
}

module.exports = CrownstoneApp;