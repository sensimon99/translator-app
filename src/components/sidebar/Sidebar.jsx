import React from 'react'
import './Sidebar.css'

const Sidebar = () => {
  return (
    <div>
      <div className='sidebar-main'>
        <div className='sidebar'>
          <div className='deepsearch-main'>
            <h1 className='deepsearch'>DeepSearch</h1>
            <button className='new-chat'>New Chat</button>
          </div>

          <div className='user-details'>
            <div className='user-container'>
              <div className='user-info'>
                <h3 className='user-name'>Omawunmi</h3>
                <h3 className='user-email'>Oma@gmail.com</h3>
              </div>
              <div className='user-svg'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6.25008 3.33341C6.71032 3.33342 7.08342 2.96032 7.08342 2.50008C7.08342 2.03984 6.71032 1.66675 6.25008 1.66675H5.00008C3.15913 1.66675 1.66675 3.15913 1.66675 5.00008V15.0001C1.66675 16.841 3.15913 18.3334 5.00008 18.3334H6.25008C6.71032 18.3334 7.08341 17.9603 7.08341 17.5001C7.08341 17.0398 6.71032 16.6667 6.25008 16.6667H5.00008C4.07961 16.6667 3.33341 15.9206 3.33341 15.0001L3.33342 5.00008C3.33342 4.07961 4.07961 3.33341 5.00008 3.33341H6.25008Z" fill="#000501" />
                  <path d="M18.9227 10.5893C19.2481 10.2639 19.2481 9.73626 18.9227 9.41083L15.5893 6.07749C15.2639 5.75206 14.7363 5.75206 14.4108 6.07749C14.0854 6.40293 14.0854 6.93057 14.4108 7.256L16.3216 9.16675L6.66675 9.16675C6.20651 9.16675 5.83341 9.53984 5.83341 10.0001C5.83341 10.4603 6.20651 10.8334 6.66675 10.8334L16.3216 10.8334L14.4108 12.7442C14.0854 13.0696 14.0854 13.5972 14.4108 13.9227C14.7363 14.2481 15.2639 14.2481 15.5893 13.9227L18.9227 10.5893Z" fill="#000501" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar