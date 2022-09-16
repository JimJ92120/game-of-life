# template-wasm-rust-ts

A project's template to use WebAssembly with [`Rust`](https://doc.rust-lang.org/book/) along [`TypeScript`](https://www.typescriptlang.org/docs/handbook/intro.html).  
Template is using [`WebPack 5`](https://webpack.js.org/concepts/) and [`wasm-pack`](https://rustwasm.github.io/docs/wasm-pack/) to compile and build.  

---
---
## Requirements
|              |           |
|--------------|-----------|
| `npm`        | `^6.0`    |
| `Node.js`    | `^14.0`   |
| `TypeScript` | `^4.0`    |
| `Rust`       | `^1.63.0` |
| `Cargo`      | `^1.63.0` |
| `wasm-pack`  | `^0.10.3` |
  

## Project's structure

```sh
/(root)
  /src # app entrypoint (Typescript / JavaScript)
  /lib # lib entrypoint (Rust)
  /static # static assets (e.g index.html)
```


## How to install

```sh
npm install
```


## How to run in debug mode

```sh
# Builds the project and opens it in a new browser tab. Auto-reloads when the project changes.
npm start
```


## How to build in release mode

```sh
# Builds the project and places it into the `dist` folder.
npm run build
```


## How to run unit tests

```sh
# Runs tests in Firefox
npm test -- --firefox

# Runs tests in Chrome
npm test -- --chrome

# Runs tests in Safari
npm test -- --safari
```
