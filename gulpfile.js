var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');


gulp.task('css', function() {
    return gulp.src(
        [
            'src/duckling/forms.scss',
            'src/duckling/**/*component.scss'
        ])
        .pipe(sass())
        .on('error', swallowError)
        .pipe(gulp.dest('build/'));
});

gulp.task('watch', function () {
    watch('src/**/*.scss', function() {
        gulp.run('default');
    });
});

function swallowError (error) {
    console.log(error.toString());
    this.emit('end');
}

gulp.task('duckling', [
    'css'
]);

gulp.task('default', [
    'duckling'
]);
