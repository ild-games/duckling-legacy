var gulp = require("gulp");
var sass = require("gulp-sass")(require("sass"));
var watch = require("gulp-watch");

function css() {
    return gulp
        .src(["src/duckling/*.scss", "src/duckling/**/*component.scss"])
        .pipe(sass())
        .on("error", swallowError)
        .pipe(gulp.dest("build/duckling/"));
}

function fwatch() {
    return watch("src/**/*.scss", function () {
        gulp.run("default");
    });
}

function index() {
    return gulp.src("src/index.html").pipe(gulp.dest("build"));
}
function electron() {
    return gulp.src("src/electron/**").pipe(gulp.dest("build/electron"));
}
function resources() {
    return gulp.src("resources/**").pipe(gulp.dest("build/resources"));
}

exports.watch = watch;
exports.index = index;
exports.electron = electron;
exports.resources = resources;
exports.duckling = gulp.series(index, electron, css, resources);
exports.default = exports.duckling;

function swallowError(error) {
    console.log(error.toString());
    this.emit("end");
}
