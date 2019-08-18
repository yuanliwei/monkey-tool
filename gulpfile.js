const fs = require('fs')
const path = require('path')
const { StringDecoder } = require('string_decoder')
const { Transform } = require('stream')
const browserify = require('browserify')
const gulp = require('gulp')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const uglify = require('gulp-uglify')
const htmlmin = require('gulp-htmlmin')
const sourcemaps = require('gulp-sourcemaps')
const log = require('gulplog')
const connect = require('gulp-connect')
const babel = require('gulp-babel')
const rename = require("gulp-rename")
const middleware = require("./MiddleWare")

gulp.task('dev-server', function () {
    connect.server({
        name: 'Dev App',
        root: ['dest'],
        port: 8000,
        livereload: true,
        middleware: middleware
    });
});

gulp.task('dev-pack', function () {
    fs.copyFileSync(path.join(__dirname, 'src', 'index.html'), path.join(__dirname, 'dest', 'index.html'))
    return browserify({ entries: './src/app.js', debug: true })
        .ignore('golden-layout')
        .ignore('codemirror')
        .transform('babelify')
        .transform('brfs')
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dest/'))
        .pipe(connect.reload())
        .on('error', function (e) {
            log.error(e)
            this.emit('end')
        })
});

gulp.task('watch', function () {
    gulp.watch(['./src/**/*.*'], gulp.series('dev-pack'))
});

gulp.task('default', gulp.parallel(['dev-server', 'dev-pack', 'watch']))

gulp.task('release', function () {
    const buildHtml = () => new Transform({
        objectMode: true,
        transform(file, encoding, callback) {
            let html = fs.readFileSync(path.join(__dirname, 'src', 'index.html'), 'utf-8')
            let content = new StringDecoder('utf-8').end(file.contents)
            file.contents = Buffer.from(html.replace(`<script src="./app.js"></script>`, `<script>${content}</script>`))
            this.push(file)
            callback()
        }
    })
    return browserify({ entries: './src/app.js', debug: false })
        .ignore('golden-layout')
        .ignore('codemirror')
        .transform('babelify')
        .transform('brfs')
        .plugin('tinyify')
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(babel())
        .pipe(uglify())
        .pipe(buildHtml())
        .pipe(htmlmin({ removeComments: true, collapseWhitespace: true, collapseBooleanAttributes: false, removeEmptyAttributes: false, removeScriptTypeAttributes: true, removeStyleLinkTypeAttributes: true, minifyJS: true, minifyCSS: true }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest('.'))
        .on('error', function (e) {
            log.error(e)
            this.emit('end')
        })
});