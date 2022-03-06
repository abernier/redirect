```js
import redirr from 'redirr'
app.use(redirr())

app.post('/login', (req, res) => {
  ...

  res.redirect('/profile') // *planned redirect
})
```

*Override it with `next` querystring param:

```
$ curl -XPOST http://localhost:3000/login?next=/welcomeback
```
