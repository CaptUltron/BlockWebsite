//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Journaling increases your self confidence, it helps you look at how far you have come and how you have overcame previous seemingly 'impossible' obstacle - Jeremia Say";
// const aboutContent = "";
// const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
const port = 5000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// establish connection with mongoDB atlas
mongoose.connect("mongodb+srv://roytheelite:pemNEBIy41DaNtSr@cluster0.ev2xew6.mongodb.net/BlogPostDB?retryWrites=true&w=majority");


const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({})
  .then(function(foundItem){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: foundItem
      })
  })
  .catch(function(error){
      console.log(error)
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
    const post = new Post({
      title: req.body.postTitle,
      content: req.body.postBody
    });

    post.save()
    .then(function(){
        res.redirect("/");
    })
    .catch(function(err){
      console.log(error)
    })
 
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

    Post.findOne({_id: requestedPostId})
    .then(function(posts){
      res.render("post", {
            id: posts._id,
            title: posts.title,
            content: posts.content
          });
    })
    .catch(function(error){
      console.log(error);
    })

});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/contact", function(req, res){
  res.render("contact");
});

// delete items from the list on clicking the checkbox
app.post("/delete", function(req,res){
  const id = req.body.button;
  
      Post.findByIdAndDelete(id)
      .then(function(){
          console.log("successfully deleted");
          res.redirect("/");
      })
      .catch(function(err){
          console.log(err);
      });
})

// listen to port 5000
app.listen(process.env.PORT || port, () => console.log('listening on port: ', {port}))
