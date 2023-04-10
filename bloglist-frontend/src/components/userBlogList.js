import React from 'react'
import { Link } from 'react-router-dom'

const UserBlogList = ({ user, blogs }) => {
  //if (!user) return null
  return (
    <div>
      <h2>{user.name}</h2>
      {console.log(blogs)}
      <ul>
        {blogs
          .sort((blog, blog2) => blog2.likes - blog.likes)
          .map((blog) => (
            <li key={blog.id}>
              {' '}
              <Link to={`/blogs/${blog.id}`}>
                {' '}
                {blog.title} by {blog.author}{' '}
              </Link>{' '}
            </li>
          ))}
      </ul>
    </div>
  )
}

export default UserBlogList
