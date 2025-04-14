// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use serde_json::Value;
use tauri::State;
use tauri_plugin_http::reqwest::Client;
use std::str::FromStr;

#[derive(Serialize, Deserialize)]
struct Data {
    id: uuid::Uuid,
    name: Value,
    value: f64,
    graph: String,
}

#[derive(Serialize, Deserialize)]
struct Setting {
    setting: Value,
    value: u32,
}

#[tauri::command]
async fn getsettings(client: State<'_, Client>) -> Result<Vec<Setting>, ()> {
    let request = client.get("https://api.thingspeak.com/channels/2404379/feeds.json?api_key=NEFL69N7VTI5YCX1&results=1");

    let mut parsed: Vec<Setting> = vec![];
    if let Ok(response) = request.send().await {
        let data = response.text().await.unwrap(); 

        let json: Value = serde_json::from_str(&data).expect("Did not work!");

        let length = &json["feeds"][0].as_object().unwrap().keys().len() - 1;

        for i in 1..length {
            let channel_data = &json["channel"];
            let current_field = format!("field{}", i);

            let value_option = json["feeds"][0].get(&current_field).unwrap();

            let data = Setting {
                setting: channel_data.get(&current_field).unwrap().clone(),
                value: u32::from_str(value_option.as_str().unwrap()).unwrap(),
            };

            parsed.push(data);
        }
    }

    Ok(parsed)
}

#[tauri::command]
async fn fetchplots(client: State<'_,  Client>) -> Result<Vec<Data>, ()> {
    let request = client.get("https://api.thingspeak.com/channels/2400298/feeds.json?api_key=SVWPDJG7Y4WJZUKX&results=1");

    let mut parsed: Vec<Data> = vec![];
    if let Ok(response) = request.send().await {
        let data = response.text().await.unwrap();
        let json: Value = serde_json::from_str(&data).expect("Did not work!");

        let length = &json["feeds"][0].as_object().unwrap().keys().len() - 1;

        for i in 1..length {
            let channel_data = &json["channel"];
            let current_field = format!("field{}", i);

            let value_option = json["feeds"][0].get(&current_field).unwrap();

            let data = Data {
            id: uuid::Uuid::new_v4(),
            name: channel_data.get(&current_field).unwrap().clone(),
            value: f64::from_str(value_option.as_str().unwrap()).unwrap(),
            graph: format!("https://thingspeak.com/channels/2400298/charts/{}?bgcolor=%23ffffff&color=%23d62020&dynamic=true&results=60&type=line&api_key=SVWPDJG7Y4WJZUKX", i),
        };

            parsed.push(data);
        }
    }

    Ok(parsed)
}

fn main() {
    let client = Client::new();

    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_shell::init())
        .manage(client)
        .invoke_handler(tauri::generate_handler![fetchplots, getsettings])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
