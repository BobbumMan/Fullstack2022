const totalLikes = require('../utils/list_helper').totalLikes
const dummy = require('../utils/list_helper').dummy
const favoriteBlog = require('../utils/list_helper').favoriteBlog
const mostBlogs = require('../utils/list_helper').mostBlogs
const mostLikes = require('../utils/list_helper').mostLikes

const blogsSingleEntry = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: '63433b033366d10983fe5138',
    __v: 0
  }
]

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: '63433b033366d10983fe5138',
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: '63433b033366d10983fe5138',
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    user:'63433b033366d10983fe5138',
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    user: '63433b033366d10983fe5138',
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    user: '63433b033366d10983fe5138',
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    user: '63433b033366d10983fe5138',
    __v: 0
  }
]

describe('dummy', () => {
  test('dummy returns 1', () => {
    expect(dummy([])).toBe(1)
  })
})

describe('total likes', () => {
  test('empty list returns correct number of likes (0)', () => {
    expect(totalLikes([])).toBe(0)
  })

  test('single entry returns correct number of likes', () => {
    expect(totalLikes(blogsSingleEntry)).toBe(7)
  })

  test('multiple blog entries returns correct count', () => {
    expect(totalLikes(blogs)).toBe(36)
  })
})

describe('favorite blog', () => {
  test('empty list returns empty object', () => {
    expect(favoriteBlog([])).toBeNull()
  })

  test('single entry returns single entry', () => {
    expect(favoriteBlog(blogsSingleEntry)).toEqual(
      {
        title: 'React patterns',
        author: 'Michael Chan',
        likes: 7
      }
    )
  })

  test('list of blogs returns with most liked', () => {
    expect(favoriteBlog(blogs)).toEqual(
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12
      }
    )
  })
})

describe('most blogs', () => {
  test('empty list returns null', () => {
    expect(mostBlogs([])).toBeNull()
  })

  test('list of one returns only that entry', () => {
    expect(mostBlogs(blogsSingleEntry)).toEqual(
      {
        author: 'Michael Chan',
        blogs: 1
      }
    )
  })

  test('list of all blogs retuns correct entry', () => {
    expect(mostBlogs(blogs)).toEqual(
      {
        author: 'Robert C. Martin',
        blogs: 3
      }
    )
  })
})

describe('most likes', () => {
  test('empty list returns null', () => {
    expect(mostLikes([])).toBeNull()
  })

  test('list of one returns only that entry', () => {
    expect(mostLikes(blogsSingleEntry)).toEqual(
      {
        author: 'Michael Chan',
        likes: 7
      }
    )
  })

  test('list of all blogs returns correct entry', () => {
    expect(mostLikes(blogs)).toEqual({
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})