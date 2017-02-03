# pie-remote-controller-demo 

This is a simple web app that demonstrates rendering a pie on the client and running controller logic on the server. This setup would typically be required in a secure testing environment.


## Installation 

### Option One - global install

```shell
npm install -g PieLabs/pie-remote-controller-demo
# you can now run the command using `prcd`
```

### Option Two - local install

```shell
npm install PieLabs/pie-remote-controller-demo
# you can now run the command using: `./node_modules/.bin/prcd`
```

### Usage

The app needs the following files available for it to run:

* pie-view.js
* pie-controller.js
* config.json 
* index.html

The 2 js files can be generated using the [pie tool](http://github.com/PieLabs/pie-cli) by running `pie pack`.

The other 2 files are used to define a pie item, so should already exist.

#### Example 
```shell
cd my-pie/docs/demo
ls -la  #=> config.json, index.html
pie pack #=> builds the 2 js files
prcd
# or if you want to run it locally 
npm install PieLabs/pie-remote-controller-demo
./node_modules/.bin/prcd
```

This will start up a server that will render the pie client and will make calls to the server to build the ui model.


#### CLI Options 

* `--cwd` - the current dir, default: `process.cwd()`
* `--viewJs` - the name of the pie view logic, default: `pie-view.js`
* `--controllerJs` - the name of the pie controller logic, default: `pie-controller.js`
* `--markup` - the name of the markup file, default: `index.html`
* `--config` - the name of the config file, default: `config.json`