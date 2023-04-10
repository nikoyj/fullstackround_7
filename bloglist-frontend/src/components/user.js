import React from 'react'
import { Link } from 'react-router-dom'

const User = ({ user }) => {
  return (
    <tr>
      <td>
        <Link to={`/users/${user.id}`}>{user.name}</Link>
      </td>
      <td>has {user.blogs.length} blogs </td>
    </tr>
  )
}

export default User
