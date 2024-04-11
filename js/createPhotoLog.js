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

const createPhotoLog = async (data) => {
  y = topMargin

  // Set Header Texts
  const headerTexts = {
    headerText: 'Idaho Humane Society - Animal Control',
    subHeaderText: 'General Photo Log',
    officerReportingText: `Officer Reporting: ${data.officerReporting}`,
    ihsCaseText: `IHS Case #: ${data.ihsCase}`,
    omnigoNumber: `Omnigo #: ${data.omnigoNumber}`,
    drNumber: `DR #: ${data.drNumber}`
  }
  
  addHeader(headerTexts)
  y += 2

  doc.setFontSize(defaultFontSize)
  addRow({hi: leftMargin}, [`Incident Date: ${cleanDate(data.datetimeOccured)}`], [fontNormal])

  addRowWithRectangle()

  // const image = new Image()
  // image.src = data.imageSrc[0]
  // doc.addImage(image, 'JPEG', leftMargin, y, 15, 15)

  return doc
}