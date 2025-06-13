// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use chrono::Local;
use dotenvy_macro::dotenv;
use serde::{Deserialize, Serialize};
use specta::Type;
use specta_typescript::Typescript;
use std::str::FromStr;
use tauri::State;
use tauri_plugin_http::reqwest::Client;
use tauri_specta::{collect_commands, Builder};
use thingspeak_rs::ThingSpeak;

pub struct Ctx {
    http: Client,
    plots: ThingSpeak,
    settings: ThingSpeak,
}

impl Ctx {
    pub fn new(http: Client, plots: ThingSpeak, settings: ThingSpeak) -> Self {
        Self {
            http,
            plots,
            settings,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Type)]
struct Data {
    id: uuid::Uuid,
    name: String,
    value: f64,
    graph: Graph,
}

#[derive(Debug, Serialize, Deserialize, Type)]
struct Graph(Vec<(String, f64)>);

impl Graph {
    pub fn new(dataset: Vec<(String, f64)>) -> Self {
        Self(dataset)
    }
}

#[derive(Debug, Serialize, Deserialize, Type)]
struct Setting {
    name: String,
    value: u32,
}

#[tauri::command]
#[specta::specta]
async fn getsettings(ctx: State<'_, Ctx>) -> Result<Vec<Setting>, ()> {
    // TODO: FIX
    let response = ctx.settings.get_channel().await.unwrap();
    let mut parsed: Vec<Setting> = vec![];
    for value in response.get_latest_entry_values() {
        parsed.push(Setting {
            name: value.label.to_string(),
            value: u32::from_str(value.value).unwrap(),
        });
    }

    Ok(parsed)
}

#[tauri::command]
#[specta::specta]
async fn fetchplots(ctx: State<'_, Ctx>) -> Result<Vec<Data>, ()> {
    let plots = &ctx.plots;
    // TODO: Fix
    let response = plots.get_channel().await.unwrap();
    let mut parsed: Vec<Data> = vec![];
    for (index, value) in response.get_latest_entry_values().enumerate() {
        let name = value.label.to_string();
        let current_value = f64::from_str(&value.value).unwrap();

        let values = response
            .get_all_entry_values()
            .filter(|val| val.label == name)
            .map(|channel_value| {
                let parsed = channel_value.value.parse::<f64>().ok()?;
                let label = channel_value.created_at.to_string();
                Some((label, parsed))
            })
            .flatten()
            .collect();

        let graph = Graph::new(values);

        let data = Data {
            id: uuid::Uuid::new_v4(),
            name,
            value: current_value,
            graph,
        };

        parsed.push(data);
    }

    Ok(parsed)
}

fn main() {
    let http = Client::new();
    let api_key = dotenv!("PLOTS_KEY");
    let channel = dotenv!("PLOTS_CHANNEL");
    let channel_id: u32 = channel
        .trim()
        .parse()
        .expect("PLOTS_CHANNEL should be a number");
    let plots = ThingSpeak::new(http.clone(), channel_id, api_key.to_string());

    let api_key = dotenv!("SETTINGS_KEY");
    let channel = dotenv!("SETTINGS_CHANNEL");
    let channel_id: u32 = channel
        .trim()
        .parse()
        .expect("SETTINGS_CHANNEL should be a number");
    let settings = ThingSpeak::new(http.clone(), channel_id, api_key.to_string());

    let ctx = Ctx::new(http, plots, settings);

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
