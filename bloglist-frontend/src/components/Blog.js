import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { update, removeBlog } from '../services/blogs'
import { useMutation, useQueryClient } from 'react-query'
import { useNotificationDispatch } from '../notificationContext'

const Blog = (props) => {
  const dispatch = useNotificationDispatch()
  const blog = props.blog
  const queryClient = useQueryClient()
  const updateBlogMutation = useMutation(update, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    }
  })
  const removeBlogMutation = useMutation(removeBlog, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    }
  })
  const [blogObject, setBlogObject] = useState(blog)
  const [show, setShow] = useState(false)
  const showing = { display: show ? '' : 'none' }

  const toggleShowing = () => setShow(!show)

  const textforbutton = show ? 'hide' : 'view'

  const setMessage = (message, error) => {
    dispatch({
      type: 'CREATE',
      payload: { message: message, value: error }
    })
    setTimeout(() => {
      dispatch({ type: 'CLEAR' })
    }, 5 * 1000)
  }

  const like = () => {
    try {
      const updatedBlog = {
        ...blogObject,
        likes: blogObject.likes + 1
      }
      setBlogObject(updatedBlog)
      updateBlogMutation.mutate(updatedBlog)
      setMessage(`${blogObject.title} was succesfully updated!`, false)
    } catch {
      setMessage(`${blogObject.title} couldn't be updated!`, true)
    }
  }
  const removequestion = () => {
    if (window.confirm(`Are you sure you want to delete ${blogObject.title} by ${blogObject.author} ?`)) remove()
  }
  const remove = () => {
    try {
      removeBlogMutation.mutate(blogObject.id)
      setMessage(`${blogObject.title} was succesfully deleted`, false)
    } catch {
      setMessage(`${blogObject.title} couldn't be deleted`, true)
    }
  }
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle} className="blog">
      <span>
        <p>
          {blog.title} ~ {blog.author}{' '}
          <button id="view-button" onClick={toggleShowing}>
            {' '}
            {textforbutton}{' '}
          </button>
        </p>
      </span>
      <div style={showing}>
        <span>
          <p> {blog.url} </p>
          <p>
            {' '}
            {blogObject.likes}{' '}
            <button id="like-button" onClick={like} type="like">
              like
            </button>
          </p>
          <p> {blog.user.name} </p>
          {blog.user.username === props.user.username ? (
            <p>
              {' '}
              <button onClick={removequestion} type="delete">
                delete
              </button>
            </p>
          ) : (
            <p> </p>
          )}
        </span>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog
