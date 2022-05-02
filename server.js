const mongoose = require('mongoose')

const db = mongoose.connection
const url = "mongodb://127.0.0.1:27017/apod"

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true })

// we need to create a Schema for mongoose to use to store our data in it's model object
const Schema = mongoose.Schema
const apodSchema = Schema({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  }
}, {collection: 'images'})

const APOD = mongoose.model('APOD', apodSchema)

// initializing our app object
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded())

const port = process.env.PORT || 3000

// YOUR CODE GOES HERE

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

app.get("/", function (req, res) {
    // GET "/" should return a list of all APOD images stored in our database
    APOD.find().sort({'rating': 'desc'}).exec((error, images) => {
        if (error) {
            console.log(error)
            res.send(500)
        } else {
            res.json({favorite: images[0]})
        }
    })
  });
  
  app.get("/favorite", function (req, res) {
    // GET "/favorite" should return our favorite image by highest rating
    APOD.find().sort({'rating': 'desc'}).exec((error, images) => {
        if (error) {
          console.log(error)
          res.send(500)
        } else {
          res.json({favorite: images[0]})
        }
      })
  });
  
  app.post("/add", function (req, res) {
    // POST "/add" adds an APOD image to our database
    const { title, url, rating } = req.body;
    const newAPOD = APOD({
        "title": title,
        "url": url,
        "rating": parseInt(rating),
    })
    newAPOD.save();
    res.send(200);
  });
  
  app.delete("/delete", function (req, res) {
    // DELETE "/delete" deletes an image according to the title
    APOD.deleteOne({ title: req.body.title }, function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    });
  });