// Create Element
const createElement = (type, attributes, textContent='') => {
  const element = document.createElement(type)
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
  element.textContent = textContent
  return element
}

// Update Total Charges Counter
const updateTotalCharges = () => {
  document.getElementById('total-charges').textContent = `Charges: ${data.charges.length}`
}

// Update Total People Counter
const updateTotalPeople = () => {
  document.getElementById('total-people').textContent = `People Involved: ${data.people.length}`
}

// Update Total Animals Counter
const updateTotalaAnimals = () => {
  document.getElementById('total-animals').textContent = `Animals Involved: ${data.animals.length}`
}

// Update Total Officers Counter
const updateTotalOfficers = () => {
  document.getElementById('total-officers').textContent = `Other Officers: ${data.officers.length}`
}

// Clean Date
const cleanDate = (date) => {
  return date.replace('T', ' ').replaceAll('-', '/')
}

// Calculate Age
const calculateAge = (dob) => {
  const now = new Date()
  const dobSplit = dob.split('-')
  let age

  if (now.getMonth() + 1 > dobSplit[1]) {
    age = now.getFullYear() - dobSplit[0]
  } 
  else if (now.getMonth() + 1 == dobSplit[1]) {
    age = now.getDate() >= dobSplit[2] ? now.getFullYear() - dobSplit[0] : now.getFullYear() - dobSplit[0] - 1
  }
  else {
    age = now.getFullYear() - dobSplit[0] - 1
  }
  return age.toString()
}
