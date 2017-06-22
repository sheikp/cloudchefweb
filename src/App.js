import React, {Component} from 'react';
import $ from 'jquery'; 
import logo from './logo.svg';
import './App.css';

import {CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js';
import AWS from 'aws-sdk';

var poolData = {
    UserPoolId: 'us-east-2_UpW0QE4Zr', //'us-east-2_0Iq73ns0z', // Your user pool id here
    ClientId: '5kvkd4b6i2o09adph0jk4h8o2t' //'6d27kdqric8dr39nlifvdvduk6' // Your client id here
};

var tokenval = '';

class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            items: []
        }
    }

    render() {
        

        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h2>Welcome to Cloud Chef's - Super Singer Voting portal</h2>
                </div> <br />
                
							
							<div id="login-form" style={{width:'400px',paddingLeft:'200px', float:'left'}}>
								
									<input type="text" placeholder="username" ref={(input) => {
										this.username1 = input
									}}/> <br /><br />
									<input type="password" placeholder="password" ref={(input) => {
										this.password1 = input
									}}/> <br /><br />
								
									<br />
											<button className="btn-login" onClick={(e) => this.doLogin(e)}>Login</button>
										
							</div>
							<div id="register-form"  style={{width:'200px',float:'right'}}>
									<input type="text" placeholder="username" ref={(input) => {
										this.username2 = input
									}}/><br /><br />
									<input type="text" placeholder="email" ref={(input) => {
										this.email = input
									}}/><br /><br />
									<input type="text" placeholder="phone" ref={(input) => {
										this.phone = input
									}}/><br /><br />
									<input type="password" placeholder="password" ref={(input) => {
										this.password2 = input
									}}/><br /><br />
									<button className="btn-register" onClick={(e) => this.doRegister(e)}>Register</button>
								
								<br /><br /><br /><br />
									<input type="text" placeholder="code" ref={(input) => {
										this.code = input
									}}/>			<br /><br />		
										<button className="btn-login" onClick={(e) => this.doConfirm(e)}>Confirm</button>											
							</div>
							<div  style={{float:"left", align:"center", border:"1px solid red",width:"300px"}}>
								
									<div>
											<input type="radio" name="vote" value="none" checked id="radio1" /><label for="radio1">No Vote</label>
										</div><br />
										<div>
										<input type="radio" name="vote" value="Monica" id="radio2" /><label for="radio2">Monica</label>
										</div><br /><div>
										<input type="radio" name="vote" value="Rithika" id="radio3" /><label for="radio3">Rithika</label>
										</div><br /><div>
										<input type="radio" name="vote" value="Dhanush" id="radio4" /><label for="radio4">Dhanush</label>
										</div><br /><div>
										<input type="radio" name="vote" value="Gowri" id="radio5" /><label for="radio5">Gowri</label>
										</div><br /><div>
										 <input type="radio" name="vote" value="Bhavin" id="radio6" /><label for="radio6">Bhavin</label>
										</div>
									<br />
									<div><button className="btn-register" onClick={(e) => this.callAPI(e)}>Submit</button></div>
								
							</div>
            </div>
			
        );
    }

    doLogin() {
		
		var authenticationData = {
            Username: this.username1.value,
            Password: this.password1.value
        };
        var authenticationDetails = new AuthenticationDetails(authenticationData);

        var userPool = new CognitoUserPool(poolData);
        var userData = {
            Username: this.username1.value,
            Pool: userPool
        };
        var cognitoUser = new CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function(result) {
                console.log(result);
                alert('Login successfully!');
				tokenval = result.getIdToken().getJwtToken();
                
				/*AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                     IdentityPoolId : 'us-east-2:f2e1a9e1-5f36-4af5-87e6-351d9d0d32d1', // your identity pool id here
                     Logins : {
                         // Change the key below according to the specific region your user pool is in.
                         'cognito-idp.us-east-2.amazonaws.com/us-east-2_UpW0QE4Zr' : result.getIdToken().getJwtToken()
                     }
                });
				
				// Set the region where your identity pool exists (us-east-1, eu-west-1)
				AWS.config.region = 'us-east-2';

				// Configure the credentials provider to use your identity pool
				AWS.config.credentials = new AWS.CognitoIdentityCredentials({
					IdentityPoolId: 'us-east-2:f2e1a9e1-5f36-4af5-87e6-351d9d0d32d1',
				});
				// Make the call to obtain credentials
				AWS.config.credentials.get(function(){

					// Credentials will be available when this function is called.
					var accessKeyId = AWS.config.credentials.accessKeyId;
					var secretAccessKey = AWS.config.credentials.secretAccessKey;
					var sessionToken = AWS.config.credentials.sessionToken;

				}); 
				alert('Identity ID ' + AWS.config.credentials.sessionToken );*/
                
				//Instantiate aws sdk service objects now that the credentials have been updated.
                // example: var s3 = new AWS.S3();
				
            },

            onFailure: function(err) {
                console.error(err);
				alert(err);
            }
        });
    }

    doConfirm(event) {
        var userPool = new CognitoUserPool(poolData);
        var userData = {
            Username: this.username2.value,
            Pool: userPool
        };

        var cognitoUser = new CognitoUser(userData);

        cognitoUser.confirmRegistration(this.code.value, true, function(err, result) {
            if (err) {
                alert(err);
                return;
            }
            console.log('call result: ' + result);
			alert('Confirmation Completed!');
        });
    }

    doRegister(event) {
		var userPool = new CognitoUserPool(poolData);
        var email = this.email.value;
        var username = this.username2.value;
        var phone = this.phone.value;
        var password = this.password2.value;

        var attributeList = [];

        var dataEmail = {
            Name: 'email',
            Value: email
        };
		
		var dataName = {
            Name: 'name',
            Value: username
        };

        var dataPhoneNumber = {
            Name: 'phone_number',
            Value: phone
        };
		
        var attributeEmail = new CognitoUserAttribute(dataEmail);
        var attributePhoneNumber = new CognitoUserAttribute(dataPhoneNumber);
		var attributeName = new CognitoUserAttribute(dataName);
		
        attributeList.push(attributeEmail);
        attributeList.push(attributePhoneNumber);
		attributeList.push(attributeName);
				
        //console.log(`Register User ${username} ${phone} ${email}`);
        userPool.signUp(username, password, attributeList, null, function(err, result) {
            if (err) {
                alert(err);
            } else {
                var cognitoUser = result.user;
                alert('user registered as ' + cognitoUser.getUsername());
            }
        });
    }
	
	callAPI(event){
		if(tokenval!=='')
		{
			var radios = document.getElementsByName('vote');
			var votefor = '';
			for (var i = 0, length = radios.length; i < length; i++) {
				if (radios[i].checked) {
					// do whatever you want with the checked radio
					
					votefor = radios[i].value;
					//alert(votefor);
					
					// only one radio can be logically checked, don't check the rest
					break;
				}
			}
			
			$.ajax({
			   url: "https://ki3094dulh.execute-api.us-east-2.amazonaws.com/prod/vote",
			   method: "post",
			   dataType:'json',
			   data: {"vote": votefor},
			   headers: {
				'Authorization': tokenval
			   },
			   success:function(response){
					//alert("success");
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) { 
					//alert("Status: " + textStatus); alert("Error: " + errorThrown); 
				} 
			 });
			
			alert('your vote registered successfully!');
			
		}
		else
			alert('Login to cast your vote');
	}
				
    loadAuthenticatedUser() {
        var that = this;
        console.log("Loading Auth User");

        var userPool = new CognitoUserPool(poolData);
        var cognitoUser = userPool.getCurrentUser();

        if (cognitoUser != null) {
            cognitoUser.getSession(function(err, session) {
                if (err) {
                    alert(err);
                    return;
                }
                console.log(session);
                console.log('session validity: ' + session.isValid());
                console.log(session.getIdToken().getJwtToken());
                var creds = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: 'us-east-1:800fc845-342e-44d5-b5a2-0e2379086aa5', // your identity pool id here
                    Logins: {
                        // Change the key below according to the specific region your user pool is in.
                        'cognito-idp.us-east-1.amazonaws.com/us-east-1_Mr98zHlUu': session.getIdToken().getJwtToken()
                    }
                },{
                  region: "us-east-1"
                });

                creds.refresh(function(err,data){
                    if(err) console.log(err);
                    else {
                      console.log(creds);
                      console.log(creds.accessKeyId);
                      console.log(creds.secretAccessKey);
                      console.log(creds.sessionToken);

                      var apigClient = window.apigClientFactory.newClient({
                        accessKey: creds.accessKeyId,
                        secretKey: creds.secretAccessKey,
                        sessionToken: creds.sessionToken
                      });
                      var params = {};
                      var body = {};
                      var additionalParams = {};

                      apigClient.featureditemsGet(params, body, additionalParams)
                           .then(function(result) {
                              console.log("success");
                              console.log(result.data);
                              that.setState(result.data);
                          }).catch(function(error) {
                            console.log("error");
                            console.error(error);
                          });

                      // var lambda = new AWS.Lambda({
                      //   credentials: creds,
                      //   region: "us-east-1"
                      // });
                      //
                      // var params = {
                      //   FunctionName: 'listFeaturedItems',
                      //   InvocationType: 'RequestResponse',
                      //   Payload: ''
                      // };
                      //
                      // lambda.invoke(params, function(err, result) {
                      //   if (err) console.log(err, err.stack); // an error occurred
                      //   else {
                      //
                      //     var payload = JSON.parse(result.Payload)
                      //     var body = JSON.parse(payload.body)
                      //     console.log(body);           // successful response
                      //     that.setState(body);
                      //     }
                      // });

                    }
                });
                // AWS.config.credentials

                // Instantiate aws sdk service objects now that the credentials have been updated.
                // example: var s3 = new AWS.S3();

            });
        }
    }

    componentDidMount() {
        this.loadAuthenticatedUser();
        // var that = this;
        // console.log("Component mounted!");

    }

}

export default App;
