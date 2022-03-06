import qs from 'qs'

export default function (req, res, next) {
  console.log('next middleware');

  const n = req.query.next;
  
  const oldRedirect = res.redirect;

  // arguments: [status], url, [options]
  res.redirect = function () {
    console.log('res.redirect', arguments);
    
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
      const lastarg = arguments[arguments.length-1];
      if (typeof lastarg !== 'string') {
        // url, options
        status = undefined;
        url = arguments[0];
        options = lastarg;
      } else {
        // [status], url

        if (typeof arguments[0] === 'number') {
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
    console.log('redirect: url, status, options', url, status, options)

    options ||= {
      next: true,
      passnext: true
    }
    
    if (n) {
      if (options && options.next !== true) {
        //console.log('ignoring next!');

        // append ?next= param to the redirect url
        if (options.passnext !== false) {
          const u = new URL(url)
          const query = qs.parse(u.search); // TODO: replace qs by https://nodejs.org/api/url.html#new-urlsearchparams
          query.next = n;
          u.search = qs.stringify(query)
          url = u.toString();
        }
      } else {
        url = n;
        console.log('monkey-patched redirect');
      }
    }

    let args;
    if (status) {
      args = [url, status];
    } else {
      args = [url];
    }
    console.log('args', args);
    return oldRedirect.apply(res, args);
  };

  next();
}
