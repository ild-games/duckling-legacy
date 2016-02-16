var gulp = require('gulp');
var ts = require('gulp-typescript');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var rollup = require('gulp-rollup');
var jade = require('gulp-jade');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var copy = require('gulp-copy');
var watch = require('gulp-watch');
var babelhelpers = require('gulp-babel-external-helpers');

function compileTS(override) {
    var project = {
        declaration: true,
        noImplicitAny: false,
        experimentalDecorators: true,
        suppressImplicitAnyIndexErrors : true,
        target : 'ES6',
        jsx : 'react',
        allowSyntheticDefaultImports : true
    };

    for (var key in override) {
        project[key] = override[key];
    }

    return ts(ts.createProject(project));
}

function moveTask(taskName,fileName,dest) {
    gulp.task(taskName, function() {
        return gulp.src(fileName).pipe(gulp.dest(dest));
    });
}

gulp.task('typescript',function () {
    return gulp
        .src([
            'src/ts/**/*.ts',
            'typings/typings.d.ts'],
            {base: 'src/ts'})
//        .pipe(sourcemaps.init())
        .pipe(compileTS())
        .js
        .pipe(babel({
			presets: ['es2015-rollup'],
		}))
//        .pipe(sourcemaps.write('.'))
        .pipe(babelhelpers('bableHelpers.js'))
        .pipe(gulp.dest('build/scripts/duckling'));
});

gulp.task('bundle', ['typescript'], function () {
  return gulp.src('build/scripts/duckling/main.js', {read: false})
    .pipe(rollup({
        sourceMap: true
    }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest('build/scripts/bundle'));
});

gulp.task('views', function () {
    return gulp.src('src/jade/**/')
        .pipe(jade({
            client : true,
            namespace : "views.templates"
        }))
        .pipe(concat('duckling_views.js'))
        .pipe(gulp.dest('build/scripts/'));
});

var jsdepends = [
    'bower_components/jquery/dist/jquery.js',
    'node_modules/sightglass/index.js',
    'bower_components/rivets/dist/rivets.js',
    'bower_components/bootstrap/dist/js/bootstrap.js',
    'bower_components/bootstrap-select/dist/js/bootstrap-select.js',
    'bower_components/jade/runtime.js',
    'bower_components/mousetrap/mousetrap.js',
    'bower_components/EaselJS/lib/easeljs-0.8.2.combined.js',
//    'bower_components/babel-polyfill/browser-polyfill.js',
    'build/scripts/duckling/bableHelpers.js'
]

var cssdepends = [
    'bower_components/bootstrap/dist/css/bootstrap.css',
    'bower_components/bootstrap-select/dist/css/bootstrap-select.css',
    'bower_components/font-awesome/css/font-awesome.css'
]

var DEPEND_LOCALS = {
    jsdepends : jsdepends,
    cssdepends : cssdepends
}

gulp.task('index', function() {
    return gulp.src('src/index.jade')
        .pipe(jade({
            locals : DEPEND_LOCALS
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('css', function() {
    return gulp.src('src/sass/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('build/css'));
});

gulp.task('fonts', function () {
    return gulp.src([
        'bower_components/font-awesome/fonts/**/*',
        'bower_components/bootstrap/fonts/**/*'
    ]).pipe(gulp.dest('build/fonts'));
});

gulp.task('babel-helpers', function () {
    return gulp.src('src/')
        .pipe(babel({externalHelpers: true}))
        .pipe(babelhelpers('babeleHelpers.js'))
        .pipe(gulp.dest('build/scripts'));
})

gulp.task('watch', function () {

});

moveTask('fonts', [
    'bower_components/font-awesome/fonts/**/*',
    'bower_components/bootstrap/fonts/**/*'
], 'build/fonts');
moveTask('package', 'package.json', 'build/');
moveTask('specrunner', 'spec/SpecRunner.html', 'build/');

gulp.task('default', [
    'typescript',
    'bundle',
    'views',
    'index',
    'css',
    'fonts',
    'package',
    'specrunner',
    'babel-helpers'
]);
