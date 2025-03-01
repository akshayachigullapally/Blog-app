import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.css';
import App from './App.jsx'
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom';
import RootLayout from './components/RootLayout.jsx';
import Home from './components/common/Home.jsx';
import Signin from './components/common/Signin.jsx';
import Signup from './components/common/Signup.jsx';
import UserProfile from './components/user/UserProfile.jsx';
import Articles from './components/common/Articles.jsx';
import ArticleById from './components/common/ArticleById.jsx';
import AuthorProfile from './components/author/AuthorProfile.jsx';
import PostArticle from './components/author/PostArticle.jsx';
import UserAuthorContext from './contexts/UserAuthorContext.jsx';
import AdminProfile from './components/admin/AdminProfile.jsx';
import UsersnAuthors from './components/admin/UsersnAuthors.jsx';

const browserRouterObj=createBrowserRouter([
  {
    path:"/",
    element:<RootLayout />,
    children:[
      {
        path:"",
        element:<Home />
      },
      {
        path:"signin",
        element:<Signin />
      },
      {
        path:"signup",
        element:<Signup />
      },
      {
        path:"user-profile/:email",
        element:<UserProfile />,
        children:[
          {
            path:"articles",
            element:<Articles />
          },
          {
            path:":articleId",
            element:<ArticleById />
          },
          {
            path:"",
            element:<Navigate to="articles" />
          }
        ]
      },
      {
        path: 'admin-profile/:email',
        element: <AdminProfile />,
        children: [
          {
            index: true, // This will make the `usersnauthors` page the default
            element: <UsersnAuthors />,
          },
          {
            path: 'usersnauthors',
            element: <UsersnAuthors />,
          },
        ]
        },
        {
        path:"author-profile/:email",
        element:<AuthorProfile />,
        children:[
          {
            path:"articles",
            element:<Articles />
          },
          {
            path:":articleId",
            element:<ArticleById />
          },
          {
            path:"article",
            element:<PostArticle />
          },
          {
            path:"",
            element:<Navigate to="articles" />
          }
        ]
      }
    ]
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserAuthorContext>
      <RouterProvider router={browserRouterObj} future={{
        v7_startTransition: true,
      }} />
    </UserAuthorContext>

  </StrictMode>,
)
