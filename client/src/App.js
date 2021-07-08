import React, { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  // Local Storage effect hook
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const parsedUser = JSON.parse(loggedUserJSON);
      setUser(parsedUser);
      blogService.setToken(parsedUser.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      setMessage({
        message: `${user.name} logged in successfully`,
        state: "successful",
      });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (exception) {
      setMessage({
        message: exception.response.data.error,
        state: "unsuccessful",
      });
      // console.log(message)
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleLogOut = async (event) => {
    event.preventDefault();
    try {
      window.localStorage.removeItem("loggedBlogappUser");
      setUser(null);
    } catch (error) {
      setMessage("User already logged out");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    try {
      blogService.create(blogObject).then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog));
      });
      setMessage({
        message: `A new blog "${blogObject.title}" by ${blogObject.author} added`,
        state: "successful",
      });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    } catch (error) {
      setMessage({
        message: "Failed to add a new blog",
        state: "unsuccessful",
      });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const updateBlog = async (blog) => {
    try {
      await blogService.update(blog.id, {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes,
      });
      const updatedBlog = blogs.map((selectedBlog) =>
        selectedBlog.id === blog.id
          ? { ...selectedBlog, likes: selectedBlog.likes + 1 }
          : selectedBlog
      );
      setBlogs(updatedBlog);
    } catch (error) {
      setMessage({
        message: "Failed to add like to post",
        state: "unsuccessful",
      });
    }
  };

  const removeBlog = async (blog) => {
    // console.log(blog);
    try {
      await blogService.deleteBlog(blog.id);
      setMessage({
        message: `${blog.title} has been deleted`,
        state: "successful",
      });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
      const removedBlogs = blogs.filter(
        (selectedBlog) => selectedBlog.id !== blog.id
      );
      setBlogs(removedBlogs);
    } catch (error) {
      setMessage({
        message: `${blog.title} cannot be deleted`,
        state: "unsuccessful",
      });
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  if (user === null) {
    return (
      <div>
        <LoginForm
          message={message}
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>Blogs</h2>
      <Notification message={message} />
      <p>{user.name} logged in</p>

      <button type="submit" onClick={handleLogOut}>
        Log Out
      </button>

      <h2>Create New Blog</h2>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <h2>Blog List</h2>
      {blogs.sort((a, b) => b.likes - a.likes) &&
        blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            removeBlog={removeBlog}
          />
        ))}
    </div>
  );
};

export default App;
