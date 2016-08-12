[![Travis](https://img.shields.io/travis/mediamonks/seng-gyro.svg?maxAge=2592000)](https://travis-ci.org/mediamonks/seng-gyro)
[![Code Climate](https://img.shields.io/codeclimate/github/mediamonks/seng-gyro.svg?maxAge=2592000)](https://codeclimate.com/github/mediamonks/seng-gyro)
[![Coveralls](https://img.shields.io/coveralls/mediamonks/seng-gyro.svg?maxAge=2592000)](https://coveralls.io/github/mediamonks/seng-gyro?branch=master)
[![npm](https://img.shields.io/npm/v/seng-gyro.svg?maxAge=2592000)](https://www.npmjs.com/package/seng-gyro)
[![npm](https://img.shields.io/npm/dm/seng-gyro.svg?maxAge=2592000)](https://www.npmjs.com/package/seng-gyro)

# seng-gyro

Add a description here...


## Installation

### npm

```sh
npm i -S seng-gyro
```

### other

We also have browser, amd, commonjs, umd, systemjs and es6 versions of
this module available attached to the [Github Releases](https://github.com/mediamonks/seng-gyro/releases).

<!---

Note: The below cannot be used yet, as there is no way to link to a
specific version yet without updating this readme manually after each
new version.


### browser

```html
<script src="http://mediamonks-development.s3.amazonaws.com/seng/libs/seng-gyro/1.2.0/seng-gyro.min.js"></script>
```
```js
console.log(window.SengGyro)
```

### other

Besides the browser version, there are other versions available for
download as well:

- [browser](http://mediamonks-development.s3.amazonaws.com/seng/libs/seng-gyro/1.2.0/seng-gyro.js) (and [minified](http://mediamonks-development.s3.amazonaws.com/seng/libs/seng-gyro/1.2.0/seng-gyro.min.js))
- [umd](http://mediamonks-development.s3.amazonaws.com/seng/libs/seng-gyro/1.2.0/seng-gyro.js) (and [minified](http://mediamonks-development.s3.amazonaws.com/seng/libs/seng-gyro/1.2.0/seng-gyro-umd.min.js))
- [amd](http://mediamonks-development.s3.amazonaws.com/seng/libs/seng-gyro/1.2.0/seng-gyro-amd.js)
- [commonjs](http://mediamonks-development.s3.amazonaws.com/seng/libs/seng-gyro/1.2.0/seng-gyro-commonjs.js)
- [systemjs](http://mediamonks-development.s3.amazonaws.com/seng/libs/seng-gyro/1.2.0/seng-gyro-system.js)
- [es6](http://mediamonks-development.s3.amazonaws.com/seng/libs/seng-gyro/1.2.0/seng-gyro-es6.zip)

-->

### manual

Check the **build** section below to see your you can build for all the
targets yourself.

## Usage

```ts
import SengGyro from 'seng-gyro';
// import SengGyro from 'seng-gyro/lib/classname';

// do something with SengGyro
```


## Documentation

View the [generated documentation](https://rawgit.com/mediamonks/seng-gyro/master/doc/typedoc/index.html).


## Building

In order to build seng-gyro, ensure that you have [Git](http://git-scm.com/downloads)
and [Node.js](http://nodejs.org/) installed.

Clone a copy of the repo:
```sh
git clone https://github.com/mediamonks/seng-gyro.git
```

Change to the seng-gyro directory:
```sh
cd seng-gyro
```

Install typings cli utility:
```sh
npm install typings --global
```

Install dev dependencies:
```sh
npm install
```

Use one of the following main scripts:
```sh
npm run build   		# build this project
npm run generate   		# generate all artifacts (compiles ts, webpack, docs and coverage)
npm run typings			# install .d.ts dependencies (done on install)
npm run test-unit    	# run the unit tests
npm run validate		# runs validation scripts, including test, lint and coverage check
npm run lint			# run tslint on this project
npm run doc				# generate typedoc documentation
npm run typescript-npm	# just compile the typescript output used in the npm module
```

When installing this module, it adds a pre-push hook, that runs the `validate`
script before committing, so you can be sure that everything checks out.

If you want to create the distribution files yourself, you can run the
`build-dist` script, and the following files will get generated in the
`dist` folder:

- **/dist/seng-gyro.js**: bundled with webpack, can be loaded from
	a script tag, available as `window.SengGyro`
- **/dist/seng-gyro.min.js**: same as above, but minified
- **/dist/seng-gyro-amd.js**: bundled with webpack, can be used
	with e.g. requirejs
- **/dist/seng-gyro-commonjs.js**: bundled with webpack, can be
	used in systems that support commonjs, but you should just use npm
- **/dist/seng-gyro-umd.js**: bundled with webpack, works in the
	browser, with requirejs, and in a commonjs system
- **/dist/seng-gyro-umd.min.js**: same as above, but minified
- **/dist/seng-gyro-system.js**: bundled with typescript, can be
	used in systems	that support systemjs
- **/dist/seng-gyro-es6.zip**: transpiled with typescript, only
	types are removed from the source files

## Contribute

View [CONTRIBUTING.md](./CONTRIBUTING.md)


## Changelog

View [CHANGELOG.md](./CHANGELOG.md)


## Authors

View [AUTHORS.md](./AUTHORS.md)


## LICENSE

[MIT](./LICENSE) © MediaMonks


