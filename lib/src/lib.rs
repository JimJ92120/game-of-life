
use std::collections::HashMap;

use wasm_bindgen::prelude::*;
// use js_sys::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
}

#[wasm_bindgen]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct Coordinates {
    row: usize,
    column: usize
}

#[wasm_bindgen]
impl Coordinates {
    pub fn new(row: usize, column: usize) -> Self {
        Self {
            row,
            column
        }
    }
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
    DEAD = 0,
    ALIVE = 1,
}

impl Cell {
    pub fn toggle(&mut self) {
        *self = match *self {
            Cell::DEAD => Cell::ALIVE,
            Cell::ALIVE => Cell::DEAD,
        };
    }

    pub fn is_alive(&self) -> bool {
        match *self {
            Cell::DEAD => false,
            Cell::ALIVE => true,
        }
    }
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct Board {
    height: usize,
    width: usize,
    cells: Vec<Cell>
}

#[wasm_bindgen]
impl Board {
    #[wasm_bindgen(constructor)]
    pub fn new(height: usize, width: usize) -> Self {
        let mut board = Self {
            height,
            width,
            cells: vec![]
        };

        board.set_cells();

        board
    }

    pub fn get_board_length(&self) -> usize {
        self.height * self.width
    }

    pub fn set_cells(&mut self) {
        self.cells = (0..self.get_board_length()).map(|index| {
            match index % 2 {
                0 => Cell::ALIVE,
                _ => Cell::DEAD
            }
        }).collect();
    }

    #[wasm_bindgen(getter)]
    pub fn cells(&self) -> js_sys::Uint8Array {
        let arr: Vec<u8> = self.cells.iter().map(|i| {
            *i as u8
        }).collect();

        js_sys::Uint8Array::from(&arr[..])
    }

    pub fn get_cell_position_by_index(&self, cell_index: usize) -> Coordinates {
        Coordinates::new(
            cell_index.div_euclid(self.width),
            cell_index % self.width
        )
    }

    pub fn get_cell_index_by_position(&self, position: Coordinates) -> usize {
        position.row * self.width + position.column
    }

    fn is_cell_alive_by_position(&self, cell_position: Coordinates) -> bool {
        let cell_index: usize = self.get_cell_index_by_position(
            cell_position
        );
        
        self.cells[cell_index].is_alive()
    }

    fn get_neighbours_coordinates_to_check(&self, current_position: Coordinates) -> HashMap<&str, (bool, usize)> {
        let mut coordinates_to_check: HashMap<&str, (bool, usize)> = HashMap::new();
        coordinates_to_check.insert("UP", (
            current_position.row < self.height - 1,
            current_position.row + 1
        ));
        coordinates_to_check.insert("DOWN", (
            current_position.row > 0,
            current_position.row - 1
        ));
        coordinates_to_check.insert("RIGHT", (
            current_position.column < self.width - 1,
            current_position.column + 1
        ));
        coordinates_to_check.insert("LEFT", (
            current_position.column > 0,
            current_position.column - 1
        ));

        coordinates_to_check
    }

    pub fn get_neighbours_count(&self, cell_index: usize) -> usize {
        let current_position: Coordinates = self.get_cell_position_by_index(cell_index);
        let coordinates_to_check: HashMap<&str, (bool, usize)> = 
            self.get_neighbours_coordinates_to_check(current_position);

        let mut neighbours_count: usize = 0;

        if coordinates_to_check["UP"].0 {
            let mut neighbour_position: Coordinates = Coordinates::new(
                coordinates_to_check["UP"].1,
                current_position.column
            );
            if self.is_cell_alive_by_position(neighbour_position) {
                neighbours_count += 1;
            }

            if coordinates_to_check["RIGHT"].0 {
                neighbour_position.column = coordinates_to_check["RIGHT"].1;

                if self.is_cell_alive_by_position(neighbour_position) {
                    neighbours_count += 1;
                }
            }

            if coordinates_to_check["LEFT"].0 {
                neighbour_position.column = coordinates_to_check["LEFT"].1;

                if self.is_cell_alive_by_position(neighbour_position) {
                    neighbours_count += 1;
                }
            }
        }

        if coordinates_to_check["DOWN"].0 {
            let mut neighbour_position: Coordinates = Coordinates::new(
                coordinates_to_check["DOWN"].1,
                current_position.column
            );
            if self.is_cell_alive_by_position(neighbour_position) {
                neighbours_count += 1;
            }

            if coordinates_to_check["RIGHT"].0 {
                neighbour_position.column = coordinates_to_check["RIGHT"].1;

                if self.is_cell_alive_by_position(neighbour_position) {
                    neighbours_count += 1;
                }
            }

            if coordinates_to_check["LEFT"].0 {
                neighbour_position.column = coordinates_to_check["LEFT"].1;

                if self.is_cell_alive_by_position(neighbour_position) {
                    neighbours_count += 1;
                }
            }
        }

        if coordinates_to_check["RIGHT"].0 {
            let neighbour_position: Coordinates = Coordinates::new(
                current_position.row,
                coordinates_to_check["RIGHT"].1
            );

            if self.is_cell_alive_by_position(neighbour_position) {
                neighbours_count += 1;
            }
        }

        if coordinates_to_check["LEFT"].0 {
            let neighbour_position: Coordinates = Coordinates::new(
                current_position.row,
                coordinates_to_check["LEFT"].1
            );

            if self.is_cell_alive_by_position(neighbour_position) {
                neighbours_count += 1;
            }
        }

        neighbours_count
    }

    pub fn toggle_cells(&mut self) {
        let mut cells_clone = self.cells.clone();
    
        for cell_index in 0..self.get_board_length() {
            let neighbours_count: usize = self.get_neighbours_count(cell_index);
            let is_alive: bool = self.cells[cell_index].is_alive();

            if is_alive {
                if neighbours_count != 2 && neighbours_count != 3 {
                    cells_clone[cell_index].toggle();
                }
            } else {
                if neighbours_count == 3 {
                    cells_clone[cell_index].toggle();
                }
            }
        }

        self.cells = cells_clone;
    }
}
