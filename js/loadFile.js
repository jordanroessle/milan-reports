// Load file
const loadFile = () => {
  const file = document.getElementById('hiddenFile').files[0]
  const reader = new FileReader()
  reader.readAsText(file)

  reader.onload = () => {
    const json = JSON.parse(reader.result)

    // Validate JSON file input
    validationHelper([json], mainPageIds, ['charges', 'people', 'officers'], 'JSON')
    validationHelper(json.charges, chargesIds, ['id'], 'charges')
    validationHelper(json.people, peopleIds, ['id'], 'people')
    validationHelper(json.officers, officersIds, ['id', 'resource'], 'officers')

    // Populate Document
    // Main Page
    mainPageIds.forEach(id => {
      data[id] = json[id]
      document.getElementById(id).value = json[id]
    })

    // People
    json.people.forEach(person => {
      peopleIds.forEach(id => {
        document.getElementById(id).value = person[id]
      })
      addPeople()
    })

    // Update Suspect list before adding charges
    updateSuspectList()

    // Charges
    json.charges.forEach(charge => {
      chargesIds.forEach(id => {
        document.getElementById(id).value = charge[id]
      })
      addCharges()
    })
    
    // Officers
    json.officers.forEach(officer => {
      officersIds.forEach(id => {
        document.getElementById(id).value = officer[id]
      })
      officer.resource.forEach(checkbox => {
        document.getElementById(checkbox.toLowerCase()).checked = true
      })
      addOfficers()
    })
  }
    
    // On Error
  reader.onerror = () => {
    console.log(reader.error)
  }
}

// Button click to load file
const buttonUpload = () => {
  const hiddenInput = document.getElementById('hiddenFile')
  hiddenInput.click()
}

// Validation helper
const validationHelper = (arrayOfObjects, compareTo, exceptions, name) => {
  arrayOfObjects.forEach(object => {
    const keys = Object.keys(object)

    if (keys.length !== compareTo.length + exceptions.length) {
      throw Error(`Invalid number of keys in: ${name}`)
    }
    keys.forEach(key => {
      if(!compareTo.includes(key) && !exceptions.includes(key)) {
        throw Error(`Invalid key in ${name}: ${key}`)
      }
    })
  })
}
