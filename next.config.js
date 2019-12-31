const resolve = require("resolve");
const withCSS = require("@zeit/next-css");

module.exports = withCSS({
  // webpack(config, options) {
  //   config.module.rules.push({
  //     test: /\.css$/,
  //     include: [/node_modules\/aws-amplify/],
  //     use: [
  //       {
  //         loader: require("styled-jsx/webpack").loader,
  //         options: {
  //           type: "global"
  //         }
  //       }
  //     ]
  //   });
  //   return config;
  // }
  webpack(config, options) {
    const { dir, isServer } = options;

    config.externals = [];

    if (isServer) {
      config.externals.push((context, request, callback) => {
        resolve(
          request,
          { basedir: dir, preserveSymlinks: true },
          (err, res) => {
            if (err) {
              return callback();
            }

            // Next.js by default adds every module from node_modules to
            // externals on the server build. This brings some undesirable
            // behaviors because we can't use modules that require CSS files like
            // `former-kit-skin-pagarme`.
            //
            // The lines below blacklist webpack itself (that cannot be put on
            // externals) and `former-kit-skin-pagarme`.
            if (res.match(/amplify.*/)) {
              return callback(null, `commonjs ${request}`);
            }
            if (
              res.match(/node_modules[/\\].*\.js/) &&
              !res.match(/node_modules[/\\]webpack/) &&
              !res.match(/node_modules[/\\]aws-amplify/)
            ) {
              return callback(null, `commonjs ${request}`);
            }
            callback();
          }
        );
      });
    }

    return config;
  },
  watchOptions: {
    ignored: /amplify.*/
  }
});
