import { useState, useEffect } from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '@clerk/clerk-react'
import SearchBar from './SearchBar'

function Articles() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [articles, setArticles] = useState([])
  const [error, setError] = useState('')
  const navigate=useNavigate()
  const {getToken}=useAuth();
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  //get all articles
  async function getArticles() {
    //get jwt token
    const token=await getToken()
    //make authenticated req
    let res = await axios.get(`${BACKEND_URL}/author-api/articles`,{
      headers:{
        Authorization:`Bearer ${token}`
      }
    })
    if (res.data.message === 'articles') {
      setArticles(res.data.payload)
      setFilteredArticles(res.data.payload)
      setError('')
    } else {
      setError(res.data.message)
    }
  }
  console.log(error)

  function handleCategoryChange(category){
    setSelectedCategory(category);
    if(category){
      const filtered=articles.filter((article)=>article.category===category)
      setFilteredArticles(filtered)
    }else{
      setFilteredArticles(articles)
    }
  }

  const categories = [...new Set(articles.map((article)=>article.category))]

  //goto specific article
  function gotoArticleById(articleObj){
      navigate(`../${articleObj.articleId}`,{ state:articleObj})
  }


  useEffect(() => {
    getArticles()
  }, [])

  console.log(articles)

  return (
    <div className='container mt-3'>
      <div>
      {error.length!==0&&<p className='display-4 text-center mt-5 text-danger'>{error}</p>}
      <SearchBar
        categories={categories}
        onCategoryChange={handleCategoryChange}
      />
        <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 '>
          {
            filteredArticles.map((articleObj) => <div className='col' key={articleObj.articleId}>
              <div className="card h-100  ">
                <div className="card-body">
                {/* author image  */}
                  <div className="author-details text-end">
                    <img src={articleObj.authorData.profileImageUrl}
                      width='40px'
                      className='rounded-circle'
                      alt="" />
                    {/* author name */}
                    <p>
                      <small className='text-secondary'>
                        {articleObj.authorData.nameOfAuthor}
                      </small>
                    </p>
                  </div>
                  {/* article title */}
                  <h5 className='card-title'>{articleObj.title}</h5>
                  {/* article content upadto 80 chars */}
                  <p className='card-text'>
                    {articleObj.content.substring(0, 80) + "...."}
                  </p>
                  {/* read more button */}
                  <button className='custom-btn btn-4' onClick={()=>gotoArticleById(articleObj)}>
                    Read more
                  </button>
                </div>
                <div className="card-footer">
                {/* article's date of modification */}
                  <small className="text-body-secondary ">
                    Last updated on {articleObj.dateOfModification}
                  </small>
                </div>
              </div>
            </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default Articles