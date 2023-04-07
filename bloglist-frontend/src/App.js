import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import LoginForm from './components/loginForm'
import BlogForm from './components/blogForm'
import Notification from './components/Notification'
import { useNotificationDispatch } from './notificationContext'
import { useQuery } from 'react-query'
import { getAll } from './services/blogs'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const dispatch = useNotificationDispatch()
  const blogFormRef = useRef()

  const result = useQuery('blogs', getAll, {
    retry: true
  })

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  if (result.isLoading) return <div> Loading data... </div>
  if (result.isError) return <div> Blog service is unavailable due to an error 😔 </div>

  const blogs = result.data

  const setMessage = (message, error) => {
    dispatch({
      type: 'CREATE',
      payload: { message: message, value: error }
    })
    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, 5 * 1000)
  }


  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password
      })
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUser(user)
      console.log(`user ${user.username}`)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('Wrong username or password!', true)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    try {
      setUser(null)
      window.localStorage.clear()
      console.log('logged out')
    } catch {
      setMessage('Couldnt log out', true)
    }
  }

  return (
    <div>
      <h1>Blogs</h1>
      <Notification />

      {user === null ? (
        <Togglable buttonLabel="login">
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      ) : (
        <div>
          <p>
            {user.name} logged in
            <button onClick={handleLogout} type="submit">
              logout
            </button>
          </p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm />
          </Togglable>
          <ul>
            {blogs
              .sort((blog, blog2) => blog2.likes - blog.likes)
              .map((blog) => (
                <Blog key={blog.id} blog={blog} user={user} />
              ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App
