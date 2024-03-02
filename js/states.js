const states = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']

const populateStates = () => {
  if (!states) {
    return
  }
  const appendToMe = document.getElementById('state')
  states.forEach(state => {
    const e = document.createElement('option')
    e.textContent = state
    appendToMe.appendChild(e)
  })
}

populateStates()
