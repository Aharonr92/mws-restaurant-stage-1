const paths = {
  tmp: 'tmp/',
  tmpJs: 'tmp/js',
  tmpCss: 'tmp/css',

  dest: 'public/',
  destJs: 'public/js',
  destImg: 'public/img',
  destCss: 'public/css',
};

const del = require('del');
const gulp = require('gulp');
const webp = require('gulp-webp');
const gzip = require('gulp-gzip');
const concat = require('gulp-concat');
const uglifyJs = require('uglify-es');
const inline = require('gulp-inline');
const htmlMin = require('gulp-htmlmin');
const vinylPaths = require('vinyl-paths');
const cleanCSS = require('gulp-clean-css');
const sourceMaps = require('gulp-sourcemaps');
const composer = require('gulp-uglify/composer');
const autoprefixer = require('gulp-autoprefixer');
const uglify = composer(uglifyJs, console);
const browserSync = require('browser-sync').create();
const connectGzipStatic = require('connect-gzip-static')(paths.dest);

gulp.task('clean', () => gulp.src(paths.dest, {allowEmpty: true}).pipe(vinylPaths(del)));

gulp.task('images', () => gulp.src('img/**/*.*').pipe(webp({method: 6})).pipe(gulp.dest(paths.destImg)));

gulp.task('create-vendor-dev', () => {
  return gulp.src(['js/db_helper.js', 'js/register_sw.js', 'node_modules/lozad/dist/lozad.min.js', 'node_modules/idb/lib/idb.js'])
    .pipe(sourceMaps.init())
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(sourceMaps.write('./'))
    .pipe(gulp.dest(paths.destJs));
});

gulp.task('create-vendor-prod', () => {
  return gulp.src(['js/db_helper.js', 'js/register_sw.js', 'node_modules/lozad/dist/lozad.min.js', 'node_modules/idb/lib/idb.js'])
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.tmpJs));
});

gulp.task('minify-js-dev', () => {
  return gulp.src(['js/main.js', 'js/restaurant_info.js'])
    .pipe(sourceMaps.init())
    .pipe(uglify())
    .pipe(sourceMaps.write('./'))
    .pipe(gulp.dest(paths.destJs));
});

gulp.task('minify-js-prod', () => {
  return gulp.src(['js/main.js', 'js/restaurant_info.js'])
    .pipe(uglify())
    .pipe(gulp.dest(paths.tmpJs));
});

gulp.task('minify-css-dev', () => {
  return gulp.src('css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    .pipe(gulp.dest(paths.destCss))
    .pipe(browserSync.stream());
});

gulp.task('minify-css-prod', () => {
  return gulp.src('css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    .pipe(gulp.dest(paths.tmpCss));
});

gulp.task('minify-sw-prod', () => gulp.src(['sw.js']).pipe(uglify()).pipe(gulp.dest(paths.dest)));

gulp.task('minify-sw-dev', () => {
  return gulp.src(['sw.js'])
    .pipe(sourceMaps.init())
    .pipe(uglify())
    .pipe(sourceMaps.write('./'))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('copy-files', () => gulp.src(['manifest.json', 'favicon.ico']).pipe(gulp.dest(paths.dest)));

gulp.task('copy-html-dev', () => gulp.src(['index.html', 'restaurant.html']).pipe(gulp.dest(paths.dest)));

gulp.task('inline-html', function () {
  return gulp.src('*.html')
    .pipe(inline({base: paths.tmp, disabledTypes: ['svg', 'webp', 'img']}))
    .pipe(htmlMin({collapseWhitespace: true}))
    .pipe(gzip())
    .pipe(gulp.dest(paths.dest));
});

gulp.task('clean-tmp', () => gulp.src(paths.tmp).pipe(vinylPaths(del)));

gulp.task('build', gulp.series('clean', gulp.parallel('copy-files', 'images', 'create-vendor-prod', 'minify-js-prod', 'minify-css-prod', 'minify-sw-prod'), 'inline-html', 'clean-tmp'));

gulp.task('dev', gulp.series('clean', gulp.parallel('copy-files', 'images', 'create-vendor-dev', 'minify-js-dev', 'minify-css-dev', 'minify-sw-dev'), 'copy-html-dev'));

gulp.task('serve', () => {
  browserSync.init({
    server: paths.dest,
    port: 8000,
    // ui: false
  }, (err, bs) => bs.addMiddleware('*', connectGzipStatic, {override: true}));
});

gulp.task('watch', () => {
  gulp.watch("css/*.css", gulp.series('minify-css-dev'));
  gulp.watch("js/db_helper.js", gulp.series('create-vendor-dev', (done) => {
    browserSync.reload();
    done();
  }));
  gulp.watch("sw.js", gulp.series('minify-sw-dev', (done) => {
    browserSync.reload();
    done();
  }));
  gulp.watch(['js/main.js', 'js/restaurant_info.js', 'js/register_sw.js'], gulp.series('minify-js-dev', (done) => {
    browserSync.reload();
    done();
  }));
  gulp.watch("*.html").on('change', gulp.series('copy-html-dev', (done) => {
    browserSync.reload();
    done();
  }));

});