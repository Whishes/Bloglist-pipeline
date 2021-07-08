import React, { useState } from "react"

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url,
    })
    // console.log(blogObject)
    setTitle("")
    setAuthor("")
    setUrl("")
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        Title:{" "}
        <input
          className="title"
          type="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        Author:{" "}
        <input
          className="author"
          type="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        Url:{" "}
        <input
          className="url"
          type="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>

      <button id="submitButton" type="submit">
        Submit Blog
      </button>
    </form>
  )
}

export default BlogForm
