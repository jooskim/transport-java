/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

var gulp = require('gulp-help')(require('gulp'));
var env = require('gulp-env');
var requireDir = require('require-dir');
var runSequence = require('run-sequence');
var util = require('gulp-util');

/**
 * Check for prod flag during gulp task executions
 */
if(util.env.prod){
    env.set({NODE_ENV: "prod"});
} else {
    env.set({NODE_ENV: "dev"});
}

requireDir('./build/tasks', {recurse: true});

/**
 * Cleans, compiles and bundles the entire application, before cleaning up the tmp/ folder again.
 */
gulp.task('build', function (callback) {
    var prod = process.env.NODE_ENV==="prod";
    return runSequence(
        'clean',
        prod ?
            ['typescript', 'bundle'] :
            ['typescript'],
        callback
    );
});

/**
 * Builds one time, then watches for changes and starts Browsersync
 */
gulp.task("serve", function (callback) {
    var prod = process.env.NODE_ENV==="prod";
    return runSequence(
        'build',
        prod ?
            ['typescript:watch', 'bundle:watch'] :
            ['typescript:watch'],
        'live',
        callback
    );
});

/**
 * Builds the application in production mode and runs all tests once on it.
 */
gulp.task("test", function (callback) {
    env.set({NODE_ENV: "prod"}); // We only run tests in production mode for now
    return runSequence(
        'build',
        'karma:verbose',
        callback
    );
});


/**
 * Publishes the bifröst package to the NPM registry
 */
gulp.task("npm:prepare", function(callback) {
    env.set({NODE_ENV: "prod"}); // The build is in production mode
    return runSequence(
        'build',
        'aot',
        'npm:all',
        callback
    );
});


