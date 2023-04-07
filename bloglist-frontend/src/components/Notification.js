import { useNotificationValue } from '../notificationContext'

const Notification = () => {
  const pair = useNotificationValue()
  let error = pair.value
  const message = pair.message
  if (message === '') return null

  const style = {
    color: error ? 'red' : 'green',
    background: 'lightgrey',
    font_size: 30,
    border_style: 'solid',
    border_radius: 5,
    padding: 10,
    margin_bottom: 10
  }
  return <div style={style}>{message}</div>
}

export default Notification
