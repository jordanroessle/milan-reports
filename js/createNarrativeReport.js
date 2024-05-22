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
const newPageCutOff = 275

const createNarrativeReport = async (data) => {
  doc = new jsPDF()
  y = topMargin

  // Set Header Texts
  const headerTexts = {
    headerText: 'Idaho Humane Society - Animal Control',
    subHeaderText: 'Narrative Report',
    boxes: [
      `Officer Reporting: ${data.officerReporting}`,
      `IHS Case #: ${data.ihsCase}`,
      `Omnigo #: ${data.omnigoNumber}`,
      `DR #: ${data.drNumber}`
      ]
    }
  
  addHeader(headerTexts)

  const dataKeys = [
    {
      key: 'initialContact',
      header: 'Initial Response/Contact'
    },
    {
      key: 'suspectInterview',
      header: 'Suspect Interview'
    },
    {
      key: 'victimInterview',
      header: 'Victim Interview'
    },
    {
      key: 'witnessInterview',
      header: 'Witness Interview'
    },
    {
      key: 'injuries',
      header: 'Injuries'
    },
    {
      key: 'conclusion',
      header: 'Conclusion'
    }
  ]

  for(const section of dataKeys) {
    if (data[section.key] && data[section.key] !== '') {
      // Check if wrap fits on page
      const currentY = y
      y = wrapText(data[section.key], leftMargin, leftMargin + widthPage, false)
      if(!needNewPage(newPageCutOff, headerTexts)) {
        y = currentY
      }

      // Add Text
      addSectionHeader(section.header)
      y = wrapText(data[section.key], leftMargin, leftMargin + widthPage, true)

      y+= 5
    }
  }

  return doc
}