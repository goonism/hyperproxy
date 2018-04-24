----

<p align="center" class="toc">
   <strong><a href="#setup">Setup</a></strong>
   |
   <strong><a href="#writing-tests">Writing tests</a></strong>
   |
   <strong><a href="#debugging-code">Debugging code</a></strong>
   |
   <strong><a href="#internals">Internals</a></strong>
</p>

----


# Contributing

Contributions are always welcome, no matter how large or small. Before
contributing, please read the
[code of conduct](https://github.com/goonism/hyperproxy/blob/master/documentation/CODE_OF_CONDUCT.md).

## Not sure where to start?

- If you aren't just making a documentation change, you'll probably want to learn a bit about a few topics.

- Check out [`/documentation`](https://github.com/goonism/hyperproxy/tree/master/documentation) for information about Hyperproxy's internals

- When you feel ready to jump into the Hyperproxy source code, a good place to start is to look for issues tagged with [help wanted](https://github.com/goonism/hyperproxy/labels/help%20wanted) and/or [good first issue](https://github.com/goonism/hyperproxy/labels/good%20first%20issue).

## Developing

Hyperproxy is built for Node 9 and up.

Make sure that Yarn is installed with version >= `0.28.0`.
Installation instructions can be found here: https://yarnpkg.com/en/docs/install.

### Setup

```sh
$ git clone https://github.com/goonism/hyperproxy
$ cd hyperproxy
$ lerna bootstrap
```

Then you can run:

```sh
$ lerna run build
$ lerna run start
```

### Guide on lerna

The following are a list of useful root commands (commands that should be run from the root directory):

```
"yarn bootstrap": Bootstrap dependency for all modules
"yarn test": Run unit tests in each module
"yarn prepare": Prepare all packages to be publish
"yarn clean": Clean up all local build artifacts
```

### Writing tests

Most packages in [`/packages`](https://github.com/hyperproxy/tree/master/packages) have a `test` folder.

### Debugging code

A common approach to debugging JavaScript code is to walk through the code using the [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/) debugger.

### Submitting a PR

Make sure to run `eslint` on your code before submitting a pull request, please!