const express = require('express');

const config = require('./server/config');
//-------------DATABASE--------------------
require('./datebase');
const app = config( express() );

//-------------Starding the server-----------------------
app.listen( app.get('port'), () => {
    console.log( 'Server on port', app.get('port') );
    
});


