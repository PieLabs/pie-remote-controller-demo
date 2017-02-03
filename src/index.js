const minimist = require('minimist');
const express = require('express');
const http = require('http');
const opn = require('opn');
const _ = require('lodash');
const pug = require('pug');
const {join} = require('path');
const {readJsonSync, readFileSync, existsSync, createReadStream} = require('fs-extra');
const jsesc = require('jsesc');
const PieController = require('./pie-controller').default;
const bodyParser = require('body-parser');


function run(args) {

  let parsed = _.extend({
    launchBrowser: false,
    cwd: process.cwd(),
    viewJs: 'pie-view.js',
    controllerJs: 'pie-controller.js',
    markup: 'index.html',
    config: 'config.json'
  }, minimist(args));

  console.log('args: ', parsed);

  const app = express();
  app.use(bodyParser.json());

  const markup = readFileSync(join(parsed.cwd, parsed.markup), 'utf8');
  const config = readJsonSync(join(parsed.cwd, parsed.config), 'utf8');

  /** 
   * TODO: We should inspect the elements array 
   * to see which of them are 'pies' and which are regular custom elements. 
   * For now just going to assume that the models array is solely for the pies. */
  config.pies = config.models;
  const controllerMap = require(join(parsed.cwd, parsed.controllerJs));
  const controller = new PieController(config, controllerMap);

  app.set('view engine', 'pug');
  app.set('views', join(__dirname, 'views'));

  app.use(express.static(join(__dirname, 'public')));

  app.get('/', (req, res) => {
    res.render('index', {
      viewJs: parsed.viewJs,
      markup: markup,
      endpoints: {
        model: {
          method: 'POST', path: '/model'
        }
      },
      elementModels: [],
      pretty: true
    });
  });

  app.post('/model', (req, res) => {
    console.log(req.body);
    let {session, env} = req.body;
    controller.model(session, env)
      .then(m => {
        res.json(m);
      })
      .catch(e => {
        res.status(400).send(e.message);
      })
  });

  app.get('/' + parsed.viewJs, (req, res) => {
    let jsPath = join(parsed.cwd, parsed.viewJs);
    console.log('>>> !exists?', jsPath, existsSync(jsPath));
    let rs = createReadStream(jsPath);
    res.setHeader('Content-Type', 'text/javascript');
    rs.pipe(res);
  });

  let server = http.createServer(app);

  let port = process.env.PORT || 4002;

  server.on('listening', () => {
    console.log(`server listening on port: ${port}`);

    if (parsed.launchBrowser) {
      opn(`http://localhost:${port}`, { app: 'google-chrome' })
        .then(() => {
          console.log('browser launched');
        })
        .catch((e) => console.error(e.message));
    }
  });
  server.on('error', (e) => console.error(e.message));
  server.listen(port);
}

run(process.argv.slice(2));
