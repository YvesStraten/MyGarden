#![deny(missing_docs)]
//! This crate handles requests for ThingSpeak, an IoT data container.
//! For more details see:
//! Example:
//! ```
//! pub async fn main() {
//!     let client = reqwest::Client::new();
//!     let thingspeak = ThingSpeak::new(client, channel_number, api_key);
//! }
//!
//! ```
use std::collections::HashMap;

use chrono::{DateTime, Utc};
use dynfmt::{Format, SimpleCurlyFormat};
use reqwest::Client;
use serde::{Deserialize, Serialize};

/// A ThingSpeak channel
#[derive(Debug)]
pub struct ThingSpeak {
    /// Client to make http requests
    client: Client,
    /// Channel id
    channel_id: u32,
    /// Api key of the channel
    api_key: String,
}

/// The url format for a ThingSpeak channel
static CHANNEL_FORMAT: &str = "https://api.thingspeak.com/channels/{}/feeds.json?api_key={}";

impl ThingSpeak {
    /// Creates a new ThingSpeak client
    pub fn new(client: Client, channel_id: u32, api_key: String) -> Self {
        Self {
            client,
            channel_id,
            api_key,
        }
    }

    /// Get the feeds of a channel
    pub async fn get_channel(&self) -> reqwest::Result<Channel> {
        let url = SimpleCurlyFormat
            .format(
                CHANNEL_FORMAT,
                [&self.channel_id.to_string(), &self.api_key],
            )
            .unwrap();
        let req = self.client.get(url.as_ref());
        let res: Channel = req.send().await?.json().await?;

        Ok(res)
    }
}

/// Represent Channel
#[derive(Debug, Serialize, Deserialize)]
pub struct Channel {
    /// Channel details
    pub details: ChannelDetails,
    /// Channel feeds
    pub feeds: Vec<Entry>,
}

impl Channel {
    /// Get an iterator for the values from the lastest entry in the channel
    pub fn get_latest_entry_values(&self) -> ChannelIterator<'_> {
        let latest_entry_id = self.details.last_entry_id;
        self.get_entry_values(latest_entry_id)
    }

    /// Get an iterator for the values from a specified entry in the channel
    pub fn get_entry_values(&self, entry_id: usize) -> ChannelIterator<'_> {
        ChannelIterator::new(self, entry_id)
    }

    /// Get an iterator to all entries from the channel
    pub fn get_entries(&self) -> impl Iterator<Item = &Entry> {
        self.feeds.iter()
    }

    /// Gets an iterator over all entry values from the channel
    pub fn get_all_entry_values<'a>(&'a self) -> impl Iterator<Item = ChannelValue<'a>> + 'a {
        let details = &self.details.field_names;
        let feeds_iterator = self
            .feeds
            .iter()
            .map(|feed| &feed.fields)
            .flatten()
            .filter_map(|(key, value)| value.as_ref().map(|val| (key, val)));

        feeds_iterator
            .map(|(key, value)| {
                let current_name = details.get(key)?.as_ref()?;

                Some(ChannelValue::new(current_name, value))
            })
            .flatten()
    }
}

/// Represents the details of a channel
#[derive(Debug, Serialize, Deserialize)]
pub struct ChannelDetails {
    /// Channel id
    pub id: i32,
    /// Channel name
    pub name: String,
    /// Channel latitude
    pub latitude: Option<String>,
    /// Channel longitude
    pub longitude: Option<String>,
    /// The names of the fields
    /// Some of the fields can be empty
    #[serde(flatten)]
    pub field_names: HashMap<String, Option<String>>,
    /// When the channel was created
    pub created_at: DateTime<Utc>,
    /// When the channel was last updated
    pub updated_at: DateTime<Utc>,
    /// The id of the last entry
    pub last_entry_id: usize,
}

/// An entry from a channel
#[derive(Debug, Serialize, Deserialize)]
pub struct Entry {
    /// When the entry was created
    pub created_at: DateTime<Utc>,
    /// Entry id
    pub entry_id: usize,
    /// Values for the entry
    #[serde(flatten)]
    pub fields: HashMap<String, Option<String>>,
}

/// Iterator over a ThingSpeak channel
#[derive(Debug)]
pub struct ChannelIterator<'a> {
    /// The channel that is being iterated over
    channel: &'a Channel,
    /// Id of entry that is being iterated over
    entry_id: usize,
    /// Current field of entry that is being iterated over
    current_field: usize,
}

impl<'a> ChannelIterator<'a> {
    /// Create a new iterator over a channel and entry id
    pub fn new(thingspeak: &'a Channel, entry_id: usize) -> Self {
        Self {
            channel: thingspeak,
            entry_id: entry_id - 1,
            current_field: 0,
        }
    }
}

impl<'a> Iterator for ChannelIterator<'a> {
    type Item = ChannelValue<'a>;

    fn next(&mut self) -> Option<Self::Item> {
        let current_field = format!("field{}", self.current_field + 1);
        let label = &self
            .channel
            .details
            .field_names
            .get(&current_field)?
            .as_ref()?;

        let feed_entry = self
            .channel
            .feeds
            .iter()
            .find(|entry| entry.entry_id == self.entry_id)?;

        let value = feed_entry.fields.get(&current_field)?.as_ref()?;

        self.current_field += 1;
        Some(Self::Item { label, value })
    }
}

/// Represents a value from a channel
#[derive(Debug, Serialize, Deserialize)]
pub struct ChannelValue<'a> {
    /// Its name
    pub label: &'a str,
    /// Its value
    pub value: &'a str,
}

impl<'a> ChannelValue<'a> {
    /// Constructs a new ChannelValue
    pub fn new(label: &'a str, value: &'a str) -> Self {
        Self { label, value }
    }
}
