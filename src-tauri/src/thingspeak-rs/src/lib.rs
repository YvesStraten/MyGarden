use std::collections::HashMap;

use chrono::{DateTime, Utc};
use dynfmt::{Format, SimpleCurlyFormat};
use reqwest::Client;
use serde::{Deserialize, Serialize};

#[derive(Debug)]
pub struct ThingSpeak {
    client: Client,
    channel_id: u32,
    api_key: String,
}

static CHANNEL_FORMAT: &str = "https://api.thingspeak.com/channels/{}/feeds.json?api_key={}";

impl ThingSpeak {
    pub fn new(client: Client, channel_id: u32, api_key: String) -> Self {
        Self {
            client,
            channel_id,
            api_key,
        }
    }

    pub async fn get_channel_feeds(&self) -> reqwest::Result<ThingSpeakResponse> {
        let url = SimpleCurlyFormat
            .format(
                CHANNEL_FORMAT,
                [&self.channel_id.to_string(), &self.api_key],
            )
            .unwrap();
        let req = self.client.get(url.as_ref());
        let res: ThingSpeakResponse = req.send().await?.json().await?;

        Ok(res)
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ThingSpeakResponse {
    pub channel: Channel,
    pub feeds: Vec<Entry>,
}

impl ThingSpeakResponse {
    pub fn get_latest_entry_values(&self) -> FeedIterator<'_> {
        let latest_entry_id = self.channel.last_entry_id;
        self.get_entry_values(latest_entry_id)
    }

    pub fn get_entry_values(&self, entry_id: usize) -> FeedIterator<'_> {
        FeedIterator::new(self, entry_id)
    }

    pub fn get_entries(&self) -> impl Iterator<Item = &Entry> {
        self.feeds.iter()
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Channel {
    pub id: i32,
    pub name: String,
    pub latitude: String,
    pub longitude: String,
    #[serde(flatten)]
    pub field_names: HashMap<String, Option<String>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub last_entry_id: usize,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Entry {
    pub created_at: DateTime<Utc>,
    pub entry_id: usize,
    #[serde(flatten)]
    pub fields: HashMap<String, Option<String>>,
}

#[derive(Debug)]
pub struct FeedIterator<'a> {
    thingspeak: &'a ThingSpeakResponse,
    entry_id: usize,
    current_field: usize,
}

impl<'a> FeedIterator<'a> {
    pub fn new(thingspeak: &'a ThingSpeakResponse, entry_id: usize) -> Self {
        Self {
            thingspeak,
            entry_id: entry_id - 1,
            current_field: 0,
        }
    }
}

impl Iterator for FeedIterator<'_> {
    type Item = ChannelValue;

    fn next(&mut self) -> Option<Self::Item> {
        let current_field = format!("field{}", self.current_field + 1);
        let label = self
            .thingspeak
            .channel
            .field_names
            .get(&current_field)?
            .clone()?;

        let feed_entry = self
            .thingspeak
            .feeds
            .iter()
            .find(|entry| entry.entry_id == self.entry_id)?;

        let value = feed_entry.fields.get(&current_field)?.clone()?;

        self.current_field += 1;
        Some(Self::Item { label, value })
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ChannelValue {
    pub label: String,
    pub value: String,
}
