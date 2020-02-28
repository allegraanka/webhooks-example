'use strict';

var mcrypt = require( 'mcrypt' );
var crypto = require( 'crypto' );

var DELIM = '~~~';

var genRandomString = function ( stringLength ) {
	var characters = '0123456789abcdefghijklmnopqrstuvwxyz';
	var string = '';

	for ( var p = 0; p < stringLength; p ++ ) {
		string += characters.charAt( Math.floor( Math.random() * characters.length ) );
	}

	return string;
}

var encrypt = function ( keyString, value ) {
	var origKey = keyString;

	if ( keyString.length > 32 ) {
		keyString = keyString.substr( 0, 32 );
	}
	while ( keyString.length < 32 ) {
		keyString = keyString + 'X';
	}

	var cypher = new mcrypt.MCrypt( 'rijndael-128', 'ecb' );

	var iv = genRandomString( 16 );

	cypher.open( keyString, iv );
	var blockSize = cypher.getBlockSize();
	var padding = blockSize - (
			value.length % blockSize
		);
	for ( var i = 0; i < padding; i ++ ) {
		value += String.fromCharCode( padding );
	}

	var cipherText = cypher.encrypt( value );

	var safe = urlensafe( cipherText );

	return safe + DELIM + hashHmacSha256( origKey, safe );
};

var decrypt = function ( keyString, data ) {
	var pos = data.indexOf( DELIM );
	if ( pos > 0 ) {
		data = data.substr( 0, pos );
	}

//	data = urldesafe( data );

	if ( keyString.length > 32 ) {
		keyString = keyString.substr( 0, 32 );
	}
	while ( keyString.length < 32 ) {
		keyString = keyString + 'X';
	}

	var iv = genRandomString( 16 );

	var cypher = new mcrypt.MCrypt( 'rijndael-128', 'ecb' );

	cypher.open( keyString, iv );

	data = data.replace( /\-/g, '+').replace( /\_/g, '/' );
	data =  new Buffer( data, 'base64' );

	var cipherText = cypher.decrypt( data ).toString();

	var endCharVal = cipherText.substr(cipherText.length-1 ).charCodeAt(0);

	if ( ( endCharVal <= 16 ) && ( endCharVal >= 0) ) {
		cipherText = cipherText.substr( 0, cipherText.length - endCharVal);
	}

	return cipherText;
}

var urlensafe = function ( data ) {
	data = new Buffer( data ).toString( 'base64' )
	return data.replace( /\+/g, '-' ).replace( /\//g, '_' ).replace( /=+$/, '' );
}

var urldesafe = function ( data ) {
	data = data.replace( /\-/g, '+').replace( /\_/g, '/' );
	return new Buffer( data, 'base64' ).toString( );
}

var hashHmacSha256 = function ( key, value ) {
	var hmac = crypto.createHmac( 'sha256', key );
	hmac.write( value );
	hmac.end();
	return urlensafe( hmac.read() );
}

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
module.exports.genRandomString = genRandomString;