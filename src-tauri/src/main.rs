// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde_json::{json, Value};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn fetchplots() -> String {
    let response = reqwest::blocking::get(
        "https://api.thingspeak.com/channels/2400298/feeds.json?api_key=SVWPDJG7Y4WJZUKX&results=1",
    ).unwrap()
    .text().unwrap();

    let data = response.as_str();

    let json: Value = serde_json::from_str(&data).expect("Did not work!");



    return format!("{}", json["feeds"]);
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .invoke_handler(tauri::generate_handler![fetchplots])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
