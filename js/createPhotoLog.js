// Globals
let doc = new jsPDF()
let y

// Margins
const leftMargin = 10
const rightMargin = 10
const topMargin = 20

// Width of writable area
const widthPage = doc.internal.pageSize.width - leftMargin - rightMargin

const datesX = {
  descX: leftMargin,
  dateX: leftMargin + .17 * widthPage
}

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

  photoDates(data)

  y += 2

  addPhotoLogRow({
    count: 'Ctr',
    comment: 'Title / Comment',
  })

  data.imageSrc.forEach((image, index) => {
    needNewPagePhotos(newPageCutOff, headerTexts, data)
    addPhotoLogRow({
      count: `${index + 1}`,
      comment: data.comments[index],
      image
    })
  })

  return doc
}
