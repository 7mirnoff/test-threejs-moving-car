export default (dist) => ({
  mode: process.argv.includes(`dev`) ? `development` : `production`,
  output: {
    filename: `bundle.js`
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: `babel-loader`,
        exclude: /(node_modules)/
      }, {
        test: /\.(gif|png|jpg|jpeg|svg|glb|fbx)$/i,
        loader: `file-loader`,
        options: {
          name: `../[path]/[name].[ext]`,
          context: `src`,
          publicPath: dist
        }
      }, {
        test: /\.(frag|vert|glsl)$/,
        use: [
          {
            loader: 'glsl-shader-loader'
          }
        ]
      }
    ]
  },
  performance: {
    hints: false
  },
  resolve: {
    extensions: [`.js`, `.vue`, `.json`],
    alias: {
      vue$: `vue/dist/vue.esm.js`
    }
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          filename: `vendors.js`,
          test: /node_modules/,
          chunks: `all`,
          enforce: true
        }
      }
    }
  },
  plugins: [],
  devtool: false
})
