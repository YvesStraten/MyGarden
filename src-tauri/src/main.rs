// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dotenvy_macro::dotenv;
use dynfmt::{Format, SimpleCurlyFormat};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tauri::State;
use tauri_plugin_http::reqwest::Client;
use std::str::FromStr;

static CHANNEL_FORMAT: &str = "https://api.thingspeak.com/channels/{}/feeds.json?api_key={}&results=1";
static GRAPH_URL: &str = "https://thingspeak.com/channels/{}/charts/{}?bgcolor=%23ffffff&color=%23d62020&results=60&type=line&api_key={}";

pub struct Ctx {
    http: Client, 
}

impl Ctx {
    pub fn new(http: Client) -> Self {
        Self { http }
    }
}

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
async fn getsettings(ctx: State<'_, Ctx>) -> Result<Vec<Setting>, ()> {
    let api_key = dotenv!("SETTINGS_KEY");
    let channel = dotenv!("SETTINGS_CHANNEL");
    let url = SimpleCurlyFormat.format(CHANNEL_FORMAT, [channel, api_key]).unwrap();
    let request = ctx.http.get(url.as_ref());

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
async fn fetchplots(ctx: State<'_,  Ctx>) -> Result<Vec<Data>, ()> {
    let api_key = dotenv!("PLOTS_KEY");
    let channel = dotenv!("PLOTS_CHANNEL");
    let url = SimpleCurlyFormat.format(CHANNEL_FORMAT, [channel, api_key]).unwrap();
    let request = ctx.http.get(url.as_ref());

    let mut parsed: Vec<Data> = vec![];
    if let Ok(response) = request.send().await {
        let data = response.text().await.unwrap();
        let json: Value = serde_json::from_str(&data).expect("Did not work!");

        let length = &json["feeds"][0].as_object().unwrap().keys().len() - 1;

        for graph_number in 1..length {
            let channel_data = &json["channel"];
            let current_field = format!("field{}", graph_number);

            let value_option = json["feeds"][0].get(&current_field).unwrap();
            let graph = SimpleCurlyFormat.format(GRAPH_URL, [channel, &graph_number.to_string(), api_key]).unwrap();

            let data = Data {
                id: uuid::Uuid::new_v4(),
                name: channel_data.get(&current_field).unwrap().clone(),
                value: f64::from_str(value_option.as_str().unwrap()).unwrap(),
                graph: graph.to_string()
            };

            parsed.push(data);
        }
    }

    Ok(parsed)
}

fn main() {
    let http = Client::new();
    let ctx = Ctx::new(http);

    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_shell::init())
        .manage(ctx)
        .invoke_handler(tauri::generate_handler![fetchplots, getsettings])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
