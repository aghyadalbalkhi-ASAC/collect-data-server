# collect-data-server

## Start With Node Js 

- Create server file `Touch server.js File`
- Create package Josn file and config server
    `npm init -y ` or `npm init -n`
- install dependencies 
    `npm i express cors dotenv superagent pg method-override ejs`

- Create `.env` file 

- requires all dependencies in server.js and require varible & Things -> its like a general Templete so we can copy it and paste and then start write code

```
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
const client = new pg.Client({
    connectionString: DATABASE_URL,
    ssl: {
    rejectUnauthorized: false
    }
});

const app = express();

// Use this as a talking point about environment variables
const PORT = process.env.PORT || 3002;

/////////////// App Setup Related /////////////////////
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

```

- To Create a Route -> such as `/home`

*we use `app.get(route as a string, The handelfunction )` and the function take `req` and `res` as a defulte parameters*

*For Example*

```
app.get('/home',handelHome);

function handelHome (req,res){

    res.send('Hello')       // render on window

    // OR //
    res.render('index.ejs', { booksItems: selctedBooksArr }); 
    
    // it render in specific ejs page (index.ejs) and pass an object that carry the data to this page
}
```

- postgresql DB Commands

- First make sure that we install postgresql in our Device and we install postgresql npm package
    - `brew install postgresql`
    - `npm i pg`
    
- rur the server first
    - `pg_ctl -D /home/linuxbrew/.linuxbrew/var/postgres start`

**Hint :** *To Stop The Server*
- `pg_ctl -D /home/linuxbrew/.linuxbrew/var/postgres stop`

- access The DB by Type `psql`

- Create a Database by type `CREATE DATABASE databasename;` - > `CREATE DATABASE rounds;`

- afer create a database we will create the `schema.sql` in our dircotry

```
CREATE TABLE IF NOT EXISTS
round(
    id SERIAL PRIMARY KEY NOT NULL,
    typeofactivity VARCHAR(256) NOT NULL,
    ownerName VARCHAR(256) NOT NULL,
    idtype VARCHAR(256) NOT NULL,
    idnum INTEGER NOT NULL,
    dob DATE NOT NULL,
    telnum INTEGER NOT NULL,
    notes VARCHAR(256) NOT NULL,
    namesofobservers TEXT NOT NULL
);

```

- To run the schema file on the database (local database) 
    - `psql -f schema file path -d database name`        - > `psql -f schema.sql -d rounds`

- To connect pg Heroku database `heroku pg:psql --app abd-ali-form`

- The Correct way to fire / fetch and post data 

```
handleSubmit(event) {
        let url = `http://localhost:3031/round`;
        fetch(url,
        {
            body: JSON.stringify(this.state),           // should be a JOSN Format and an Object
            method: "post"
        }).then(res => res.json())                      // the res should convert josn to object
        .then(res => console.log('fuck',res));          // res is the fetch response from server

        event.preventDefault();
    }
```