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
  peopleDesc1Ans: leftMargin + .45 * widthPage,
  peopleDesc2: leftMargin + .52 * widthPage,
  peopleDesc2Ans: leftMargin + .56 * widthPage,
  peopleDesc3: leftMargin + .6 * widthPage,
  peopleDesc3Ans: leftMargin + .65 * widthPage,
  peopleDesc4: leftMargin + .8 * widthPage,
  peopleDesc4Ans: leftMargin + .85 * widthPage
}

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
  doc.setFontSize(20)
  addText(headerText, alignCenter(headerText))

  // Sub Header
  doc.setFontSize(16)
  addText(subHeaderText, alignCenter(subHeaderText))

  doc.setFont(...fontNormal)
  doc.setFontSize(12)

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
  addRow('people', [
    people.peopleType,
    `${people.lastName}, ${people.firstName}${people.middleName ? ' ' + people.middleName : ''}`,
    'Race:',
    people.race,
    'Sex: ',
    people.sex,
    'DOB: ',
    people.dob,
    'Age: ',
    calculateAge(people.dob)
  ],
    Array(10).fill(fontBold)
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

  doc.setFontSize(12)
  doc.setFont('times', 'bolditalic')
  doc.text(text, leftMargin + 2, y + rectHeight / 2, { align: 'left', baseline: 'middle' })
  doc.setFontSize(10)
  doc.setFont('times', 'normal')
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
  doc.setFont('times', 'normal')
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
