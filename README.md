[![ci/cd](https://github.com/abernier/redirect/workflows/ci/cd/badge.svg)](https://github.com/abernier/redirect/actions?query=workflow%3Aci%2Fcd)
[![NPM version](https://img.shields.io/npm/v/@abernier/redirect.svg?style=flat)](https://www.npmjs.com/package/@abernier/redirect)

Connect/Express `?redirect` middleware.

In short, it allows you to override any route/handler `res.redirect('/foo')` with a `?redirect=/bar` querystring param.

# Example

```js
import express from 'express'
import redirect from '@abernier/redirect'

const app = express()
app.use(redirect())

// ...

app.post('/login', (req, res) => {
  // ...

  res.redirect('/profile') // *planned redirection
})
```

*Override it with `redirect` querystring param:

```
$ curl -XPOST http://localhost:3000/login?redirect=/welcomeback
```

# Publish to NPM

Ready to publish a new version to NPM registry?

## Manually

1. bump the `package.json` version
2. `npm login` if not already
3. `npm publish`

If successful, you should want to tag the version:
```shell
$ git add package.json
$ git commit -m "bump version"
$ git tag v1.0.1
$ git push --tags
```

## Using [CI/CD](https://github.com/abernier/redirect/actions?query=workflow%3Aci%2Fcd) workflow

Pre-requisite:
1. Generate a new NPM access token on [npmjs.com](https://www.npmjs.com/) (you need a NPM account and be logged-in)
2. Set it as `NPM_TOKEN` secret (in `Settings > Secrets` and as referenced into [`cicd.yml`](https://github.com/abernier/redirect/blob/master/.github/workflows/cicd.yml#L37) file)

---

Then, to release a new version on [npm](https://www.npmjs.com/package/redirect):
1. bump the [`package.json` version](https://github.com/abernier/redirect/edit/master/package.json)
2. then, create [a new realese](https://github.com/abernier/redirect/releases/new) and wait for the [ci/cd](https://github.com/abernier/redirect/actions?query=workflow%3Aci%2Fcd) publish it
