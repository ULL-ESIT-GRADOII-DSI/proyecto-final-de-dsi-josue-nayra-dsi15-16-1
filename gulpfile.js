(() => {
    'use strict';
    
    let gulp = require('gulp');
    let nodemon = require('gulp-nodemon');
    let jshint = require('gulp-jshint');
    let jscs = require('gulp-jscs');
    let scsslint = require('gulp-sass-lint');
    const browserSync = require('browser-sync').create();
    var sass = require('gulp-sass');

//------------------------------------------------------------------------------------------
// GULP para lint.

    gulp.task('lint', ['lint:jshint', 'lint:jscs', 'lint:sass']);

    gulp.task('lint:jshint', function(){
        return gulp.src([       //gulp.src para especificar los archivos de entrada
                'gulpfile.js',
                'public/*.js',
                'models/*.js'
            ])
            .pipe(jshint())
            .pipe(jshint.reporter());
    });

    // Tarea para pasar el JSCS a el código
    gulp.task('lint:jscs', function(){
        return gulp.src([
                'gulpfile.js',
                'public/*.js',
                'models/*.js'
            ])
            // .pipe(jscs())
            .pipe(jscs.reporter());
    });


    gulp.task('lint:sass', function(){
        return gulp.src('public/assets/css/*.sass')
            .pipe(scsslint());
    });
    

//------------------------------------------------------------------------------------------
// GULP para browserSync.

    // Static Server + watching scss/html files
    gulp.task('serve', ['sass'], function() {
    
        browserSync.init({
            server: "./"
        });
    
        gulp.watch("public/assets/css/*.sass", ['sass']);
        gulp.watch("views/*.ejs").on('change', browserSync.reload);
    });
    
    // Compile sass into CSS & auto-inject into browsers
    gulp.task('sass', function() {
        return gulp.src("public/assets/css/*.sass")
            .pipe(sass())
            .pipe(gulp.dest("public/assets/css"))
            .pipe(browserSync.stream());
    });
    
    gulp.task('default', ['serve']);
    
//------------------------------------------------------------------------------------------
// GULP para nodemon.

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
    
})();