const exp=require('express')
const userApp=exp.Router();
const UserAuthor=require("../models/userAuthorModel")
const expressAsyncHandler=require("express-async-handler");
const createUserOrAuthor=require("./createUserOrAuthor");
const Article=require("../models/articleModel")

//API

//create new user
userApp.post("/user",expressAsyncHandler(createUserOrAuthor))

//add comment
userApp.put('/comment/:articleId',expressAsyncHandler(async(req,res)=>{
    //get comment obj
    const commentObj=req.body;
    console.log(commentObj,req.params.articleId)
    //add commnetObj to comments array of article
   const articleWithComments= await Article.findOneAndUpdate(
        { articleId:req.params.articleId},
        { $push:{ comments:commentObj}},
        {returnOriginal:false})

        console.log(articleWithComments)
    //send res
    res.status(200).send({message:"comment added",payload:articleWithComments})

}))
//fetch all users
userApp.get("/users",expressAsyncHandler(async (req, res) => {
    const userId = req.headers.authorization?.split(" ")[1]
    // console.log("user",userId)
    const users = await UserAuthor.find({ _id: { $ne: userId },role: { $ne: 'admin' }}).select("-password");
    res.status(200).send({ message: "Users fetched successfully", payload: users });
  
  })
  )

// Delete comment using articleId and comment text
userApp.delete('/comment/:articleId', expressAsyncHandler(async (req, res) => {
  const { comment } = req.body;
  const { articleId } = req.params;

  if (!comment) {
      return res.status(400).send({ message: "Comment text is required" });
  }

  // Find article and remove the specific comment
  const updatedArticle = await Article.findOneAndUpdate(
      { articleId: articleId },
      { $pull: { comments: { text: comment } } }, // Match by comment text
      { new: true }
  );

  if (!updatedArticle) {
      return res.status(404).send({ message: "Article not found or comment does not exist" });
  }

  res.status(200).send({ message: "Comment deleted", payload: updatedArticle });
}));




module.exports=userApp;