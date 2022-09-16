# game-of-life

A **Conway's Game of Life** demo using WebAssembly with `Rust` and `TypeScript`.   

See [rules](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).  

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
