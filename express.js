
require('dotenv').config();
const express = require('express')
const passport = require('passport')
BearerStrategy = require('passport-azure-ad').BearerStrategy
const cors = require('cors')
const embed = require('./embed.js');
const app = express();
const bodyParser = require('body-parser')
const config = require('./config/config');
const authenticatedUserTokens = [];
const UserDao = require('./Dao/UserDao')
const VisualizationDao = require('./Dao/VisualizationDao')

app.use(bodyParser.json());
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

app.use(passport.initialize())
 app.use(passport.session())
 app.use(cors({
   origin : "http://localhost:3000" 
}));

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

app.get('/embed/items', passport.authenticate('oauth-bearer', { session: false}), async (req, res) => {
  console.log(req.user)
  const us = await UserDao.findUser(req.user.preferred_username);
  if(us.length === 0)
    res.status(404).json({message: "No visualizations found for the selecred User"})
  else{
    const vs = await VisualizationDao.getVisualizationsByUser(req.user.preferred_username);
    console.log(us)
    res.json(vs)
  }
});

app.get('/embed/items/:itemId', passport.authenticate('oauth-bearer', { session: false}), async (req, res, next) => {
  const us = await UserDao.findUser(req.user.preferred_username);
  if(us.length === 0)
    res.status(404).json({message: "No visualizations found for the selecred User"})
  else {
    const config = {};
    const di = await VisualizationDao.getDomoId(req.params.itemId);
    config.embedId = di[0].idDomo;
    config.filters = await VisualizationDao.getFiltersByVisId(req.user.preferred_username, req.params.itemId);
    config.filters = config.filters.map(f => {
      f.values = f.values.split(', ')
      return f
    });
    embed.handleRequest(req, res, next, config);
  }
});

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

app.listen(argv.port, () => console.log(`Example app listening on port ${argv.port}!`))
