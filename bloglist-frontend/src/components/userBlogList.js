import React from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const UserBlogList = ({ user, blogs }) => {
  if (blogs.length === 0) return(<div> <h2>{user.name}</h2> <p> This user has not commited any blogs to the website.  </p> </div>)
  return (
    <div>
      <h2>{user.name}</h2>
      <h6> List of submitted blogs: </h6>
      {console.log(blogs)}
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
  )
}

export default UserBlogList
