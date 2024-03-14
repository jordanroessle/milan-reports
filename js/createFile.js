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
const peopleX = {
  
}

const createPdf = async (data) => {
  doc = new jsPDF()
  y = topMargin

  // Set Texts
  const headerText = 'Idaho Humane Society - Animal Control'
  const subHeaderText = 'General Report'
  const officerReportingText = `Officer Reporting: ${data.officerReporting}`
  const ihsCaseText = `IHS Case #: ${data.ihsCase}`

  // Header
  doc.setFont('times', 'bold')
  doc.setFontSize(20)
  addText(headerText, alignCenter(headerText))

  // Sub Header
  doc.setFontSize(16)
  addText(subHeaderText, alignCenter(subHeaderText))

  doc.setFont('times', 'normal')
  doc.setFontSize(12)

  // Officer Reporting
  addHeaderRectangle(officerReportingText, officerReportingText)

  // IHS Case Number
  addHeaderRectangle(officerReportingText, ihsCaseText)
  y += 1

  // Incident
  addSectionHeader('Incident')
  addRow('incident', ['Date & Time Occured', 'Date & Time Reported', 'Location of Occurence', 'Jurisdiction'])
  doc.setFont('times', 'bold')
  addRow('incident', [
    `${cleanDate(data.occurredFrom)} to`,
    cleanDate(data.datetimeReported),
    data.locationLineOne,
    data.jurisdiction
  ])
  addRow('incident', [cleanDate(data.occurredTo), '', data.locationLineTwo, ''])

  // Charges
  addSectionHeader('Charges')
  addRow('charge', ['Chg#', 'Offense/Charge', 'Law Section', 'Severity'])
  doc.setFont('times', 'bold')
  data.charges.forEach((charge, i) => {
    addRow('charge', [(i + 1).toString(), charge.charge, charge.law, charge.severity])
  })

  // Probable Cause
  addSectionHeader('Probable Cause')
  wrapText(data.probableCause)

  // People Involved
  addSectionHeader('People Involved')

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
const addRow = (rowType, texts) => {
  let divider

  switch (rowType) {
    case 'incident':
      divider = incidentX
      break
    case 'charge':
      divider = chargeX
      break
    default:
      console.error(`${rowType} is not a valid way to call addMe`)
      return
  }

  const dividers = Object.keys(divider)
  if (dividers.length !== texts.length) {
    console.error('Something went wrong...')
    return
  }

  for(let i = 0; i < dividers.length; i++) {
    doc.text(texts[i], divider[dividers[i]], y)
  }
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
