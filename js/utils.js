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

// Update Total Officers Counter
const updateTotalOfficers = () => {
  document.getElementById('total-officers').textContent = `Other Officers: ${data.officers.length}`
}
