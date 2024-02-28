const data = {
  charges: [],
  people: [],
  officers: []
}

// Modal Add
const modalAdd = (modalType) => {
  let modalData = {}

  switch (modalType) {
    case 'charges':
      // Grab Data
      const charge = {
        charge: document.getElementById('charge').value,
        law: document.getElementById('lawSection').value,
        severity: document.getElementById('severity').value,
        id: self.crypto.randomUUID()
      }

      // Update globals
      data.charges.push(charge)
      updateTotalCharges()
  
      // Modal Data
      modalData = {
        id: charge.id,
        appendHere: 'show-charge',
        mainText: charge.charge,
        children: [
          {
            text: charge.law,
            className: 'col-md-6'
          },
          {
            text: charge.severity,
            className: 'col-md-6'
          }
        ]
      }

      // Clear fields after grabbing data
      document.getElementById('charge').value = ''
      document.getElementById('lawSection').value = ''

      break
    case 'people':
      // Grab Data
      const person = {
        peopleType: document.getElementById('peopleType').value,
        ssn: document.getElementById('ssn').value,
        firstName: document.getElementById('firstName').value,
        middleName: document.getElementById('middleName').value,
        lastName: document.getElementById('lastName').value,
        address: document.getElementById('address').value,
        race: document.getElementById('race').value,
        sex: document.getElementById('sex').value,
        dob: document.getElementById('dob').value,
        height: document.getElementById('height').value,
        weight: document.getElementById('weight').value,
        hair: document.getElementById('hair').value,
        eye: document.getElementById('eye').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        email: document.getElementById('email').value,
        license: document.getElementById('license').value,
        state: document.getElementById('state').value,
        howIdentify: document.getElementById('howIdentify').value,
        id: self.crypto.randomUUID()
      }

      // Update globals
      data.people.push(person)
      updateTotalPeople()

      // Modal Data
      modalData = {
        id: person.id,
        appendHere: 'show-people',
        mainText: `${person.peopleType}: ${person.firstName} ${person.lastName}`,
        children: [
          {
            text: person.ssn,
            className: 'col-md-6'
          },
          {
            text: person.license,
            className: 'col-md-6'
          }
        ]
      }

      // Clear input fields
      Object.keys(person).forEach(key => {
        if (key !== 'id' && key !== 'peopleType' && key !== 'sex' && key !== 'state' && key !== 'howIdentify')
          document.getElementById(key).value = ''
      })
      break
    case 'officers':
      // Grab Data
      const officer = {
        officerName: document.getElementById('officerName').value,
        officerId: document.getElementById('officerId').value,
        resource: [],
        id: self.crypto.randomUUID()
      }

      let text = ''
      const resources = ['audio', 'video', 'supp', 'pics']
      resources.forEach(resource => {
        if (document.getElementById(resource).checked) {
          const capitalizeResource = resource.charAt(0).toUpperCase() + resource.slice(1)
          officer.resource.push(capitalizeResource)
          text += capitalizeResource
          text += ', '
        }
      })

      text = text.substring(0, text.length - 2)

      // Update globals
      data.officers.push(officer)
      updateTotalOfficers()

      // Modal Data
      modalData = {
        id: officer.id,
        appendHere: 'show-officers',
        mainText: `${officer.officerName} (${officer.officerId})`,
        children: [
          {
            text,
            className: 'col-md-12'
          }
        ]
      }

      break
    default:
      console.error('Incorrectly called modalAdd function')
  }

  // Create Elements
  const container = document.createElement('div')
  container.className = 'form-check'

  const checkbox = document.createElement('input')
  checkbox.className = 'form-check-input'
  checkbox.type = 'checkbox'
  checkbox.id = modalData.id

  const label = document.createElement('label')
  label.className = 'form-check-label col-md-12'
  label.setAttribute('for', modalData.id)
  label.textContent = modalData.mainText

  const desc = document.createElement('div')
  desc.className = 'row pd-l-15'

  modalData.children.forEach(child => {
    const e = document.createElement('label')
    e.className = child.className
    e.setAttribute('for', modalData.id)
    e.textContent = child.text
    desc.appendChild(e)
  })

  // Append Everything
  container.appendChild(checkbox)
  container.appendChild(label)
  container.appendChild(desc)
  document.getElementById(modalData.appendHere).appendChild(container)
}

// Modal Delete
const modalDelete = (modalType) => {
  let id = ''
  switch (modalType) {
    case 'charges':
      id = 'show-charge'
      break
    case 'people':
      id = 'show-people'
      break
    case 'officers':
      id = 'show-officers'
      break
    default:
      console.error('Invalid call of modalDelete')
  }

  const container = document.getElementById(id)
  for(let i = 0; i < container.children.length; i++) {
    for(let j = 0; j < container.children[i].children.length; j++) {
      if(container.children[i].children[j].checked) {
        // Update global data object
        for(let k = 0; k < data[modalType].length; k++) {
          if (data[modalType][k].id === container.children[i].children[j].id) {
            data[modalType].splice(k, 1)
            break
          }
        }
        // Remove elements
        container.children[i].remove()
        i--
        break
      }
    }
  }

  updateTotalCharges()
  updateTotalPeople()
  updateTotalOfficers()
}

const updateTotalCharges = () => {
  document.getElementById('total-charges').textContent = `Charges: ${data.charges.length}`
}

const updateTotalPeople = () => {
  document.getElementById('total-people').textContent = `People Involved: ${data.people.length}`
}

const updateTotalOfficers = () => {
  document.getElementById('total-officers').textContent = `Other Officers: ${data.officers.length}`
}
