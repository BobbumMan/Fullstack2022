import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import Toggleable from './components/Toggleable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const tempMessage = (temp) => {
    setMessage(temp)
    setTimeout(() => {
      setMessage(null)
    }, 2000)
  }

  const tempErrorMessage = (temp) => {
    setErrorMessage(temp)
    setTimeout(() => {
      setErrorMessage(null)
    }, 2000)
  }

  const handleRemove = async (blog) => {
    try {
      const deleted = await blogService.remove(blog)
      if (deleted.status === 204) {
        setBlogs(blogs.filter(b => b.id !== blog.id))
      } else {
        tempErrorMessage('unsuccessful deletion of blog')
      }
    } catch (error) {
      tempErrorMessage(error)
    }
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      tempMessage('logged in successfully')
    } catch (error) {
      if (!error.response.data.error) {
        tempErrorMessage(error.message)
      } else {
        tempErrorMessage(error.response.data.error)
      }
    }
  }

  const logout = () => {
    window.localStorage.clear()
    setUser(null)
    setUsername('')
    setPassword('')
    tempMessage('logged out successfully')
  }

  const createBlog = async (newBlog) => {
    try {
      const returnedBlog = await blogService.create(newBlog)
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(returnedBlog))
      tempMessage(`A new blog '${returnedBlog.title}' by ${returnedBlog.author} was added`)
    } catch (error) {
      if (!error.response.data.error) {
        tempErrorMessage(error.message)
      } else {
        tempErrorMessage(error.response.data.error)
      }
    }
  }

  const loginForm = () => (
    <>
      <h2>login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}/>
        </div>
        <div>
          password
          <input
            type="text"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}/>
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )

  const blogsList = () => (
    <>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog key={blog.id} blog={blog} user={user} handleRemove={handleRemove} />
        )
      }
    </>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} error={false}/>
      <Notification message={errorMessage} error={true}/>
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in</p>
          <button onClick={logout}>log out</button>
          <Toggleable buttonLabel='new blog' ref={blogFormRef}>
            <BlogForm createBlog={createBlog}/>
          </Toggleable>
          <br></br>
          {blogsList()}
        </div>}
    </div>
  )
}

export default App
