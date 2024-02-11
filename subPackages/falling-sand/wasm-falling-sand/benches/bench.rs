#![allow(unused_variables)]
#![feature(test)]

extern crate test;
extern crate wasm_falling_sand;

#[bench]
fn universe_ticks(b: &mut test::Bencher) {
    let mut universe = wasm_falling_sand::Universe::new(100, 100);

    b.iter(|| {
        universe.tick();
    });
}
