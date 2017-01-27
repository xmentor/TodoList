'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const template = require('gulp-template');
const closureCompiler = require('gulp-closure-compiler');

gulp.task('sass', function() {
    return gulp.src('src/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dest/css'));
});
gulp.task('autoprefixer', ['sass'], function() {
    return gulp.src('dest/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('dest/css'));
});
gulp.task('cssmin', ['autoprefixer'], function() {
    return gulp.src('dest/css/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('dest/css'));
});
gulp.task('template', ['cssmin'], function() {
    return gulp.src('src/index.html')
        .pipe(template({lang: 'pl',
                        title: 'TodoList',
                        desc: 'Prosta w użyciu aplikacja, umożliwiająca tworzenie listy zadań',
                        keywords: 'todo, to do list, todolist, todo list, lista zadań',
                        viewport: 'width=device-width',
                        css: 'css/todoList.css',
                        headline: 'Moja lista zadań',
                        copyright: 'Copyright &copy; 2017 Kamil Kondratowicz',
                        js: 'js/todoList.min.js'})
             )
        .pipe(gulp.dest('dest'));
});
gulp.task('jsCompiler', ['template'], function() {
    return gulp.src('src/js/*.js')
        .pipe(closureCompiler({fileName: 'todoList.min.js',
                               compilerFlags: {
                                   compilation_level: 'SIMPLE_OPTIMIZATIONS',
                                   language_in: 'ECMASCRIPT6_STRICT',
                                   language_out: 'ECMASCRIPT5_STRICT'
                               }
                              }))
        .pipe(gulp.dest('dest/js'));
});
gulp.task('default', ['jsCompiler']);