import qs from "qs";

export default function (settings) {
  settings ||= {
    paramName: 'redirect'
  }

  const {paramName} = settings

  return function (req, res, next) {
    // console.log('redirect middleware');

    const n = req.query[paramName];

    const oldRedirect = res.redirect;

    // arguments: [status], url, [options]
    res.redirect = function () {
      // console.log('res.redirect', arguments);

      //
      // status, url, options values
      //

      let status;
      let url;
      let options;

      if (arguments.length > 2) {
        // 3 args
        status = arguments[0];
        url = arguments[1];
        options = arguments[2];
      } else {
        // 2 args or less
        const lastarg = arguments[arguments.length - 1];
        if (typeof lastarg !== "string") {
          // url, options
          status = undefined;
          url = arguments[0];
          options = lastarg;
        } else {
          // [status], url

          if (typeof arguments[0] === "number") {
            // status, url
            status = arguments[0];
            url = arguments[1];
            options = undefined;
          } else {
            // url
            status = undefined;
            url = arguments[0];
            options = undefined;
          }
        }
      }
      // console.log('redirect: url, status, options', url, status, options)

      options ||= {
        ignore: false,
        pass: true,
      };

      if (n) {
        if (options && options.ignore === true) {
          //console.log('ignoring redirect param!');

          // append ?redirect= param to the redirect url
          if (options.pass === true) {
            const u = new URL(url);
            const query = qs.parse(u.search); // TODO: replace qs by https://nodejs.org/api/url.html#new-urlsearchparams
            query[paramName] = n;
            u.search = qs.stringify(query);
            url = u.toString();
          }
        } else {
          url = n;
          // console.log('monkey-patched redirect');
        }
      }

      let args;
      if (status) {
        args = [url, status];
      } else {
        args = [url];
      }
      // console.log('args', args);
      return oldRedirect.apply(res, args);
    };

    next();
  };
}
