import React from 'react'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-message">
          📊 All Your Payments One Smart Dashboard 💡
        </p>
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} PayPanel All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
