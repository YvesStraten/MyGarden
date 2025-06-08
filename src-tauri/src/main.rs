// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use chrono::Local;
use dotenvy_macro::dotenv;
use models::ThingSpeak;
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
struct Graph {
    labels: Vec<String>,
    dataset: Dataset,
}

impl Graph {
    pub fn new(labels: Vec<String>, dataset: Dataset) -> Self {
        Self { labels, dataset }
    }
}

#[derive(Debug, Serialize, Deserialize, Type)]
struct Dataset {
    label: String,
    points: Vec<f32>,
}

impl Dataset {
    pub fn new(label: String, points: Vec<f32>) -> Self {
        Self { label, points }
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
    let response = ctx.settings.get_channel_feeds().await.unwrap();
    let mut parsed: Vec<Setting> = vec![];
    for value in response.get_latest_entry_values() {
        parsed.push(Setting {
            name: value.label,
            value: u32::from_str(&value.value).unwrap(),
        });
    }

    Ok(parsed)
}

#[tauri::command]
#[specta::specta]
async fn fetchplots(ctx: State<'_, Ctx>) -> Result<Vec<Data>, ()> {
    let plots = &ctx.plots;
    // TODO: Fix
    let response = plots.get_channel_feeds().await.unwrap();
    let mut parsed: Vec<Data> = vec![];
    for (index, value) in response.get_latest_entry_values().enumerate() {
        let name = value.label;
        let value = f64::from_str(&value.value).unwrap();
        let entries: Vec<f32> = response
            .get_entries()
            .flat_map(|entry| entry.fields.get(&format!("field{}", index + 1)))
            .flatten()
            .map(|entry| entry.parse().unwrap())
            .collect();

        let tz = Local::now().timezone();
        let labels: Vec<String> = response
            .get_entries()
            .map(|entry| format!("{}", entry.created_at.with_timezone(&tz).format("%H:%M")))
            .collect();

        let dataset = Dataset::new(name.clone(), entries);

        let graph = Graph::new(labels, dataset);

        let data = Data {
            id: uuid::Uuid::new_v4(),
            name,
            value,
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
