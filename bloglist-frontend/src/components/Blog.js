import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { update, removeBlog } from '../services/blogs'
import { useMutation, useQueryClient } from 'react-query'
import { useNotificationDispatch } from '../notificationContext'
import { Link } from 'react-router-dom'

const Blog = (props) => {
  const dispatch = useNotificationDispatch()
  const blog = props.blog
  if (!blog) return null
  const queryClient = useQueryClient()
  const updateBlogMutation = useMutation(update, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
      queryClient.invalidateQueries('users')
    }
  })
  const removeBlogMutation = useMutation(removeBlog, {
    onSuccess: () => {
      queryClient.invalidateQueries('blogs')
    }
  })
  const [blogObject, setBlogObject] = useState(blog)
  const [comment, editComment]= useState('')


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
  const handlecomment = (event) => {
    editComment(event.target.value)
  }
  const addcomment = () => {
    console.log(comment)
    try {
      const updatedBlog = {
        ...blogObject,
        comments: blogObject.comments.concat(comment)
      }
      setBlogObject(updatedBlog)
      updateBlogMutation.mutate(updatedBlog)
      setMessage(`New comment on ${blogObject.title}`, false)
    } catch {
      setMessage('comment not working', true)
    }
    editComment('')
  }
  const removequestion = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${blogObject.title} by ${blogObject.author} ?`
      )
    )
      remove()
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
        <h2>
          {blog.title} ~ {blog.author}{' '}
        </h2>
      </span>
      <div>
        <span>
          <Link to={blog.url}>{blog.url}</Link>
          <p>
            {' '}
            {blogObject.likes}{' '}
            <button id="like-button" onClick={like} type="like">
              like
            </button>
          </p>
          <p> added by {blog.user.name} </p>
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
          <h3>Comments </h3>
          <form onSubmit={addcomment}>
            <div>
                commment: <input
                value={comment}
                onChange={handlecomment}/>
            </div>
            <button> save </button>
          </form>
          <ul>
            {blogObject.comments
              .map((comment, indx) => (
                <li key={indx}>
                  {comment}
                </li>
              ))}
          </ul>
        </span>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object,
  user: PropTypes.object.isRequired
}

export default Blog
