// Globals
let doc = new jsPDF()
let y

// Margins
const leftMargin = 10
const rightMargin = 10
const topMargin = 20

// Width of writable area
const widthPage = doc.internal.pageSize.width - leftMargin - rightMargin

// Incident Table
const incidentX = {
  incidentOccuredX: leftMargin,
  incidentReportedX: leftMargin + .25 * widthPage,
  incidentLocationX: leftMargin + .5 * widthPage,
  incidentJurisdictionX: leftMargin + .75 * widthPage,
}

// Charges Table
const chargeX = {
  chargeCountX: leftMargin,
  chargeDescX: leftMargin + .1 * widthPage,
  chargeLawSectionX: leftMargin + .5 * widthPage,
  chargeSeverityX: leftMargin + .75 * widthPage
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
  peopleThirdX: leftMargin + .60 * widthPage,
  peopleFourthX: leftMargin + .66 * widthPage
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
  peopleChargesSecondX: leftMargin + .4 * widthPage,
  peopleChargesThirdX: leftMargin + .65 * widthPage,
  peopleChargesFourthX: leftMargin + .75 * widthPage
}

const defaultFontSize = 10
const titleFontSize = 20
const subTitleFontSize = 16
const sectionHeaderFontSize = 12

const fontNormal = ['times', 'normal']
const fontBold = ['times', 'bold']
const fontItalizedBold = ['times', 'bolditalic']

const createPdf = async (data) => {
  doc = new jsPDF()
  y = topMargin

  // Set Texts
  const headerText = 'Idaho Humane Society - Animal Control'
  const subHeaderText = 'General Report'
  const officerReportingText = `Officer Reporting: ${data.officerReporting}`
  const ihsCaseText = `IHS Case #: ${data.ihsCase}`

  // Header
  doc.setFont(...fontBold)
  doc.setFontSize(titleFontSize)
  addText(headerText, alignCenter(headerText))

  // Sub Header
  doc.setFontSize(subTitleFontSize)
  addText(subHeaderText, alignCenter(subHeaderText))

  doc.setFont(...fontNormal)
  doc.setFontSize(sectionHeaderFontSize)

  // Officer Reporting
  addHeaderRectangle(officerReportingText, officerReportingText)

  // IHS Case Number
  addHeaderRectangle(officerReportingText, ihsCaseText)
  y += 1

  // Incident
  addSectionHeader('Incident')
  addRow('incident',
    ['Date & Time Occured', 'Date & Time Reported', 'Location of Occurence', 'Jurisdiction'],
    Array(4).fill(fontNormal)
  )

  addRow('incident', [
    `${cleanDate(data.occurredFrom)} to`,
    cleanDate(data.datetimeReported),
    data.locationLineOne,
    data.jurisdiction
  ],
    Array(4).fill(fontBold)
  )
  addRow('incident', 
    [cleanDate(data.occurredTo), '', data.locationLineTwo, ''],
    Array(4).fill(fontBold)
  )

  // Charges
  addSectionHeader('Charges')
  addRow('charge',
    ['Chg#', 'Offense/Charge', 'Law Section', 'Severity'],
    Array(4).fill(fontNormal)
  )

  data.charges.forEach((charge, i) => {
    addRow('charge',
      [(i + 1).toString(), charge.charge, charge.law, charge.severity],
      Array(4).fill(fontBold)
    )
  })

  // Probable Cause
  addSectionHeader('Probable Cause')
  wrapText(data.probableCause)

  // People Involved
  addSectionHeader('People Involved')
  const people = data.people[0]

  doc.setFontSize(sectionHeaderFontSize)
  addRow('charge', [
    people.peopleType + ':',
    `${people.lastName}, ${people.firstName}${people.middleName ? ' ' + people.middleName : ''}`,
    '',
    ''
  ],
    [fontItalizedBold, fontBold, fontNormal, fontNormal]
  )

  doc.setFontSize(defaultFontSize)
  y += 4

  addRow('people', [
    'Address: ',
    people.addressLineOne,
    'Race:',
    people.race,
    'Sex: ',
    people.sex,
    'DOB: ',
    people.dob,
    'Age: ',
    calculateAge(people.dob)
  ],
    [fontNormal, fontBold, fontNormal, fontBold, fontNormal, fontBold, fontNormal, fontBold, fontNormal, fontBold]
  )
  addRow('people', [
    '',
    people.addressLineTwo,
    'H: ',
    people.height,
    'W: ',
    people.weight,
    'Hair: ',
    people.hair,
    'Eye: ',
    people.eye
  ], 
    [fontNormal, fontBold, fontNormal, fontBold, fontNormal, fontBold, fontNormal, fontBold, fontNormal, fontBold]
  )

  y += 4
  addRow('peopleContact', [
    'Phone: ',
    people.phoneNumber,
    'Email: ',
    people.email
  ],
    [fontNormal, fontBold, fontNormal, fontBold]
  )
  addRow('peopleIdentify', [
    'License: ',
    people.license,
    'State: ',
    people.state,
    'How Identify: ',
    people.howIdentify
  ],
    [fontNormal, fontBold, fontNormal, fontBold, fontNormal, fontBold]
  )

  y += 4
  addRow('peopleCharges', [
    'Offense/Charge',
    'Law Section',
    'Counts',
    'Severity'
  ],
    Array(4).fill(fontNormal)
  )
  addRow('peopleCharges', [
    data.charges[0].charge,
    data.charges[0].law,
    '1',
    data.charges[0].severity
  ], 
    Array(4).fill(fontBold)
  )

  return doc
}

