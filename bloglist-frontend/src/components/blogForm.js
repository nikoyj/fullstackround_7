import { useState } from 'react'
import { create } from '../services/blogs'
import { useMutation, useQueryClient } from 'react-query'
import { useNotificationDispatch } from '../notificationContext'

const BlogForm = () => {
  const [newBlog, setnewBlog] = useState('')
  const [newBlogAuth, setnewBlogAuth] = useState('')
  const [newBlogUrl, setnewBlogUrl] = useState('')
  const dispatch = useNotificationDispatch()
  const queryClient = useQueryClient()
  const newBlogMutation = useMutation(create, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    },
    onError: () => {
      setMessage(
        'Error happeden while adding the blog, some of the properties are unfit for a blog',
        true
      )
    }
  })

  const setMessage = (message, error) => {
    dispatch({
      type: 'CREATE',
      payload: { message: message, value: error }
    })
    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, 5 * 1000)
  }

  const addBlog = (event) => {
    try {
      event.preventDefault()
      newBlogMutation.mutate({
        title: newBlog,
        author: newBlogAuth,
        url: newBlogUrl
      })
      setMessage(`New blog ${newBlog} by ${newBlogAuth}`, false)
    } catch {
      setMessage(`New blog ${newBlog} cannot be added!`, true)
    }
    setnewBlog('')
    setnewBlogAuth('')
    setnewBlogUrl('')
  }

  const handleTitle = (event) => {
    setnewBlog(event.target.value)
  }

  const handleAuth = (event) => {
    setnewBlogAuth(event.target.value)
  }

  const handleUrl = (event) => {
    setnewBlogUrl(event.target.value)
  }

  return (
    <div>
      <h2>Create a new note</h2>
      <form onSubmit={addBlog}>
        <div>
          <input
            id="title"
            type="text"
            placeholder="Title"
            value={newBlog}
            onChange={handleTitle}
          />
        </div>
        <div>
          <input
            id="author"
            type="text"
            placeholder="Author"
            value={newBlogAuth}
            onChange={handleAuth}
          />
        </div>
        <div>
          <input
            id="url"
            type="text"
            placeholder="Url"
            value={newBlogUrl}
            onChange={handleUrl}
          />
        </div>
        <button id="save" type="submit">
          save
        </button>
      </form>
    </div>
  )
}

export default BlogForm
