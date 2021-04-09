'use strict';

require('dotenv').config();
const express = require('express');

/////////////// API Related /////////////////////
const superagent = require('superagent');

/////////////// Post request Related /////////////////////
const methodOverride = require('method-override');


const cors = require('cors');

/////////////// Database Related /////////////////////
const pg = require('pg');
const DATABASE_URL = process.env.DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV;
const options = NODE_ENV === 'production' ? { connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } } : { connectionString: DATABASE_URL };

const client = new pg.Client(options);

// for herouk
// const client = new pg.Client({
//     connectionString: DATABASE_URL,
//     ssl: {
//     rejectUnauthorized: false
//     }
// });
const app = express();

// Use this as a talking point about environment variables
const PORT = process.env.PORT || 3002;

/////////////// App Setup Related /////////////////////
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.json({
    type: ['application/json', 'text/plain']
    }))


//////////////////// End Points ////////////////////

app.get('/rounds',handelHome);

function handelHome (req,res){

    let SQL = 'SELECT * FROM round;';
    client.query(SQL)
        .then( results => {
        res.status(200).json(results.rows);

        }).catch( error => {
            console.log('ERROR', error);
            res.status(500).send('So sorry, something went wrong.');
        });

    // res.send('Hello')
}

app.post('/round',handelAddRound);

function handelAddRound (req,res){

    let data = req.body;
    let safeValues = [
        data.typeofactivity,
        data.ownerName,
        data.idtype,
        data.idnum,
        data.dob,
        data.notes,
        data.telnum,
        data.namesofobservers];

    let SQL = 'INSERT INTO round (typeofactivity, ownerName,idtype,idnum,dob,notes,telnum,namesofobservers) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;';
    
    client.query(SQL, safeValues)
    .then( results => {
        
        res.status(200).json(results);
    })
    .catch( error => {
        console.log('ERROR', error);
        res.status(500).send('So sorry, something went wrong.');
    });

    // console.log(req.body);
    // res.send(JSON.stringify('Form Filled Successfully'));
}

app.post('/search',handelSearch);

function handelSearch (req,res){
    
    let statment = '';
    let searchField = (req.body.searchField).trim();
    let typeofsearch=  req.body.typeofsearch;

    let dobFrom = req.body.dobFrom;
    let dobTo=  req.body.dobTo;


    if(typeofsearch ==='namesofobservers' || typeofsearch ==='ownerName' ){
     statment =`SELECT * FROM round WHERE ${typeofsearch}='${searchField}';`;

    }else if(dobFrom !=='' || dobTo !=='' ){

    statment =`SELECT * FROM round WHERE dob BETWEEN '${dobFrom}'  AND '${dobTo}';`;
    
    }else{
     statment =`SELECT * FROM round WHERE ${typeofsearch}=${searchField};`;
    }

    client.query(statment).then(data => {

        if (data.rowCount !== 0) {
            // res.redirect(`/search`);
            // res.send(data)
            res.send(data.rows);

        } else {
            res.send(JSON.stringify('Data Not Found'));    
        }
    
        }).catch(error => {
        console.log('Error In query at Check Your Query', error);
        });



    // res.send(JSON.stringify('Hello Search',req.body));
}



app.post('/login',handelLogin);

function handelLogin (req,res){

    let credentials = req.body;

    let statment =`SELECT * FROM admins WHERE username='${credentials.username}' AND passwords='${credentials.password}';`;

    client.query(statment).then(data => {

        if (data.rowCount !== 0) {
            // res.redirect(`/search`);
            // res.send(data)
            res.send(JSON.stringify('ok'));

        } else {
            res.send(JSON.stringify('Incorrect Info'));    
        }
    
        }).catch(error => {
        console.log('Error In query at CheckDBLogin', error);
        });


    // console.log(req.body)
    // res.send(JSON.stringify('Form Filled Successfully'));

}







client.connect().then(() => {
    app.listen(PORT, () => {
        console.log(`app is listning on port${PORT}`);
        });

    }).catch(err => {
    console.log('sorry..  an error occured', err);
    });

