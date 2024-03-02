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
      children: [ createElement('label', { class: 'col-md-6' }, charge.law), createElement('label', { class: 'col-md-6' }, charge.severity)]

      // Modal Data
      modalData = {
        id: charge.id,
        appendHere: 'show-charge',
        mainText: charge.charge,
        children: [
          createElement('label', { class: 'col-md-6' }, charge.law),
          createElement('label', { class: 'col-md-6' }, charge.severity)
        ]
      }


      // Clear fields after grabbing data
      document.getElementById('charge').value = ''
      document.getElementById('lawSection').value = ''

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
        children: [ createElement('label', { class: 'col-md-12', for: officer.id }, text)]
      }

      break
    default:
      console.error('Incorrectly called modalAdd function')
  }

  // Create Elements
  const container = createElement('div', { className: 'form-check' })
  const checkbox = createElement('input', {
    class: 'form-check-input',
    type: 'checkbox',
    id: modalData.id
  })
  const label = createElement('label', {
    class: 'form-check-label col-md-12',
    for: modalData.id
  }, modalData.mainText)
  const desc = createElement('div', { class: 'row pd-l-15' })

  modalData.children.forEach(child => {
    desc.appendChild(child)
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

// Modal Add People (this one is too complicated and requires its own function)
const addPeople = () => {
  // Grab Data
  const person = {
    peopleType: document.getElementById('peopleType').value,
    ssn: document.getElementById('ssn').value,
    firstName: document.getElementById('firstName').value,
    middleName: document.getElementById('middleName').value,
    lastName: document.getElementById('lastName').value,
    addressLineOne: document.getElementById('addressLineOne').value,
    addressLineTwo: document.getElementById('addressLineTwo').value,
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
        className: 'col-md-12'
      }
    ]
  }

  // Clear input fields
  Object.keys(person).forEach(key => {
    if (key !== 'id' && key !== 'peopleType' && key !== 'sex' && key !== 'state' && key !== 'howIdentify')
      document.getElementById(key).value = ''
  })

  // Create Elements
  const container = createElement('div', { class: 'row' })
  const leftSide = createElement('div', { class: 'col-md-6' })
  const rightSide = document.createElement('div')
  rightSide.className = 'col-md-6'

  // Left Side
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

  leftSide.appendChild(checkbox)
  leftSide.appendChild(label)
  leftSide.appendChild(desc)

  // // Right side
  // if (person.peopleType === 'Suspect' && data.charges.length > 0) {
  //   data.charges.forEach(charge => {
  //     const id = self.crypto.randomUUID()

  //     const chargeCheckBox = document.createElement('input')
  //     chargeCheckBox.className = 'form-check-input'
  //     chargeCheckBox.type = 'checkbox'
  //     chargeCheckBox.id = id

  //     const charge = document.createElement('label')
  //     label.className = 'form-check-label col-md-12'
  //     label.setAttribute('for', modalData.id)
  //     label.textContent = modalData.mainText
  //   })
    
  //   rightSide.appendChild(select)
  // }

  // container.appendChild(leftSide)
  // container.appendChild(rightSide)
  // document.getElementById(modalData.appendHere).appendChild(container)
}
