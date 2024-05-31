// Globals
let doc = new jsPDF()
let y

// Margins
const leftMargin = 10
const rightMargin = 10
const topMargin = 20

// Width of writable area
const widthPage = doc.internal.pageSize.width - leftMargin - rightMargin

// Height addPage cutoff
const newPageCutOff = 250
const smallCutOff = 275

const maxLengthAddress = 30
const maxLengthCharge = 40

// Incident Table
const incidentX = {
  incidentOccuredX: leftMargin,
  incidentReportedX: leftMargin + .25 * widthPage,
  incidentLocationX: leftMargin + .5 * widthPage,
  incidentJurisdictionX: leftMargin + .8 * widthPage,
}

// Charges Table
const chargeX = {
  chargeCountX: leftMargin,
  chargeDescX: leftMargin + .1 * widthPage,
  chargeLawSectionX: leftMargin + .6 * widthPage,
  chargeSeverityX: leftMargin + .8 * widthPage
}

// People Table
const peopleHeaderX = {
  peopleTypeX: leftMargin,
  peopleName: leftMargin + .1 * widthPage,
  peopleDesc1: leftMargin + .4 * widthPage,
  peopleDesc1Ans: leftMargin + .46 * widthPage,
  peopleDesc2: leftMargin + .53 * widthPage,
  peopleDesc2Ans: leftMargin + .57 * widthPage,
  peopleDesc3: leftMargin + .63 * widthPage,
  peopleDesc3Ans: leftMargin + .69 * widthPage,
  peopleDesc4: leftMargin + .8 * widthPage,
  peopleDesc4Ans: leftMargin + .85 * widthPage
}

const peopleContactInfoX = {
  peopleFirstX: leftMargin + .4 * widthPage,
  peopleSecondX: leftMargin + .46 * widthPage,
}

const peopleIdentifyX = {
  peopleFirstX: leftMargin + .4 * widthPage,
  peopleSecondX: leftMargin + .48 * widthPage,
  peopleThirdX: leftMargin + .60 * widthPage,
  peopleFourthX: leftMargin + .65 * widthPage,
  peopleFifthX:  leftMargin + .73 * widthPage,
  peopleSixth: leftMargin + .84 * widthPage,
}

const peopleChargesX = {
  peopleChargesFirstX: leftMargin,
  peopleChargesSecondX: leftMargin + .5 * widthPage,
  peopleChargesThirdX: leftMargin + .7 * widthPage,
  peopleChargesFourthX: leftMargin + .8 * widthPage
}

// Animal Table
const animalX = {
  animalFirst: leftMargin,
  animalSecond: leftMargin + .10 * widthPage,
  animalSecondAnswer: leftMargin + .20 * widthPage,
  animalFourth: leftMargin + .40 * widthPage,
  animalFourthAnswer: leftMargin + .46 * widthPage,
  animalFifth: leftMargin + .62 * widthPage,
  animalFifthAnswer: leftMargin + .71 * widthPage
}

const animalOwner = {
  ownerFirst: leftMargin,
  ownerPhone: leftMargin + .4 * widthPage,
  ownerAddress: leftMargin + .6 * widthPage,
}

const officersX = {
  first: leftMargin,
  checkboxes: leftMargin + .3 * widthPage
}

