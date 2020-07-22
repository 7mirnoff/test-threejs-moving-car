'use strict'

import { task, src, dest, parallel, series, watch } from 'gulp'
import browserSync from 'browser-sync'
import plumber from 'gulp-plumber'
import del from 'del'
import rename from 'gulp-rename'
import fileinclude from 'gulp-file-include'
import htmlBeautify from 'gulp-html-beautify'
import sass from 'gulp-sass'
import postcss from 'gulp-postcss'
import mqpacker from 'css-mqpacker'
import sortCSSmq from 'sort-css-media-queries'
import autoprefixer from 'gulp-autoprefixer'
import cssnano from 'gulp-cssnano'
import zip from 'gulp-zip'
import { name } from './package.json'
import version from './version.json'
import fs from 'fs'
import webpackStream from 'webpack-stream'
import webpack from 'webpack'
import getWebpackConfig from './webpack.config'

const dist = process.argv.includes(`dev`) ? `dev-server` : `dist`

const webpackConfig = getWebpackConfig(dist)

const path = {
  src: {
    html: `src/html/views/*.html`,
    scss: `src/scss/main.scss`,
    js: `src/js/main.js`,
    shaders: `src/**/*.{frag,vert,glsl}`,
    assets: `src/assets/**/*`,
    rootFiles: `src/root-files/**/*`
  },
  dist: {
    html: dist,
    css: `${dist}/css`,
    js: `${dist}/js`,
    assets: `${dist}/assets`
  },
  watch: {
    html: `src/html/**/*.html`,
    scss: `src/scss/**/*.scss`,
    js: `src/js/**/*.js`
  },
  allFiles: `dist/**/*`,
  archive: `archive`,
  clean: dist,
  cleanAll: [`dev-server`, `dist`]
}

const sourseMap = new webpack.SourceMapDevToolPlugin({
  filename: `[file].map`,
  exclude: `vendors.js`
})

process.argv.includes(`dev`) && webpackConfig.plugins.push(sourseMap)

task(`html`, () =>
  src(path.src.html)
    .pipe(plumber())
    .pipe(fileinclude())
    .pipe(htmlBeautify())
    .pipe(dest(path.dist.html))
    .pipe(browserSync.stream())
)

task(`scss`, () =>
  src(path.src.scss)
    .pipe(plumber())
    .pipe(sass.sync().on(`error`, sass.logError))
    .pipe(postcss([mqpacker({ sort: sortCSSmq })]))
    .pipe(autoprefixer({ cascade: true }))
    .pipe(rename(function (path) { path.basename = `style` }))
    .pipe(dest(path.dist.css))
    .pipe(browserSync.stream())
)

task(`cssmin`, () =>
  src(`${path.dist.css}/**/*.css`)
    .pipe(cssnano({ zindex: false }))
    .pipe(dest(path.dist.css))
)

task(`js`, () =>
  src(path.src.js)
    .pipe(plumber())
    .pipe(webpackStream(webpackConfig))
    .pipe(dest(path.dist.js))
    .pipe(browserSync.stream())
)

task(`assets`, () =>
  src(path.src.assets)
    .pipe(dest(path.dist.assets))
    .pipe(browserSync.stream())
)

task(`root-files`, () =>
  src(path.src.rootFiles)
    .pipe(dest(path.dist.html))
    .pipe(browserSync.stream())
)

task(`server`, () =>
  browserSync.init({
    server: path.dist.html,
    notify: false
  })
)

task('zip', (done) => {
  let count = version.count || 0

  src(path.allFiles)
    .pipe(zip(`${name || `folder`}-v${count}.zip`))
    .pipe(dest(path.archive))

  version.count = ++count
  fs.writeFileSync(`version.json`, JSON.stringify(version), `utf8`)
  done()
})

task(`clean`, () => del(path.clean))

task(`clean-all`, () => del(path.cleanAll))

task(`watch`, () => {
  watch(path.watch.html, series(`html`))
  watch(path.watch.scss, series(`scss`))
  watch(path.watch.js, series(`js`))
  watch(path.src.shaders, series(`js`))
  watch(path.src.assets, series(`assets`))
  watch(path.src.rootFiles, series(`root-files`))
})

const tasks = [`html`, `js`, `scss`, `assets`, `root-files`]

task(`dev`, series(`clean`, ...tasks, parallel(`server`, `watch`)))

task(`prod`, series(`clean`, parallel(...tasks), `cssmin`))

task(`archive`, series(`prod`, `zip`))
