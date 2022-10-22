import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Toggleable from '../components/Toggleable'

describe('<Toggleable />', () => {
  let container

  beforeEach(() => {
    container = render(
      <Toggleable buttonLabel='show...'>
        <div className='testDiv'>
          toggleable content
        </div>
      </Toggleable>
    ).container
  })

  test('renders its children', async () => {
    await screen.findAllByText('toggleable content')
  })

  test('at start children are not displayed', () => {
    const div = container.querySelector('.toggleableContent')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const div = container.querySelector('.toggleableContent')
    expect(div).not.toHaveStyle('display: none')
  })

  test('after clicking cancel, children are hidden', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)
    const closeButton = screen.getByText('cancel')
    await user.click(closeButton)
    const div = container.querySelector('.toggleableContent')
    expect(div).toHaveStyle('display: none')
  })

})