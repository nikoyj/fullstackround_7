import { useState, useEffect, useRef } from 'react'
import { Routes, Route, useMatch, Link } from 'react-router-dom'
import { useQuery } from 'react-query'
import blogService from './services/blogs'
import loginService from './services/login'
import { getUsers } from './services/users'
import { getAll } from './services/blogs'
import Togglable from './components/Togglable'
import LoginForm from './components/loginForm'
import BlogForm from './components/blogForm'
import Blog from './components/Blog'
import Menu from './components/Menu'
import User from './components/user'
import UserBlogList from './components/userBlogList'
import { useNotificationDispatch } from './notificationContext'
import { Table, Container } from 'react-bootstrap'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const dispatch = useNotificationDispatch()
  const blogFormRef = useRef()

  const result = useQuery('blogs', getAll, {
    retry: false
  })
  const resultuser = useQuery('users', getUsers)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  const users = resultuser.data
  const blogs = result.data
  const matchblog = useMatch('/blogs/:id')
  const matchuser = useMatch('/users/:id')

  if (result.isLoading || resultuser.isLoading)
    return <div> Loading data... </div>
  if (result.isError || resultuser.isError)
    return <div> Blog service is unavailable due to an error 😔 </div>
  const chosenblog = matchblog
    ? blogs.find((blog) => blog.id === matchblog.params.id)
    : null
  const chosenuser = matchuser
    ? users.find((user) => user.id === matchuser.params.id)
    : null

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
    <Container fluid>
      {user === null ? (
        <Togglable buttonLabel="login">
          <LoginForm
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      ) : (
        <div>
          <Menu name={user.name} handleLogout={handleLogout} />
          <h1>Blog app</h1>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <Togglable buttonLabel="new blog" ref={blogFormRef}>
                    <BlogForm />
                  </Togglable>
                  <Table striped bordered hover>
                    <tbody>
                      {blogs
                        .sort((blog, blog2) => blog2.likes - blog.likes)
                        .map((blog) => (
                          <tr key={blog.id}>
                            {' '}
                            <td>
                              <Link to={`/blogs/${blog.id}`}>
                                {' '}
                                {blog.title} by {blog.author}{' '}
                              </Link>{' '}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </div>
              }
            />
            <Route
              path="/blogs/:id"
              element={<Blog blog={chosenblog} user={user} />}
            />
            <Route
              path="/users/:id"
              element={
                chosenuser === null ? null : (
                  <UserBlogList
                    user={chosenuser}
                    blogs={blogs.filter(
                      (blog) => blog.user.id === chosenuser.id
                    )}
                  />
                )
              }
            />

            <Route
              path="/users"
              element={
                <div>
                  <h2> Users </h2>
                  <p> blogs created by the user </p>
                  <Table striped bordered hover>
                    <tbody>
                      {users.map((user) => (
                        <User key ={user.id} user={user} />
                      ))}
                    </tbody>
                  </Table>
                </div>
              }
            />
          </Routes>
        </div>
      )}
    </Container>
  )
}

export default App
