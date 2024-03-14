const data = {
  charges: [],
  people: [],
  officers: []
}

// Add People 
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
    children: [ createElement('label', { class: 'col-md-12', for: person.id }, `SSN: ${person.ssn}`) ]
  }


  // Clear input fields after grabbing data
  Object.keys(person).forEach(key => {
    if (key !== 'id' && key !== 'peopleType' && key !== 'sex' && key !== 'state' && key !== 'howIdentify')
      document.getElementById(key).value = ''
  })

  // Add Preview
  modalAddPreview(modalData)
}

// Add Charge
const addCharges = () => {
  // Grab Data
  const charge = {
    charge: document.getElementById('charge').value,
    law: document.getElementById('law').value,
    severity: document.getElementById('severity').value,
    committedBy: document.getElementById('committedBy').value,
    id: self.crypto.randomUUID()
  }

  // Update globals
  data.charges.push(charge)
  updateTotalCharges()

  // Modal Data
  modalData = {
    id: charge.id,
    appendHere: 'show-charge',
    mainText: `${charge.severity} by ${charge.committedBy}`,
    children: [createElement('label', { class: 'col-md-12', for: charge.id }, charge.charge)]
  }

  // Clear input fields after grabbing data
  document.getElementById('charge').value = ''
  document.getElementById('law').value = ''

  // Add Preview
  modalAddPreview(modalData)
}

// Add Officer
const addOfficers = () => {
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

  // Clear input fields after grabbing data
  document.getElementById('officerName').value = ''
  document.getElementById('officerId').value = ''
  officerCheckboxes.forEach(checkbox => document.getElementById(checkbox).checked = false)

  // Add Preview
  modalAddPreview(modalData)
}

// Modal Add Preview
const modalAddPreview = (modalData) => {
  // Create Elements
  const container = createElement('div', { className: 'row' })
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

// Update Suspect list in charges modal
const updateSuspectList = () => {
  const dropdown = document.getElementById('committedBy')
  dropdown.innerHTML = ''

  const suspects = data.people.filter(x => x.peopleType === 'Suspect')
  suspects.forEach(suspect => {
    const option = createElement('option', {}, `${suspect.firstName} ${suspect.lastName}`)
    dropdown.appendChild(option)
  })
}

// Set remaining data
const setData = () => {
  data.officerReporting = document.getElementById("officerReporting").value
  data.ihsCase = document.getElementById("ihsCase").value
  data.occurredFrom = document.getElementById("occurredFrom").value
  data.occurredTo = document.getElementById("occurredTo").value
  data.datetimeReported = document.getElementById("datetimeReported").value
  data.locationLineOne = document.getElementById("locationLineOne").value
  data.locationLineTwo = document.getElementById("locationLineTwo").value
  data.jurisdiction = document.getElementById("jurisdiction").value
  data.probableCause = document.getElementById("probableCause").value
}

// Preview Pdf
const previewPdf = async () => {
  setData()

  const doc = await createPdf(data)
  const blob = new Blob([doc.output('blob')], { type: 'application/pdf' })

  const embed = document.getElementById('pdfPreview')
  embed.src = URL.createObjectURL(blob)
}

// Download Pdf
const downloadFiles = async () => {
  setData()

  const pdf = await createPdf(data)
  pdf.save(`${data.ihsCase}.pdf`)

  const a = document.createElement("a")
  const file = new Blob([JSON.stringify(data)], {type: "application/json"})
  a.href = URL.createObjectURL(file)
  a.download = `${data.ihsCase}.json`
  a.click()
}
