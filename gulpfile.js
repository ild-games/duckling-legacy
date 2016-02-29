var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var exorcist = require('exorcist');
var jade = require('gulp-jade');
var jadens = require('gulp-jade-namespace');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var copy = require('gulp-copy');
var watch = require('gulp-watch');
var source = require('vinyl-source-stream')
var browserify = require('browserify');
var tsify = require('tsify');
var babelify = require('babelify');

gulp.task('typescript', function () {
    return browserify({debug : true})
        .add('src/ts/main.ts')
        .plugin('tsify', {target : "es6"})
        .transform(babelify,
            {
                presets : ["es2015"],
                extensions : [".ts", ".ts", ".tsx"]
            })
        .bundle()
        .pipe(exorcist('build/scripts/bundle/main.js.map'))
        .pipe(source('main.js'))
        .pipe(gulp.dest('build/scripts/bundle'));
});

gulp.task('spec', function() {
    return browserify({
            paths : ['./src/']
        })
        .add('spec/ts/specmain.js')
        .add('typings/typings.d.ts')
        .plugin('tsify', {target : "es6"})
        .transform(babelify,
            {
                presets : ["es2015"],
                extensions : [".js", ".ts", ".tsx"]
            })
        .bundle()
        .pipe(source('spec.js'))
        .pipe(gulp.dest('build/spec/'));
});

gulp.task('views', function () {
    return gulp.src('src/jade/**/*.jade')
        .pipe(jade({
            client : true,
        }))
        .pipe(jadens({
            namespace : "views"
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
    'bower_components/react/react.js',
    'bower_components/react/react-dom.js',
    'build/scripts/duckling_views.js'
]

var cssdepends = [
    'bower_components/bootstrap/dist/css/bootstrap.css',
    'bower_components/bootstrap-select/dist/css/bootstrap-select.css',
    'bower_components/font-awesome/css/font-awesome.css',
    'build/css/main.css'
]

var DEPEND_LOCALS = {
    jsdepends : jsdepends,
    cssdepends : cssdepends
}

gulp.task('index', function() {
    return gulp.src('src/index.jade')
        .pipe(jade({
            locals : DEPEND_LOCALS,
            pretty : true
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('specrunner', function() {
    return gulp.src('spec/SpecRunner.jade')
        .pipe(jade({
            locals : DEPEND_LOCALS,
            pretty : true
        }))
        .pipe(gulp.dest('build/spec'));
});

gulp.task('css', function() {
    return gulp.src('src/sass/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('build/css'));
});

gulp.task('babel-helpers', function () {
    return gulp.src('src/')
        .pipe(babel({externalHelpers: true}))
        .pipe(babelhelpers('babeleHelpers.js'))
        .pipe(gulp.dest('build/scripts'));
})

gulp.task('watch', function () {
    watch('src/**/*', function() {
        gulp.run('default');
    });
    watch('spec/**/*', function() {
        gulp.run('tests');
    });
});

function moveTask(taskName,fileGlob,dest) {
    gulp.task(taskName, function() {
        return gulp.src(fileGlob).pipe(gulp.dest(dest));
    });
}

moveTask('fonts', [
    'bower_components/font-awesome/fonts/**/*',
    'bower_components/bootstrap/fonts/**/*'
], 'build/fonts');
moveTask('resources', 'resources/**', 'build/resources');
moveTask('package', 'package.json', 'build/');
moveTask('speckpackage', 'spec/package.json', 'build/spec');

gulp.task('tests', [
    'spec',
    'specrunner',
    'speckpackage'
]);

gulp.task('duckling', [
    'typescript',
    'views',
    'index',
    'css',
    'fonts',
    'package',
    'resources',
]);

gulp.task('default', [
    'duckling',
    'tests'
]);
