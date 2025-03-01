import { useContext, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { userAuthorContextObj } from '../../contexts/UserAuthorContext'
import { FaEdit } from 'react-icons/fa'
import { MdDelete, MdRestore } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import {  FaUserCircle, FaRegComment, FaRegClock, FaRegSmile, FaRegThumbsUp, FaReply, FaTrash } from 'react-icons/fa';

function ArticleByID() {

  const { state } = useLocation()
  const { currentUser } = useContext(userAuthorContextObj)
  const [editArticleStatus, setEditArticleStatus] = useState(false)
  const { register, handleSubmit,reset } = useForm()
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const [currentArticle,setCurrentArticle]=useState(state)
  const [commentStatus,setCommentStatus]=useState('')
  //console.log(state)

  //to enable edit of article
  function enableEdit() {
    setEditArticleStatus(true)
  }


  //to save modified article
  async function onSave(modifiedArticle) {
    const articleAfterChanges = { ...state, ...modifiedArticle }
    const token = await getToken()
    const currentDate = new Date();
    //add date of modification
    articleAfterChanges.dateOfModification = currentDate.getDate() + "-" + currentDate.getMonth() + "-" + currentDate.getFullYear()

    //make http post req
    let res = await axios.put(`http://localhost:3000/author-api/article/${articleAfterChanges.articleId}`,
      articleAfterChanges,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

    if (res.data.message === 'article modified') {
      //change edit article status to false
      setEditArticleStatus(false);
      navigate(`/author-profile/articles/${currentArticle.articleId}`, { currentArticle: res.data.payload })
    }


  }


  // //add comment by user
  async function addComment(commentObj){
    //add name of user to comment obj
    commentObj.nameOfUser=currentUser.firstName;
    const currentDate = new Date();
    commentObj.timestamp = currentDate.toLocaleString();
    
    console.log(commentObj)
    //http put
    let res=await axios.put(`http://localhost:3000/user-api/comment/${currentArticle.articleId}`,commentObj);
    if(res.data.message==='comment added'){
      setCommentStatus(res.data.message)
      setCurrentArticle(res.data.payload)
      reset();
    }
  }
  // Add this function to delete comments
async function deleteComment(commentId) {
  try {
    // Create API request to delete comment
    let res = await axios.delete(`http://localhost:3000/user-api/comment/${currentArticle.articleId}/${commentId}`);
    
    if (res.data.message === 'comment deleted') {
      // Update current article with the updated data
      setCurrentArticle(res.data.payload);
      setCommentStatus('Comment deleted successfully');
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    setCommentStatus('Failed to delete comment');
  }
}



  // // Add comment by user
  // async function addComment(commentObj) {
  //   commentObj.nameOfUser = currentUser.firstName;

  //   try {
  //     // Add the comment
  //     let res = await axios.put(
  //       `http://localhost:3000/user-api/comment/${currentArticle.articleId}`,
  //       commentObj
  //     );

  //     if (res.data.message === 'comment added') {
  //       setCommentStatus(res.data.message);
  //       reset();

  //       // Fetch the updated article data to refresh the comments
  //       const updatedArticleRes = await axios.get(
  //         `http://localhost:3000/user-api/article/${state.articleId}`,state);

  //       if (updatedArticleRes.data.message === 'article found') {
  //         setCurrentArticle(updatedArticleRes.data.payload);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error adding comment:', error);
  //     setCommentStatus('Failed to add comment');
  //   }
  // }


  //delete article
  async function deleteArticle(){
    state.isArticleActive=false;
    let res=await axios.put(`http://localhost:3000/author-api/articles/${currentArticle.articleId}`,state)
    if(res.data.message==='article deleted or restored'){
      setCurrentArticle(res.data.payload)
  }
  }
  //restore article
  async function restoreArticle(){
    state.isArticleActive=true;
    let res=await axios.put(`http://localhost:3000/author-api/articles/${currentArticle.articleId}`,state)
    if(res.data.message==='article deleted or restored'){
        setCurrentArticle(res.data.payload)
    }
  }

  return (
    <div className='container mt-3'>
      {
        editArticleStatus === false ? <>
          {/* print full article */}
          <div className="d-flex justify-contnet-between align-items-center article-header">
            <div className="mb-5 author-block w-100 px-4 py-2 rounded-2 d-flex justify-content-between align-items-center">
              <div>
                <p className="display-3 article-title me-4">{currentArticle.title}</p>
                {/* doc & dom */}
                <span className="py-3">
                  <small className="text-secondary me-4">
                    Created on : {currentArticle.dateOfCreation}
                  </small>
                  <small className="text-secondary me-4">
                    Modified on : {currentArticle.dateOfModification}
                  </small>
                </span>

              </div>
              {/* author details */}
              <div className="author-details text-center">
                <img src={currentArticle.authorData.profileImageUrl} width='60px' className='rounded-circle' alt="" />
                <p>{currentArticle.authorData.nameOfAuthor}</p>
              </div>

            </div>
            {/* edit & delete */}
            {
              currentUser.role === 'author' && (
                <div className="button-container me-3">
                  {/* edit button */}
                  <button className="me-2 btn btn-light edit-btn" onClick={enableEdit}>
                    <FaEdit className='' />
                  </button>
                  {/* if article is active,display delete icon, otherwise display restore icon */}
                  {
                    state.isArticleActive === true ? (
                      <button className="me-2 btn btn-light delete-btn" onClick={deleteArticle}>
                        <MdDelete className='text-danger fs-4' />
                      </button>
                    ) : (
                      <button className="me-2 btn btn-light restore-btn" onClick={restoreArticle}>
                        <MdRestore className='text-info fs-4' />
                      </button>
                    )
                  }
                </div>
              )
            }
          </div>
          {/* content*/}
          <p className="lead mt-3 article-content" style={{ whiteSpace: "pre-line" }}>
            {currentArticle.content}
          </p>
            {/* user commnets */}
          <div className='comments-container my-4'>
          <div class="comments-header">
          <FaRegComment className="header-icon" size={24} />
            <h3 class="comments-title">Comments</h3>
          </div>
            <div className="comments ">
              {
                state.comments.length === 0 ? 
                <div class="no-comments">
                 <FaRegSmile className="empty-icon" size={48} />
                <p>No comments yet..</p>
              </div> :
                  state.comments.map(commentObj => {
                    return (
                      <div key={commentObj._id} class="comment-card">
                      <div class="comment-header">
                        <div class="user-avatar ">
                        <FaUserCircle size={20} />
                        </div>
                        <p class="user-name">{commentObj?.nameOfUser}</p>
                        <span class="timestamp">
                        <FaRegClock className="time-icon" size={14} />
                          {commentObj?.dateOfModification || commentObj?.timestamp || 'Just now'}
                        </span>
                      </div>
                      <div class="comment-body">
                      <FaRegComment className="quote-icon" size={16} />
                        <p class="comment-text">{commentObj?.comment}</p>
                      </div>
                      <div class="comment-actions">
                        <button class="action-btn like-btn">
                        <FaRegThumbsUp size={16} />
                          Like
                        </button>
                        <button class="action-btn reply-btn">
                        <FaReply size={16} />
                          Reply
                        </button>
                        {/* Delete comment button - only visible to the user who posted it */}
              {commentObj?.nameOfUser === currentUser.firstName && (
                <button className="action-btn delete-btn" onClick={() => deleteComment(commentObj._id)}>
                   <FaTrash size={16} />
                  Delete
                </button>
              )}
                      </div>
                    </div>
                    )
                  })
              }
            </div>
          </div>
          {/* comment form */}
          <h6>{commentStatus}</h6>
          {
            currentUser.role==='user'&& (
            <form onSubmit={handleSubmit(addComment)} >
              <input type="text"  {...register("comment")} className="form-control mb-4"  placeholder='Add a comment..'/>
              <button className=" btn btn-success comment-btn">
                Add a comment
              </button>
            </form>
          )}
        </> :
          <form onSubmit={handleSubmit(onSave)}>
            <div className="mb-4">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                defaultValue={state.title}
                {...register("title")}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="category" className="form-label">
                Select a category
              </label>
              <select
                {...register("category")}
                id="category"
                className="form-select"
                defaultValue={state.category}
              >
                <option value="programming">Programming</option>
                <option value="AI&ML">AI&ML</option>
                <option value="database">Database</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="content" className="form-label">
                Content
              </label>
              <textarea
                {...register("content")}
                className="form-control"
                id="content"
                rows="10"
                defaultValue={state.content}
              ></textarea>
            </div>

            <div className="text-end">
              <button type="submit" className="btn btn-success">
                Save
              </button>
            </div>
          </form>
      }

    </div>
  )
}

export default ArticleByID




// import { useContext, useState } from 'react'
// import { useLocation } from 'react-router-dom'
// import { userAuthorContextObj } from '../../contexts/UserAuthorContext'
// import { FaEdit } from 'react-icons/fa'
// import { MdDelete, MdRestore } from 'react-icons/md'
// import { useForm } from 'react-hook-form'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '@clerk/clerk-react'


// function ArticleByID() {

//   const { state } = useLocation()
//   const { currentUser } = useContext(userAuthorContextObj)
//   const [editArticleStatus, setEditArticleStatus] = useState(false)
//   const { register, handleSubmit,reset } = useForm()
//   const navigate = useNavigate()
//   const { getToken } = useAuth()
//   const [currentArticle,setCurrentArticle]=useState(state)
//   const [commentStatus,setCommentStatus]=useState('')
//   console.log(state)

//   to enable edit of article
//   function enableEdit() {
//     setEditArticleStatus(true)
//   }


//   to save modified article
//   async function onSave(modifiedArticle) {
//     const articleAfterChanges = { ...state, ...modifiedArticle }
//     const token = await getToken()
//     const currentDate = new Date();
//     add date of modification
//     articleAfterChanges.dateOfModification = currentDate.getDate() + "-" + currentDate.getMonth() + "-" + currentDate.getFullYear()

//     make http post req
//     let res = await axios.put(`http://localhost:3000/author-api/article/${articleAfterChanges.articleId}`,
//       articleAfterChanges,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       })

//     if (res.data.message === 'article modified') {
//       change edit article status to false
//       setEditArticleStatus(false);
//       navigate(`/author-profile/articles/${state.articleId}`, { state: res.data.payload })
//     }


//   }


//   //add comment by user
//   async function addComment(commentObj){
//     add name of user to comment obj
//     commentObj.nameOfUser=currentUser.firstName;
//     console.log(commentObj)
//     http put
//     let res=await axios.put(`http://localhost:3000/user-api/comment/${currentArticle.articleId}`,commentObj);
//     if(res.data.message==='comment added'){
//       setCommentStatus(res.data.message)
//       setCurrentArticle(res.data.payload)
//       reset();
//     }
//   }



//   // Add comment by user
//   async function addComment(commentObj) {
//     commentObj.nameOfUser = currentUser.firstName;

//     try {
//       // Add the comment
//       let res = await axios.put(
//         `http://localhost:3000/user-api/comment/${currentArticle.articleId}`,
//         commentObj
//       );

//       if (res.data.message === 'comment added') {
//         setCommentStatus(res.data.message);
//         reset();

//         // Fetch the updated article data to refresh the comments
//         const updatedArticleRes = await axios.get(
//           `http://localhost:3000/user-api/article/${state.articleId}`,state);

//         if (updatedArticleRes.data.message === 'article found') {
//           setCurrentArticle(updatedArticleRes.data.payload);
//         }
//       }
//     } catch (error) {
//       console.error('Error adding comment:', error);
//       setCommentStatus('Failed to add comment');
//     }
//   }


//   delete article
//   async function deleteArticle(){
//     state.isArticleActive=false;
//     let res=await axios.put(`http://localhost:3000/author-api/articles/${state.articleId}`,state)
//     if(res.data.message==='article deleted or restored'){
//       setCurrentArticle(res.data.payload)
//   }
//   }
//   restore article
//   async function restoreArticle(){
//     state.isArticleActive=true;
//     let res=await axios.put(`http://localhost:3000/author-api/articles/${state.articleId}`,state)
//     if(res.data.message==='article deleted or restored'){
//         setCurrentArticle(res.data.payload)
//     }
//   }

//   return (
//     <div className='container mt-3'>
//       {
//         editArticleStatus === false ? <>
//           {/* print full article */}
//           <div className="d-flex justify-contnet-between align-items-center article-header">
//             <div className="mb-5 author-block w-100 px-4 py-2 rounded-2 d-flex justify-content-between align-items-center">
//               <div>
//                 <p className="display-3 article-title me-4">{state.title}</p>
//                 {/* doc & dom */}
//                 <span className="py-3">
//                   <small className="text-secondary me-4">
//                     Created on : {state.dateOfCreation}
//                   </small>
//                   <small className="text-secondary me-4">
//                     Modified on : {state.dateOfModification}
//                   </small>
//                 </span>

//               </div>
//               {/* author details */}
//               <div className="author-details text-center">
//                 <img src={state.authorData.profileImageUrl} width='60px' className='rounded-circle' alt="" />
//                 <p>{state.authorData.nameOfAuthor}</p>
//               </div>

//             </div>
//             {/* edit & delete */}
//             {
//               currentUser.role === 'author' && (
//                 <div className="button-container me-3">
//                   {/* edit button */}
//                   <button className="me-2 btn btn-light edit-btn" onClick={enableEdit}>
//                     <FaEdit className='' />
//                   </button>
//                   {/* if article is active,display delete icon, otherwise display restore icon */}
//                   {
//                     state.isArticleActive === true ? (
//                       <button className="me-2 btn btn-light delete-btn" onClick={deleteArticle}>
//                         <MdDelete className='text-danger fs-4' />
//                       </button>
//                     ) : (
//                       <button className="me-2 btn btn-light restore-btn" onClick={restoreArticle}>
//                         <MdRestore className='text-info fs-4' />
//                       </button>
//                     )
//                   }
//                 </div>
//               )
//             }
//           </div>
//           {/* content*/}
//           <p className="lead mt-3 article-content" style={{ whiteSpace: "pre-line" }}>
//             {state.content}
//           </p>
//           {/* user commnets */}
//           <div>
//             <div className="comments my-4">
//               {
//                 state.comments.length === 0 ? <p className='display-3'>No comments yet..</p> :
//                   state.comments.map(commentObj => {
//                     return <div key={commentObj._id} >
//                       <p className="user-name">
//                         {commentObj?.nameOfUser}
//                       </p>
//                       <p className="comment">
//                         {commentObj?.comment}
//                       </p>
//                     </div>
//                   })
//               }
//             </div>
//           </div>
//           {/* comment form */}
//           <h6>{commentStatus}</h6>
//           {
//             currentUser.role==='user'&& (
//             <form onSubmit={handleSubmit(addComment)} >
//               <input type="text"  {...register("comment")} className="form-control mb-4" />
//               <button className="btn btn-success">
//                 Add a comment
//               </button>
//             </form>
//           )}
//         </> :
//           <form onSubmit={handleSubmit(onSave)}>
//             <div className="mb-4">
//               <label htmlFor="title" className="form-label">
//                 Title
//               </label>
//               <input
//                 type="text"
//                 className="form-control"
//                 id="title"
//                 defaultValue={state.title}
//                 {...register("title")}
//               />
//             </div>

//             <div className="mb-4">
//               <label htmlFor="category" className="form-label">
//                 Select a category
//               </label>
//               <select
//                 {...register("category")}
//                 id="category"
//                 className="form-select"
//                 defaultValue={state.category}
//               >
//                 <option value="programming">Programming</option>
//                 <option value="AI&ML">AI&ML</option>
//                 <option value="database">Database</option>
//               </select>
//             </div>
//             <div className="mb-4">
//               <label htmlFor="content" className="form-label">
//                 Content
//               </label>
//               <textarea
//                 {...register("content")}
//                 className="form-control"
//                 id="content"
//                 rows="10"
//                 defaultValue={state.content}
//               ></textarea>
//             </div>

//             <div className="text-end">
//               <button type="submit" className="btn btn-success">
//                 Save
//               </button>
//             </div>
//           </form>
//       }

//     </div>
//   )
// }

// export default ArticleByID