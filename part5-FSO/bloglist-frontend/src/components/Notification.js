import '../index.css'
import React from 'react'

export const SuscessMessage = ({ suscessMessage }) => {
  if(suscessMessage === null) return null
  return (
    <div className="suscess">
      {suscessMessage}
    </div>
  )
}

export const ErrorMessage = ({ errorMessage }) => {
  if(errorMessage === null) return null
  return (
    <div className="error">
      {errorMessage}
    </div>
  )
}

const notification = [ErrorMessage, SuscessMessage]

export default notification