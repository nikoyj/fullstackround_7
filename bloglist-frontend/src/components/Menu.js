//import { Link } from 'react-router-dom'
import Notification from './Notification'
import { Button } from 'react-bootstrap'
import { Navbar, Nav } from 'react-bootstrap'

const Menu = ({ name, handleLogout }) => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <Navbar bg="light" variant="light">
        <Nav>
          <Navbar.Brand style={padding} href="/">
          blogs
          </Navbar.Brand>
          <Navbar.Brand style={padding} href="/users">
          users
          </Navbar.Brand>
          <Navbar.Brand>{name} logged in</Navbar.Brand>
          <Button variant="outline-primary" onClick={handleLogout} type="submit">
          logout
          </Button>
        </Nav>
      </Navbar>
      <Notification />
    </div>
  )
}

export default Menu
