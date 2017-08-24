var jscript = [
    "app/html-dev/js/libs/*.js",
    "!app/html-dev/js/libs/1_jquery.js",
    "app/html-dev/js/*.js"
];

var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    nib = require('nib'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    del = require('del'),
    plumber = require('gulp-plumber'),
    gulpCopy = require('gulp-copy'),
    notify = require("gulp-notify"),
    pug = require('gulp-pug');


var onError = function(err) {
    notify.onError({
        title: "Error in " + err.plugin
    })(err);
    this.emit('end');
};

gulp.task('nib', function() {
    return gulp
        .src('app/html-dev/styl/framework/style.styl')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(stylus({ use: nib(), 'include css': true, import: ['nib'], compress: true }))
        .pipe(gulp.dest('app/html-view/css'))
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('html', function() {
    return gulp
        .src('app/html-dev/**/*.pug')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('app/html-view'));
});

gulp.task('scripts', function() {

    var dfquer = gulp
        .src(jscript)
        .pipe(plumber({ errorHandler: onError }))
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/html-view/js'));

    var jsquer = gulp
        .src("app/html-dev/js/libs/1_jquery.js")
        .pipe(plumber({ errorHandler: onError }))
        .pipe(concat('jquery.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/html-view/js'));

});

gulp.task('browsersync', function() {
    browserSync({
        server: {
            baseDir: 'app/html-view'
        },
        notify: false
    });
});

gulp.task('clean', function() {
    return del.sync(['app/html-view', 'dist']);
});

gulp.task('copyimg', function() {
    return gulp
        .src(['app/html-dev/img/**/*', '!app/html-dev/img/empty.jpg'])
        .pipe(gulpCopy('app/html-view/img/', { prefix: 3 }));
});

gulp.task('copyfont', function() {
    return gulp
        .src(['app/html-dev/fonts/**/*', '!app/html-dev/fonts/empty.woff'])
        .pipe(gulpCopy('app/html-view/fonts/', { prefix: 3 }));
});

gulp.task('watch', ['clean', 'browsersync', 'copyfont', 'copyimg', 'html', 'nib', 'scripts'], function() {
    gulp.watch('app/html-dev/styl/**/*.+(css|styl)', ['nib']);
    gulp.watch('app/html-dev/**/*.pug', ['html', browserSync.reload]);
    gulp.watch('app/html-dev/img/**/*', ['copyimg', browserSync.reload]);
    gulp.watch('app/html-dev/fonts/**/*', ['copyfont', browserSync.reload]);
    gulp.watch('app/html-dev/js/**/*.js', ['scripts', browserSync.reload]);
});



gulp.task('build', ['nib', 'html', 'scripts'], function() {
    var removeDist = del.sync('dist');

    var buildCSS = gulp
        .src('app/html-view/css/*.css')
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'));

    var buildImg = gulp
        .src(['app/html-dev/img/**/*', '!app/html-dev/img/empty.jpg'])
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            une: [pngquant()]
        }))
        .pipe(gulp.dest('dist/img'));

    var buildFonts = gulp
        .src(["app/html-dev/fonts/**/*", '!app/html-dev/fonts/empty.woff'])
        .pipe(gulp.dest('dist/fonts'));

    var buildJS = gulp
        .src("app/html-view/js/**/*")
        .pipe(gulp.dest('dist/js'));

    var buildHhtml = gulp
        .src("app/html-view/*.html")
        .pipe(gulp.dest('dist'));

});