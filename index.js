/**

repo : https://supanatvee@bitbucket.org/supanatve/line-login-nodejs.git
description : DON'T write to this file . This file contain a source code that using in
login via LINE
author : spnv

**/

// import module
var request = require('request');

// private

// public
// constructor
function LINE_LOGIN_SPNV(id, secret, name) {
    this.channelId = id;
    this.channelSecret = secret;
    console.log(" LINE_LOGIN_SPNV Console : " + name + " start working ");
    /* Example =>
    var login = new lineLogin('1510166957', '643981886156292ce8d9e816b7677b56', 'login');
    */
}

LINE_LOGIN_SPNV.prototype.getToken = function(_code, _state, _redirect, callback) {

    request.post({
        url: 'https://api.line.me/v2/oauth/accessToken',
        form: {
            grant_type: 'authorization_code',
            client_id: this.channelId,
            client_secret: this.channelSecret,
            code: _code,
            redirect_uri: _redirect
        }
    }, function(error, response, data) {
        var _jsonData = JSON.parse(data);
        callback(_jsonData);
    });
};

LINE_LOGIN_SPNV.prototype.getProfile = function(_token, callback) {
    request.get({
        headers: {
            'Authorization': " Bearer " + _token
        },
        url: 'https://api.line.me/v2/profile'
    }, function(error, response, data) {
        var _jsonData = JSON.parse(data);
        callback(_jsonData);
    });
};

LINE_LOGIN_SPNV.prototype.signIn = function(_code, _state, _redirect, callback) {

    var that = this;

    that.getToken(_code, _state, _redirect, function(data0) {
        that.getProfile(data0.access_token, function(data1) {
            callback(data1.userId);
        });
    });
};

module.exports = LINE_LOGIN_SPNV;
