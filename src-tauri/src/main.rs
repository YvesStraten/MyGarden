// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dotenvy_macro::dotenv;
use dynfmt::{Format, SimpleCurlyFormat};
use models::ThingSpeakResponse;
use serde::{Deserialize, Serialize};
use specta::Type;
use specta_typescript::Typescript;
use std::str::FromStr;
use tauri::State;
use tauri_plugin_http::reqwest::Client;
use tauri_specta::{collect_commands, Builder};

mod models;

static CHANNEL_FORMAT: &str = "https://api.thingspeak.com/channels/{}/feeds.json?api_key={}";
static GRAPH_URL: &str = "https://thingspeak.com/channels/{}/charts/{}?bgcolor=%23ffffff&color=%23d62020&results=60&type=line&api_key={}";

pub struct Ctx {
    http: Client,
}

impl Ctx {
    pub fn new(http: Client) -> Self {
        Self { http }
    }
}

#[derive(Debug, Serialize, Deserialize, Type)]
struct Data {
    id: uuid::Uuid,
    name: String,
    value: f64,
    graph: String,
}

#[derive(Debug, Serialize, Deserialize, Type)]
struct Setting {
    name: String,
    value: u32,
}

#[tauri::command]
#[specta::specta]
async fn getsettings(ctx: State<'_, Ctx>) -> Result<Vec<Setting>, ()> {
    let api_key = dotenv!("SETTINGS_KEY");
    let channel = dotenv!("SETTINGS_CHANNEL");
    let url = SimpleCurlyFormat
        .format(CHANNEL_FORMAT, [channel, api_key])
        .unwrap();
    let request = ctx.http.get(url.as_ref());

    let mut parsed: Vec<Setting> = vec![];
    if let Ok(response) = request.send().await {
        let data = response.text().await.unwrap();

        let response: ThingSpeakResponse = serde_json::from_str(&data).expect("Did not work!");
        for value in response.get_latest_entry_values() {
            parsed.push(Setting {
                name: value.label,
                value: u32::from_str(&value.value).unwrap(),
            });
        }
    }

    Ok(parsed)
}

#[tauri::command]
#[specta::specta]
async fn fetchplots(ctx: State<'_, Ctx>) -> Result<Vec<Data>, ()> {
    let api_key = dotenv!("PLOTS_KEY");
    let channel = dotenv!("PLOTS_CHANNEL");
    let url = SimpleCurlyFormat
        .format(CHANNEL_FORMAT, [channel, api_key])
        .unwrap();
    let request = ctx.http.get(url.as_ref());

    let mut parsed: Vec<Data> = vec![];
    if let Ok(response) = request.send().await {
        let data = response.text().await.unwrap();
        let response: ThingSpeakResponse = serde_json::from_str(&data).expect("Did not work!");

        for (index, value) in response.get_latest_entry_values().enumerate() {
            let graph = SimpleCurlyFormat
                .format(
                    GRAPH_URL,
                    [
                        &response.channel.id.to_string(),
                        &(index + 1).to_string(),
                        api_key,
                    ],
                )
                .unwrap();

            let name = value.label;
            let value = f64::from_str(&value.value).unwrap();

            let data = Data {
                id: uuid::Uuid::new_v4(),
                name,
                value,
                graph: graph.to_string(),
            };

            parsed.push(data);
        }
    }

    Ok(parsed)
}

fn main() {
    let http = Client::new();
    let ctx = Ctx::new(http);

    let builder = Builder::<tauri::Wry>::new().commands(collect_commands![fetchplots, getsettings]);

    #[cfg(debug_assertions)]
    builder
        .export(Typescript::default(), "../src/bindings.ts")
        .expect("Failed to export typescript bindings");

    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_shell::init())
        .manage(ctx)
        .invoke_handler(builder.invoke_handler())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
