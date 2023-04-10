import { Link } from 'react-router-dom'
import Notification from './Notification'

const Menu = ({ name, handleLogout }) => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <div>
        <Link style={padding} to="/">
          blogs
        </Link>
        <Link style={padding} to="/users">
          users
        </Link>
        {name} logged in
        <button onClick={handleLogout} type="submit">
          logout
        </button>
      </div>
      <Notification />
    </div>
  )
}

export default Menu
