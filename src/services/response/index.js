export const success = (res, status, data, message) => {
  res.status(status || 200).json({ success: 1, message: message || "Success!", data: data || undefined })
}

export const error = (res, status, message) => {
  return res.status(status || 400).json({ success: 0, message: message || "Error!" })
}

export const notFound = (res) => (entity) => {
  if (entity) {
    return entity
  }
  res.status(404).json({ success: 0, message: "Not found!" }).end()
  return null
}

export const authorOrAdmin = (res, user, userField) => (entity) => {
  if (entity) {
    const isAdmin = user.role === 'admin'
    const isAuthor = entity[userField] && entity[userField].equals(user.id)
    if (isAuthor || isAdmin) {
      return entity
    }
    res.status(401).end()
  }
  return null
}