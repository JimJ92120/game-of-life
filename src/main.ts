import init, {
  Board
} from "../dist/lib";
import Engine from "./engine";

window.addEventListener("DOMContentLoaded", () => {
  init()
    .then(() => {
      const engine: Engine = new Engine("scene");
      const board: Board = new Board(engine.resolution[1], engine.resolution[0]);
      engine.draw(new Float32Array(board.cells));

      let loop = 0.0;
      const animate: FrameRequestCallback = () => {
        if (loop % 100 === 0) {
          if (loop > 0) {
            board.toggle_cells();
          }

          engine.draw(new Float32Array(board.cells));
        }
    
        loop = requestAnimationFrame(animate);
      };
    
      requestAnimationFrame(animate);
  });
});
