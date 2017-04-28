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
function LINE_LOGIN_SPNV(_jsonData) {

    this.name = _jsonData.name;
    this.channelId = _jsonData.channelId;
    this.channelSecret = _jsonData.channelSecret;

    console.log(" LINE_LOGIN_SPNV Console : " + this.name + " start working ");
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
            callback(data1);
        });
    });
};

LINE_LOGIN_SPNV.prototype.isLogin = function(_res, _redirect, _state) {

    var that = this;

    return function(req, res, next) {
        if (!req.cookies.userId) {
            res.redirect('https://access.line.me/dialog/oauth/weblogin?response_type=' + _res +
                '&client_id=' + that.channelId +
                '&redirect_uri=' + _redirect +
                '&state=' + _state);
        } else {
            next();
        }
    }
}

module.exports = LINE_LOGIN_SPNV;