// Gives x-coordinate to align text center
const alignCenter = (text) => {
  const textWidth = doc.getTextDimensions(text).w
  return (doc.internal.pageSize.width - textWidth) / 2
}

// Gives x-coordinate to align text right
const alignRight = (text) => {
  const textWidth = doc.getTextDimensions(text).w
  return rightX = doc.internal.pageSize.width - rightMargin - textWidth
}

// Height spacing for rectangles
const rectH = (textHeight) => {
  return textHeight + 2
}

// Width spacing for rectangles
const rectW = (textWidth) => {
  return textWidth + 4
}

// Add Text
const addText = (text, x) => {
  doc.text(text, x, y)
  y += doc.getTextDimensions(text).h
}

// Add rectangle
const addHeaderRectangle = (sizing, text) => {
  const rectWidth = rectW(doc.getTextDimensions(sizing).w)
  const rectHeight = rectH(doc.getTextDimensions(sizing).h)

  doc.rect(doc.internal.pageSize.width - rightMargin - rectWidth, y, rectWidth, rectHeight)
  doc.text(text, alignRight(sizing + ' '), y + rectHeight / 2, { align: 'left', baseline: 'middle' })
  y += 6
}

// Create Section Headers
const addSectionHeader = (text) => {
  const textHeight = doc.getTextDimensions(text).h
  const rectWidth = doc.internal.pageSize.width - leftMargin - rightMargin
  const rectHeight = rectH(textHeight)

  doc.rect(leftMargin, y, rectWidth, rectHeight)

  const splitX = leftMargin + 0.3 * rectWidth
  doc.line(splitX, y, splitX, y + rectHeight)

  doc.setFontSize(sectionHeaderFontSize)
  doc.setFont(...fontItalizedBold)
  doc.text(text, leftMargin + 2, y + rectHeight / 2, { align: 'left', baseline: 'middle' })
  doc.setFontSize(defaultFontSize)
  doc.setFont(...fontNormal)
  y += 10
}

// Add Row
const addRow = (rowType, texts, fonts) => {
  let divider
  switch (rowType) {
    case 'incident':
      divider = incidentX
      break
    case 'charge':
      divider = chargeX
      break
    case 'people':
      divider = peopleHeaderX
      break
    case 'peopleContact':
      divider = peopleContactInfoX
      break
    case 'peopleIdentify':
      divider = peopleIdentifyX
      break
    case 'peopleCharges':
      divider = peopleChargesX
      break
    default:
      console.error(`${rowType} is not a valid way to call addRow`)
      return
  }

  const dividers = Object.keys(divider)
  if (dividers.length !== texts.length || dividers.length !== fonts.length) {
    console.error('Something went wrong...')
    return
  }

  for(let i = 0; i < dividers.length; i++) {
    doc.setFont(...fonts[i])
    doc.text(texts[i], divider[dividers[i]], y)
  }
  doc.setFont(...fontNormal)
  y += 4
}

// Wrap Text
const wrapText = (text) => {
  const lineHeight = doc.getTextDimensions(text).h
  const words = text.split(' ');
  let line = '';
  let yPosition = y;

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const width = doc.getTextDimensions(line + word).w

    if (width < widthPage) {
      line += (line === '' ? '' : ' ') + word;
    } else {
      doc.text(line, leftMargin, yPosition);
      yPosition += lineHeight;
      line = word;
    }
  }
  doc.text(line, leftMargin, yPosition)
  y = yPosition + 4
}
