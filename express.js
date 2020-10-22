
require('dotenv').config();
const express = require('express')
const passport = require('passport')
const session = require('express-session')
BearerStrategy = require('passport-azure-ad').BearerStrategy
const cors = require('cors')
const path = require('path');
const fs = require('fs');
const embed = require('./embed.js');
const app = express();
const bodyParser = require('body-parser')
const config = require('./config');
const authenticatedUserTokens = [];

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({
//  extended: false
//}))
const users = require('./users.js');
const yargs = require('yargs');

const argv = yargs
    .option('port', {
        alias: 'p',
        description: 'Specify which port to listen on',
        default: config.serverPort,
        type: 'number',
    })
    .help()
    .alias('help', 'h')
    .argv;

function findUser (username) {
  user = users.find(user => {
    return user.username === username
  })
  return user;
}

// passport.serializeUser(function (user, cb) {
//   cb(null, user.username)
// })

// passport.deserializeUser(function (username, cb) {
//   findUser(username, cb)
// })

const authenticationStrategy = new BearerStrategy(config.credentials, (token, done) => {
  let currentUser = null;
  let userToken = authenticatedUserTokens.find((user) => {
      currentUser = user;
      user.sub === token.sub;
  });

  if(!userToken) {
      authenticatedUserTokens.push(token);
  }
  return done(null, currentUser, token);
});

passport.use(authenticationStrategy);

//function authenticationMiddleware () {
//  return function (req, res, next) {
//    if (req.isAuthenticated()) {
//      return next()
//    }
//    res.json({ text: "Unauthorized" })
//  }
//}

//passport.authenticationMiddleware = authenticationMiddleware;

// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: false
// }))
app.use(passport.initialize())
// app.use(passport.session())
// app.use(cors({
//   origin : "http://localhost:3000" 
// }));

//enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
  next();
});


if (!process.env.EMBED_ID || !process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.EMBED_TYPE ) {
  console.log('The following variables must be declared in your .env file: EMBED_ID, CLIENT_ID, CLIENT_SECRET, EMBED_TYPE.');
  return;
}

app.get('/embed/items', passport.authenticate('oauth-bearer', { session: false}), (req, res) => {
  console.log(req.user)  
  let u = findUser(req.user.preferred_username);
    res.json({ visualizations: u.visualizations})
});

app.get('/embed/items/:itemId', passport.authenticate('oauth-bearer', { session: false}), (req, res, next) => {
  let u = findUser(req.user.preferred_username);
  if(!u || u===undefined) {
    res.status(404).json({message: "User Not Found"})
  }
  if (u.config['visualization'+req.params.itemId].embedId) {
    embed.handleRequest(req, res, next, u.config['visualization'+req.params.itemId]);
  } else {
    next(`The EMBED_ID${req.params.itemId} environment variable in your .env file is not set. Please set this in order to view content here.`);
  }
});

// app.get('/embed/page', passport.authenticationMiddleware(), (req, res, next) => {
//   embed.showFilters(req, res);
// });

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'/login.html'));
})

app.post('/login', passport.authenticate('oauth-bearer', { session: false }), (req, res) => {
    //res.json({ username: req.user.username,
    //           visualizations: req.user.visualizations })
    console.log('User info: ', req.user);
        console.log('Validated claims: ', req.authInfo);
        
        if ('scp' in req.authInfo && req.authInfo['scp'].split(" ").indexOf("demo.read") >= 0) {
            // Service relies on the name claim.  
            res.status(200).json({'name': req.authInfo['name']});
        } else {
            console.log("Invalid Scope, 403");
            res.status(403).json({'error': 'insufficient_scope'}); 
        }
  }
);




// app.get('/dashboard', passport.authenticationMiddleware(), (req, res, next) => {
//   fs.readFile(path.join(__dirname, process.env.USE_XHR ? 'sample_xhr.html' : 'sample.html'), 'utf8', function(err, contents) {
//     let newContents = contents.replace('USER', `${req.user.username}`);
//     newContents = newContents.replace('REPLACE_IFRAME_FROM_ENV', process.env.REPLACE_IFRAME);
//     res.send(newContents);
//   });
// });

app.use(express.static('public'))

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.listen(argv.port, () => console.log(`Example app listening on port ${argv.port}!`))
