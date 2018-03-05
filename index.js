const InstagramAPI = require('instagram-api')
const express = require('express')

const accessToken = '1443737746.39d8981.f82744a54e624c44b8539dc2a2438387'
const userID = '655798702'

const instagramAPI = new InstagramAPI(accessToken)
const app = express()

app.get('/run', (req, res) => {
  instagramAPI.userMedia(userID)
    .then((result) => {
      const likePromise = []
      result.data.forEach((media) => {
        const { id, user_has_liked } = media

        if (!user_has_liked) {
          likePromise.push(instagramAPI.postMediaLike(id))
        }
      })

      Promise.all(likePromise).then(
        (values) => {
          res.send(values)
        },
        (err) => {
          res.send(err)
        }
      )
    },
    (err) => {
      res.send(err)
    })
})

app.set('port', (process.env.PORT || 3000))
app.listen(app.get('port'))
