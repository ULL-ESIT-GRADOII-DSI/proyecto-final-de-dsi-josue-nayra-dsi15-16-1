'use strict';

let gulp        = require('gulp');
let nodemon     = require('gulp-nodemon');
let browserSync = require('browser-sync');
let jshint      = require('gulp-jshint');
let jscs        = require('gulp-jscs');
let scsslint    = require('gulp-scss-lint');
let clean       = require('gulp-clean');
let del     = require('del');

gulp.task('default', ['browser-sync'], function () {
});

gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:3000",
        files: [
            "public/**/*.*",
            "views/**/*.ejs"
        ],
        port: 8080,
	});
});
gulp.task('nodemon', function (cb) {
	
	var started = false;
	
	return nodemon({
		script: 'app.js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true; 
		} 
	});
});


