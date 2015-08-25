var gulp = require('gulp');


var Server = require('karma').Server;
gulp.task('karma', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']
    }, done).start();
});

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
gulp.task('jshint', function() {
    return gulp.src(['src/*.js', 'test/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});


var dest = 'build';
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
gulp.task('build', ['jshint', 'karma'], function() {
	return gulp.src('src/*.js')
    	.pipe(concat('event-dispatcher.js'))
    	.pipe(gulp.dest(dest))
    	.pipe(uglify())
    	.pipe(rename({ extname: '.min.js' }))
    	.pipe(gulp.dest(dest));
});