Connect/Express `?redirect` middleware.

In short, it allows you to override any route/handler `res.redirect('/foo')` with `?redirect=/bar`

# Example

```js
import redirect from '@abernier/redirect'

app.use(redirect())

app.post('/login', (req, res) => {
  ...

  res.redirect('/profile') // *planned redirection
})
```

*Override it with `redirect` querystring param:

```
$ curl -XPOST http://localhost:3000/login?redirect=/welcomeback
```
