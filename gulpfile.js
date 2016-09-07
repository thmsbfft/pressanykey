// REQUIRES
var gulp         = require('gulp'),
    gutil        = require('gulp-util'),
    concat       = require('gulp-concat'),
    rename       = require('gulp-rename'),
    sass         = require('gulp-sass'),
    minifyCss    = require('gulp-minify-css'),
    uglify       = require('gulp-uglify'),
    sourcemaps   = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    browserSync  = require('browser-sync').create();

var vendor = [
    'src/js/vendor/FileSaver.min.js',
    'src/js/vendor/preloadjs-0.6.1.min.js',
	'src/js/vendor/paper.js',
	'src/js/vendor/*.js'
];

var scripts = [
    'src/js/loader.js',
    'src/js/app.js',
    'src/js/Keyboard.js',
	'src/js/index.js'
];

// LOCALHOST:3000
gulp.task('serve', function() {

    browserSync.init({
        server: "./www",
        notify: false
    });

    gulp.watch("src/*.html", ['data']);
    gulp.watch("src/data/**/*", ['data']);
    gulp.watch("src/sass/*/*.scss", ['sass']);
    gulp.watch("src/js/*.js", ['js']);
});

// TASKS
gulp.task('sass', function() {
    gulp.src("src/sass/bundle.scss")
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 4 versions']
        }))
        .pipe(sourcemaps.init())
        .pipe(minifyCss())
		.pipe(rename('bundle.min.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("www/css"))
        .pipe(browserSync.stream());
});

gulp.task('js', function() {
	gulp.src(vendor)
		.pipe(concat('vendor.js'))
		.pipe(gulp.dest('www/js/'));

	gulp.src(scripts)
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.js'))
        .pipe(uglify())
        .pipe(rename('bundle.min.js'))
        .pipe(sourcemaps.write())
		.pipe(gulp.dest('www/js/'));

	browserSync.reload();
});

gulp.task('data', function() {
    gulp.src('src/index.html')
        .pipe(gulp.dest('www/'))

    gulp.src('src/data/**/*')
        .pipe(gulp.dest('www/data'))

    browserSync.reload();
});


gulp.task('media', function() {
    gulp.src('src/media/**/*')
        .pipe(gulp.dest('www/media/'))
});

// DEFAULT
gulp.task('default', ['data', 'media', 'sass', 'js', 'serve']);