var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');


gulp.task('css', function() {
    return gulp.src(
        [
            'src/duckling/index.scss',
            'src/duckling/colors.scss',
            'src/duckling/fonts.scss',
            'src/duckling/forms.scss',
            'src/duckling/misc-mixins.scss',
            'src/duckling/**/*component.scss'
        ])
        .pipe(sass())
        .on('error', swallowError)
        .pipe(gulp.dest('build/duckling/'));
});

gulp.task('watch', function () {
    watch('src/**/*.scss', function() {
        gulp.run('default');
    });
});

moveTask('electron', 'src/electron/**', 'build/electron');
moveTask('index', 'src/index.html', 'build');
moveTask('resources', 'resources/**', 'build/resources');
moveTask('duckling-test', 'src/duckling-tests/jasmine.json', 'build/duckling-tests');

gulp.task('duckling', [
    'index',
    'electron',
    'css',
    'resources'
]);

gulp.task('tests', [
    'duckling-test',
])

gulp.task('default', [
    'duckling',
    'tests'
]);

function swallowError (error) {
    console.log(error.toString());
    this.emit('end');
}

function moveTask(taskName,fileGlob,dest) {
    gulp.task(taskName, function() {
        return gulp.src(fileGlob).pipe(gulp.dest(dest));
    });
}
