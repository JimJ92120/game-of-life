import init, * as wasm from "../dist/lib";

init()
  .then(() => {
    wasm.greet("WASM");
  });
