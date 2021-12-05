import React from 'react'
import { useHistory } from 'react-router'

const Blog = ({ blog, updateBlog, deleteBlog, currentUser }) => {
  const history = useHistory()

  const updatingBlog = object => {
    updateBlog({
      id: blog.id
    })
  }

  const confirmDelete = object => {
    deleteBlog({
      id : blog.id,
      user: blog.user
    })
    history.push('/')
  }

  return (
    <>
      <h2> {blog.title} by {blog.author}</h2>
      {blog.url} <br />
      likes : {blog.likes} <button onClick={updatingBlog}>Like</button><br />
      {blog.user.username} <br />
      {blog.user.username !== currentUser.username ? <></>: <><button onClick={() => {window.confirm(`Delete ${blog.title} by ${blog.author} ?`) ? confirmDelete(): <></>}}>Delete</button> <br /></>}
      <h3>Comments</h3>
      <ul>
        {blog.comments.map(comment => <li key={comment}>{comment}</li>)}
      </ul>
    </>
  )
}

export default Blog