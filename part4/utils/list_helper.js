const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  const total = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(total, 0)
}

const favoriteBlog = (blogs) => {

  if (blogs.length === 0) {
    return null
  } else {
    const topBlog =  blogs.sort((a,b) => {
      return b.likes - a.likes
    })[0]

    const { title, author, likes } = topBlog
    return { title, author, likes }
  }
}

const mostBlogs = (blogs) => {

  if (blogs.length === 0) {
    return null
  }

  const total = _.countBy(blogs, (o) => {
    return o.author
  })

  const newtotal = []
  _.forIn(total, (value, key) => {
    newtotal.push({ author: key, blogs: value })
  })

  newtotal.sort((a, b) => {
    return b.blogs - a.blogs
  })

  return newtotal[0]
}

const mostLikes = (blogs) => {

  if (blogs.length === 0) {
    return null
  }

  const array = []

  const grouped = _.groupBy(blogs, 'author')
  _.forIn(grouped, (value, key) => {
    let likes = 0
    _.forIn(value, (v) => {
      likes = likes + v.likes
    })
    array.push({ author: key, likes: likes })
  })

  const ordered = _.orderBy(array, 'likes', 'desc')

  return ordered[0]
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }