/* eslint-disable no-unused-vars */
import './index.css'
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import Togglable from './components/Togglable'
import userService from './services/users'
import { SuscessMessage, ErrorMessage } from './components/Notification'
import { suscessNotification } from './reducers/suscessReducer'
import { errorNotification } from './reducers/errorReducer'
import { initBlogs, likeBlog, removeBlog, createBlog } from './reducers/blogsReducer'
import { initUser, logOut, setUser } from './reducers/userReducer'
import { Switch, Route } from 'react-router-dom'

const Users = () => {
  const [users, setUsers] = useState([])
  useEffect(() => {
    userService.getAll().then(response => {
      setUsers(response)
    })
  })
  return (
    <>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <td></td>
            <td><b>blogs created</b></td>
          </tr>
        </thead>
        <tbody>
          {users.map(user =>
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.blogs.length}</td>
            </tr>)}
        </tbody>
      </table>
    </>
  )
}

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')


  const blogFormRef = useRef()

  useEffect(() => {
    dispatch(initBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(initUser())
  }, [dispatch])

  const comp = (a, b) => {
    if(a.likes > b.likes) return -1
    if(a.likes < b.likes) return 1
    return 0
  }

  blogs.sort(comp)

  const addBlog = blogObj => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObj))
    dispatch(suscessNotification(`a new blog ${blogObj.title} by ${blogObj.author} has been added`, 5000))
  }
  const updateBlog = blogObj => {
    dispatch(likeBlog(blogObj.id))
  }

  const deleteBlog = async blogObj => {
    const id = blogObj.id
    const deletedOne = await blogService.getOne({ id })
    dispatch(removeBlog(blogObj.id))
    dispatch(suscessNotification(`blog ${deletedOne.title} by ${deletedOne.author} has been deleted`, 5000))
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      dispatch(setUser(username, password))
      setUsername('')
      setPassword('')
    } catch (ex) {
      dispatch(errorNotification('Wrong username or password', 5000))
    }
  }

  if(user === null) {
    return (
      <>
        <ErrorMessage />
        <Togglable buttonLabel='login' cancelLabel='cancel'>
          <form onSubmit={handleLogin}>
            <div>
              username
              <input
                type="text"
                id='username'
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
              />
            </div>
            <div>
              password
              <input
                type="password"
                id='password'
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <button type="submit" id='login-button'>login</button>
          </form>
        </Togglable>
      </>
    )
  }
  return (
    <>
      <SuscessMessage />
      <h2>blogs</h2>
      {user.username} logged in
      <button id='logout' onClick={() => {
        dispatch(logOut())
      }}>log out</button>
      <Switch>
        <Route path='/users'>
          <Users />
        </Route>
        <Route path='/'>
          <Togglable buttonLabel='create new blog' cancelLabel='cancel' ref={blogFormRef}>
            <BlogForm addBlog={addBlog} />
          </Togglable>
          {blogs.map(blog =>
            <div key={blog.id} className='blog'>
              <Blog blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} currentUser={user}/>
            </div>
          )}
        </Route>
      </Switch>
    </>
  )
}

export default App