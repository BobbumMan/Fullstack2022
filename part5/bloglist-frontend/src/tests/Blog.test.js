import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../components/Blog'

const user = {
  username: 'bigdog',
  name: 'Jameis'
}

const blog = {
  title: 'this is the title of the blog',
  author: 'Blorg Shmorgsen',
  url: 'internet.com',
  likes: 23,
  user: user
}

const mockHandlerRemove = jest.fn()
const mockHandlerLike = jest.fn()

describe('<Blog />', () => {
  let container

  beforeEach(() => {
    container = render(<Blog blog={blog} user={user} handleRemove={mockHandlerRemove}/>).container
  })

  test('renders content', () => {
    const element = screen.getByText('this is the title of the blog Blorg Shmorgsen')
    expect(element).toBeDefined()
  })

  test('displays title and author, but not urls or likes', async () => {
    const div = await screen.getByText('this is the title of the blog Blorg Shmorgsen')
    expect(div).toHaveClass('shownContent')
    const div2 = container.querySelector('.hiddenContent')
    expect(div2).toHaveStyle('display: none')
  })

  test('displays urls and likes when button clicked', async () => {
    const user = userEvent.setup()
    const div = container.querySelector('.hiddenContent')
    const button = await screen.findByText('view')
    await user.click(button)
    expect(div).not.toHaveStyle('display: none')
  })

  test('clicking like twice calls the function to increase likes twice', async () => {
    const user = userEvent.setup()
    const div = container.querySelector('.hiddenContent')
    const button = container.querySelector('.likeButton')
    await user.click(button)
    expect(div).not.toHaveStyle('display: none')
  })
})


