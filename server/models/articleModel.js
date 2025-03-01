const mongoose=require("mongoose")

//craete author schema
const authorDataSchema=new mongoose.Schema({
    nameOfAuthor:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    profileImageUrl:{
        type:String,
        required:true,
    },
},{"strict":"throw"})

//craete usercomment schema
const userCommentSchema=new mongoose.Schema({
    nameOfUser:{
        type:String,
        required:true,
    },
    comment:{
        type:String,
        required:true,
    },
},{"strict":"throw"})

//create Artcile schema
const articleSchema=new mongoose.Schema({
    authorData:{
        type:authorDataSchema,
    },
    articleId:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    dateOfCreation:{
        type:String,
        required:true,
    },
    dateOfModification:{
        type:String,
        required:true,
    },
    comments:{
        type:[userCommentSchema],
    },
    isArticleActive:{
        type:Boolean,
        required:true,
    }
},{"strict":"throw"})

//create model for article
const Artcile=mongoose.model('article',articleSchema)

//export
module.exports=Artcile;

