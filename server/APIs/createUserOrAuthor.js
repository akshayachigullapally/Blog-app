// const UserAuthor = require("../models/userAuthorModel");
// async function createUserOrAuthor(req,res){
//   //get user or author obj from req
//   const newUserAuthor=req.body;
//   //find the user by email id
//   const userInDb=await UserAuthor.findOne({email:newUserAuthor.email})
//   //if user or author existed
//   if(userInDb!==null)
//   {
//     //check with role
//     if(newUserAuthor.role===userInDb.role)
//      {
//       res.status(200).send({message:newUserAuthor.role,payload:userInDb})
//      }
//      else{
//       res.status(200).send({message:"Invalid role"})
//      }
//   }
//   else
//   {
//     let newUser=new UserAuthor(newUserAuthor);
//     let newUserOrAuthorDoc=await newUser.save();
//     res.status(201).send({message:newUserOrAuthorDoc.role,payload:newUserOrAuthorDoc})
//   }

// }


// module.exports=createUserOrAuthor



const UserAuthor = require("../models/userAuthorModel");

async function createUserOrAuthor(req,res){
    //business logic to create user or author
        //get user or author object from req
        const newUserAuthor=req.body;
        //console.log(userAuthor)

        //find the user by email id
        const userInDb= await UserAuthor.findOne({email:newUserAuthor.email})
        //if user or author existed
        if(userInDb!==null){
            //check with role
            if(newUserAuthor.role===userInDb.role){
                res.status(200).send({message:newUserAuthor.role,payload:userInDb})
            }else{
                res.status(200).send({message:"Inavlid role"})
            }
        }else{
            let newUser=new UserAuthor(newUserAuthor);
            let newUserOrAuthorDoc=await newUser.save()
            res.status(201).send({message:newUserOrAuthorDoc.role,payload:newUserOrAuthorDoc})

        }

}
module.exports=createUserOrAuthor;