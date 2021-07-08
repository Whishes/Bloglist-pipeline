import React, { useState } from "react"

const Blog = ({ blog, updateBlog, removeBlog }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const addLike = () => {
    updateBlog({
      ...blog,
      likes: blog.likes + 1,
    })
  }

  const handleRemove = () => {
    if (window.confirm(`Remove ${blog.title}?`)) removeBlog(blog)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  }

  if (!visible) {
    return (
      <div style={blogStyle} className="defaultContent">
        <p>
          <span className="title">{blog.title}</span> -
          <span className="author">{blog.author}</span>
          <button id="viewContent" onClick={toggleVisibility} className="view">
            View
          </button>
        </p>
      </div>
    )
  }

  return (
    <div style={blogStyle} className="revealContent">
      <p>
        <span className="title">{blog.title}</span> -
        <span className="author">{blog.author}</span>
        <button id="hideContent" onClick={toggleVisibility}>
          Hide
        </button>
      </p>
      <p className="url">Url: {blog.url}</p>
      <p className="likes">
        <span>Likes:</span> <span className="blogLikes">{blog.likes}</span>
        <button onClick={addLike} className="likeButton">
          Like
        </button>
      </p>
      <p className="username">User: {blog.user.name}</p>
      <button id="deleteButton" onClick={handleRemove}>
        Delete
      </button>
    </div>
  )
}

export default Blog
