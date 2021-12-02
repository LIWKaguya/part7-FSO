import './index.css'
import React, { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import { SuscessMessage, ErrorMessage } from './components/Notification'
import { suscessNotification } from './reducers/suscessReducer'


const App = () => {
  const dispatch = useDispatch()

  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const comp = (a, b) => {
    if(a.likes > b.likes) return -1
    if(a.likes < b.likes) return 1
    return 0
  }

  blogs.sort(comp)

  const addBlog = async (blogObj) => {
    blogFormRef.current.toggleVisibility()
    const returnedBlog = await blogService.upload(blogObj)
    setBlogs(blogs.concat(returnedBlog))
    dispatch(suscessNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} has been added`, 5000))
  }
  const updateBlog = async blogObj => {
    const updatedBlog = await blogService.update(blogObj)
    setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog))
  }

  const deleteBlog = async blogObj => {
    const avoid = blogObj.id
    await blogService.clearOut(blogObj)
    setBlogs(blogs.filter(blog => blog.id !== avoid))
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const userLogin = await loginService.login({
        username, password
      })
      blogService.setToken(userLogin.token)
      setUser(userLogin)
      window.localStorage.setItem(
        'loggedBlogsUser', JSON.stringify(userLogin)
      )
      setUsername('')
      setPassword('')
    } catch (ex) {
      setErrorMessage('Wrong user name or password')
      setTimeout(() => {setErrorMessage(null)}, 5000)
    }
  }

  if(user === null) {
    return (
      <>
        <ErrorMessage errorMessage={errorMessage} />
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
    <div>
      <SuscessMessage />
      <h2>blogs</h2>
      {user.username} logged in
      <button id='logout' onClick={() => {
        window.localStorage.clear()
        setUser(null)
      }}>log out</button>
      <Togglable buttonLabel='create new blog' cancelLabel='cancel' ref={blogFormRef}>
        <BlogForm addBlog={addBlog} />
      </Togglable>
      {blogs.map(blog =>
        <div key={blog.id} className='blog'>
          <Blog blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} currentUser={user}/>
        </div>
      )}
    </div>
  )
}

export default App