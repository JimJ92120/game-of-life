
use wasm_bindgen::prelude::*;
// use js_sys::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    pub fn log(s: &str);
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
        self.cells = (0..self.get_board_length()).map(|index| Cell::DEAD).collect();
    }

    pub fn get_cells(&self) -> js_sys::Uint8Array {
        let arr: Vec<u8> = self.cells.iter().map(|i| {
            *i as u8
        }).collect();

        js_sys::Uint8Array::from(&arr[..])
    }

    pub fn toggle_cells(&mut self) {
        for cell_index in 0..self.get_board_length() {
            self.cells[cell_index].toggle();
        }
    }
}
