import { verify } from 'https://deno.land/x/djwt@v2.2/mod.ts'
import crocks from 'https://cdn.skypack.dev/crocks'

const { Async } = crocks

const getToken = compose(
  nth(1),
  split(' ')
)

const doVerify = Async.fromPromise(verify)

export default function (app) {
  app.use(
    function (req, res, next) {
      // health check
      if (req.path === '/') { return next() }
      try {
        Async.of(req.headers.get('authorization'))
          .map(getToken)
          .map(v => (console.log(v), v))
          .chain(token => doVerify(token, Deno.env.get('SECRET'), "HS256"))
          .fork(
            e => res.setStatus(500).send({ ok: false, msg: 'Could not verify JWT' }),
            payload => {
              req.user = payload
              next()
            }
          )
      } catch (e) {
        res.setStatus(401).send({ ok: false, msg: 'Not Authorized!' })
      }
    })
  return app
}

// ---- pure functions ---
function compose(f, g) {
  return (x) => f(g(x))
}

function nth(i) {
  return function (array) {
    return array[i]
  }
}

function split(c) {
  return function (s) {
    return s.split(c)
  }
}