const createPdf = async (data) => {
  doc = new jsPDF()
  y = topMargin

  // Set Header Texts
  const headerTexts = {
   headerText: 'Idaho Humane Society - Animal Control',
   subHeaderText: 'General Report',
   boxes: [
    `Officer Reporting: ${data.officerReporting}`,
    `IHS Case #: ${data.ihsCase}`,
    `Omnigo #: ${data.omnigoNumber}`,
    `DR #: ${data.drNumber}`
   ]
  }

  addHeader(headerTexts)

  // Incident
  addSectionHeader('Incident')
  addRow(incidentX,
    ['Date & Time Occured', 'Date & Time Reported', 'Location of Occurence', 'Jurisdiction'],
    Array(4).fill(fontNormal)
  )

  const [firstLine, secondLine] = textSplitter(data.locationLineOne, maxLengthAddress)

  addRow(incidentX, [
    `${cleanDate(data.occurredFrom)} to`,
    cleanDate(data.datetimeReported),
    firstLine,
    data.jurisdiction
  ],
    Array(4).fill(fontBold)
  )

  if (secondLine.length === 0) {
    addRow(incidentX, [
      cleanDate(data.occurredTo),
      '',
      data.locationLineTwo,
      ''
    ],
      Array(4).fill(fontBold)
    )
  } else {
    addRow(incidentX, [
      cleanDate(data.occurredTo),
      '',
      secondLine,
      ''
    ],
      Array(4).fill(fontBold)
    )
    addRow(incidentX, [
      '',
      '',
      data.locationLineTwo,
      ''
    ],
      Array(4).fill(fontBold)
    )
  }

  // Charges
  addSectionHeader('Charges')
  addRow(chargeX,
    ['Chg#', 'Offense/Charge', 'Law Section', 'Severity'],
    Array(4).fill(fontNormal)
  )

  data.charges.forEach((charge, i) => {
    const [firstLine, secondLine] = textSplitter(charge.charge, maxLengthCharge)

    addRow(chargeX,
      [(i + 1).toString(), firstLine, charge.law, charge.severity],
      Array(4).fill(fontBold)
    )
    if (secondLine.length > 0) {
      addRow(chargeX,
        ['', secondLine, '', ''],
        Array(4).fill(fontBold)
      )
    }
  })

  // Probable Cause
  addSectionHeader('Probable Cause')
  y = wrapText(data.probableCause, leftMargin, leftMargin + widthPage, true, headerTexts, 'Probable Cause (cont)')

  // People Involved
  !needNewPage(newPageCutOff, headerTexts, 'People Involved') && addSectionHeader('People Involved')
  data.people.forEach((people, index) => {
    needNewPage(newPageCutOff, headerTexts, 'People Involved (cont)')
    doc.setFontSize(sectionHeaderFontSize)
    addRow(incidentX, [
      `${people.peopleType}:  ${people.lastName}, ${people.firstName}${people.middleName ? ' ' + people.middleName : ''}`,
      '',
      '',
      ''
    ],
      Array(4).fill(fontBold)
    )

    doc.setFontSize(defaultFontSize)
    y += 4

    addRow(peopleHeaderX, [
      'Address: ',
      people.addressLineOne.length ? people.addressLineOne : 'n/a',
      'Race:',
      people.race.length ? people.race : 'n/a',
      'Sex: ',
      people.sex.length ? people.sex : 'n/a',
      'DOB: ',
      people.dob.length ? people.dob : 'n/a',
      'Age: ',
      calculateAge(people.dob)
    ],
      [fontNormal, fontBold, fontNormal, fontBold, fontNormal, fontBold, fontNormal, fontBold, fontNormal, fontBold]
    )
    addRow(peopleHeaderX, [
      '',
      people.addressLineTwo,
      'H: ',
      people.height.length ? people.height : 'n/a',
      'W: ',
      people.weight.length ? people.weight : 'n/a',
      'Hair: ',
      people.hair.length ? people.hair : 'n/a',
      'Eye: ',
      people.eye.length ? people.eye : 'n/a'
    ], 
      [fontNormal, fontBold, fontNormal, fontBold, fontNormal, fontBold, fontNormal, fontBold, fontNormal, fontBold]
    )

    y += 4
    addRow(peopleContactInfoX, [
      'Phone: ',
      people.phoneNumber.length ? people.phoneNumber : 'n/a',
    ],
      [fontNormal, fontBold]
    )
    addRow(peopleContactInfoX, [
      'Email: ',
      people.email.length ? people.email : 'n/a',
    ],
      [fontNormal, fontBold]
    )
    addRow(peopleContactInfoX, [
      'SSN: ',
      people.ssn.length ? people.ssn : 'n/a',
    ],
      [fontNormal, fontBold]
    )
    addRow(peopleIdentifyX, [
      'License: ',
      people.license.length ? people.license : 'n/a',
      'State: ',
      people.howIdentify === 'Verbal' ? 'n/a' : people.state,
      'How Identify: ',
      people.howIdentify
    ],
      [fontNormal, fontBold, fontNormal, fontBold, fontNormal, fontBold]
    )

    y += 4
    // Find charges by people
    const filteredCharges = data.charges.filter(charge =>
      charge.committedBy.split(' ')[0] === people.firstName 
      && charge.committedBy.split(' ')[1] === people.lastName
    )

    if (filteredCharges.length > 0) {
      addRow(peopleChargesX, [
        'Offense/Charge',
        'Law Section',
        'Counts',
        'Severity'
      ],
        Array(4).fill(fontNormal)
      )
    }

    filteredCharges.forEach(charge => {
      const [firstLine, secondLine] = textSplitter(charge.charge, maxLengthCharge)

      addRow(peopleChargesX, [
        firstLine,
        charge.law,
        charge.chargeCount,
        charge.severity
      ], 
        Array(4).fill(fontBold)
      )
      if (secondLine.length > 0) {
        addRow(peopleChargesX, [
          secondLine,
          '',
          '',
          ''
        ],
          Array(4).fill(fontBold)
        )
      }
    })
    if (index !== data.people.length - 1) {
      doc.line(leftMargin, y, leftMargin + widthPage, y)
    }
    y += 5
  })

  needNewPage(newPageCutOff, headerTexts)

  // Animals
  addSectionHeader('Animals Involved')
  data.animals.forEach((animal, index) => {
    //  Calculate Age
    let age = ''
    if (animal.animalAge) {
      age = animal.animalAge
    } else if (animal.animalDob) {
      age = calculateAge(animal.animalDob)
    }
  
    // Header Texts
    needNewPage(newPageCutOff, headerTexts, 'Animals Involved (cont)')
    doc.setFontSize(sectionHeaderFontSize)
    addRow(animalX, [
      `${animal.animalType}:  ${animal.animalName}`,
      '', '', '', '', '', ''
    ],
      Array(7).fill(fontBold)
    )
    y += 2

    // All info
    doc.setFontSize(defaultFontSize)
    addRow(animalX, [
      '',
      'Animal ID:',
      animal.animalId.length ? animal.animalId : 'n/a',
      'Chip #:',
      animal.animalChip.length ? animal.animalChip : 'n/a',
      'Dog Lic. #:',
      animal.animalLicense.length ? animal.animalLicense : 'n/a'
    ],
      [fontNormal, fontNormal, fontBold, fontNormal, fontBold, fontNormal, fontBold]
    )

    addRow(animalX, [
      '',
      'Species:',
      animal.animalSpecies.length ? animal.animalSpecies : 'n/a',
      'Color:',
      animal.animalColor.length ? animal.animalColor : 'n/a',
      'Breed:',
      animal.animalBreed.length ? animal.animalBreed : 'n/a',
    ],
      [fontNormal, fontNormal, fontBold, fontNormal, fontBold, fontNormal, fontBold]
    )

    addRow(animalX, [
      '',
      'Bite History:',
      animal.animalBite.length ? animal.animalBite : 'n/a',
      'Sex:',
      animal.animalGender.length ? animal.animalGender : 'n/a',
      'Altered:',
      animal.animalAltered.length ? animal.animalAltered : 'n/a'
    ],
      [fontNormal, fontNormal, fontBold, fontNormal, fontBold, fontNormal, fontBold]
    )

    addRow(animalX, [
      '',
      'Rabies Shot:',
      animal.animalRabies.length ? animal.animalRabies : 'n/a',
      'Age:',
      age.length ? age : 'n/a',
      'DOB:',
      animal.animalDob.length ? animal.animalDob : 'n/a'
    ],
      [fontNormal, fontNormal, fontBold, fontNormal, fontBold, fontNormal, fontBold]
    )

    y += 4

    // Find owner
    const owner = data.people.find(person =>
      animal.animalOwner.split(' ')[0] === person.firstName 
      && animal.animalOwner.split(' ')[1] === person.lastName
    )

    addRow(animalOwner, ['Owner/Gaurdian', 'Phone', 'Address'],
     Array(3).fill(fontNormal)
    )
    addRow(animalOwner, [animal.animalOwner, owner.phoneNumber, owner.addressLineOne],
      Array(3).fill(fontBold)
    )
    addRow(animalOwner, ['', '', owner.addressLineTwo],
      Array(3).fill(fontBold)
    )

    y += 1
    // Separation Line
    if (index !== data.animals.length - 1) {
      doc.line(leftMargin, y, leftMargin + widthPage, y)
    }
    y += 5
  })

  needNewPage(newPageCutOff, headerTexts)

  // Officers Involved
  addSectionHeader('Other Officers Involved')
  y += 2
  doc.setFont(...fontBold)
  data.officers.forEach(officer => {
    needNewPage(smallCutOff, headerTexts, 'Other Officers Involved (cont)')
    // Officer row
    doc.text(`Ofc. ${officer.officerName} (${officer.officerId})`, leftMargin, y)
    addCheckbox(leftMargin + .4 * widthPage, officer.resource.includes('Audio'), 'Audio')
    addCheckbox(leftMargin + .5 * widthPage, officer.resource.includes('Video'), 'Video')
    addCheckbox(leftMargin + .6 * widthPage, officer.resource.includes('Supp'), 'Suppl.')
    addCheckbox(leftMargin + .7 * widthPage, officer.resource.includes('Pics'), 'Pics')
    y += 4
  })

  return doc
}
