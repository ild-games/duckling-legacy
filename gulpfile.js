var gulp = require('gulp');
var ts = require('gulp-typescript');
var babel = require('gulp-babel');

function compileTS(override) {
    var project = {
        declaration: true,
        noImplicitAny: false,
        experimentalDecorators: true,
        suppressImplicitAnyIndexErrors : true,
        target : 'ES6',
        jsx : 'react'
    };

    for (var key in override) {
        project[key] = override[key];
    }

    return ts(ts.createProject(project));
}

gulp.task('typescript',function () {
    return gulp
        .src([
            'src/ts/util/**/*.ts',
            'src/ts/framework/**/*.ts',
            'src/ts/controls/**/*.ts',
            'src/ts/math/**/*.ts',
            'typings/tsd.d.ts'],
            {base: 'src/ts'})
        .pipe(compileTS())
        .js
 //       .pipe(babel())
        .pipe(gulp.dest('build/scripts'));
});

gulp.task('default', ['typescript']);
