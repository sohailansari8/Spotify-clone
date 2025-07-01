# Spotify Clone

Welcome to the Spotify Clone project! This web application replicates the core features of Spotify, allowing you to enjoy your own music library with a modern, interactive interface.

## Features

This clone includes a comprehensive set of features:

- **Modern, Responsive UI/UX:** Clean, intuitive design that adapts to all screen sizes.
- **Music Library Management:** Browse, search, and play songs from your personal collection.
- **Playlist Support:** Create, edit, and manage playlists for different moods or occasions.
- **Album & Artist Views:** Explore your music by albums and artists, complete with custom artwork.
- **Audio Controls:** Play, pause, skip tracks, shuffle, repeat, and seek within songs.
- **Volume & Mute:** Adjust volume or mute playback instantly.
- **Track Progress Bar:** Visual progress indicator with seeking functionality.
- **Favorites & Recently Played:** Mark tracks as favorites and quickly access recently played songs
- **Mobile-Friendly:** Fully responsive for use on phones and tablets.
- **Custom Album Artwork:** Display your own album covers for a personalized look.

## Getting Started

### 1. Add Your Music

- Place your favorite music files (`.mp3`, `.wav`, etc.) into the `songs` folder located in the project directory.
- The app will automatically detect and display these tracks in your library.

### 2. Customize Album Information

- Edit the `info.json` file in the project root to personalize album details.
- You can set the album name, artist, and a description.
- Example `info.json`:
    ```json
    {
        "album": "My Custom Album",
        "artist": "Your Name",
        "description": "A collection of my favorite tracks."
    }
    ```
- To use custom album artwork, add your image file to the appropriate folder and reference it in `info.json` if required.

### 3. Run the Application

- Follow the setup instructions in the project (see `INSTALL.md` or the setup section in this README if available).
- Start the web application using your preferred method (e.g., `npm start`, `yarn dev`, or opening `index.html`).
- Your music and album info will appear automatically in the interface.

## Usage Tips

- **Playlists:** Organize your songs into playlists for easy access.
- **Favorites:** Click the heart icon to add songs to your favorites list.
- **Recently Played:** Quickly find tracks you’ve listened to recently.
- **Theme Toggle:** Use the theme switcher to change between dark and light modes.
- **Profile:** If authentication is enabled, update your profile and manage your preferences.

## Contributing

Contributions are welcome! If you have suggestions, bug reports, or feature requests, please open an issue or submit a pull request. Help us make this Spotify Clone even better.

---

Thank you for using this project! Enjoy your personalized music streaming experience.
