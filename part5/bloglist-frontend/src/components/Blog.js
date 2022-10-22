import { useState } from 'react'
import blogService from '../services/blogs'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, handleRemove }) => {

  const [visibility, setVisibility] = useState(false)
  const [likes, setLikes] = useState(blog.likes)
  const [buttonVis, setButtonVis] = useState(true)

  const changeVisibility = () => {
    setVisibility(!visibility)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = async () => {
    blog.likes = blog.likes + 1
    setLikes(blog.likes)
    blog.user = blog.user.id
    setButtonVis(false)

    const updated = await blogService.update(blog)
    console.log(updated)
  }

  const showWhenVisible = { display: visibility ? '' : 'none' }
  const showWhenVisibleButton = { display: buttonVis ? '' : 'none' }
  const showRemove = { display: user.username === blog.user.username ? '' : 'none' }

  return (
    <div style={blogStyle} className='shownContent'>
      {blog.title} {blog.author}
      <button onClick={changeVisibility}>{visibility ? 'hide' : 'view'}</button>
      <div style={showWhenVisible} className='hiddenContent'>
        {blog.url}<br></br>
        likes {likes}<button style={showWhenVisibleButton} onClick={handleLike} className='likeButton'>like</button><br></br>
        {blog.user.name}
        <br></br>
        <button onClick={() => handleRemove(blog)} style={showRemove}>remove</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  handleRemove: PropTypes.func.isRequired
}

export default Blog