const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const fs = require('fs');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --- API Routes for songs/albums ---
app.get('/api/albums', (req, res) => {
    const songsDir = path.join(__dirname, 'public', 'songs');
    try {
        const folders = fs.readdirSync(songsDir, { withFileTypes: true })
            .filter(d => d.isDirectory())
            .map(d => d.name);

        const albums = folders.map(folder => {
            try {
                const info = JSON.parse(
                    fs.readFileSync(path.join(songsDir, folder, 'info.json'), 'utf-8')
                );
                return { folder, ...info };
            } catch {
                return { folder, title: folder, description: '' };
            }
        });
        res.json(albums);
    } catch {
        res.json([]);
    }
});

app.get('/api/songs/:folder', (req, res) => {
    const folderPath = path.join(__dirname, 'public', 'songs', req.params.folder);
    try {
        const songs = fs.readdirSync(folderPath)
            .filter(f => f.endsWith('.mp3'));
        res.json(songs);
    } catch {
        res.status(404).json({ error: 'Folder not found' });
    }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
});

module.exports = app;
