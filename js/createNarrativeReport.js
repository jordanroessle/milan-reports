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
const yCutOff = 190
const fontHeight = 10

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
      const pages = pageSplitter(data[section.key], y);

      for (const [index, page] of pages.entries()) {
        addSectionHeader(section.header)
        wrapText(page, leftMargin, leftMargin + widthPage, true)
        if (index !== pages.length - 1) {
          doc.addPage()
          y = topMargin
        }
      }
    }
  }

  return doc
}

const pageSplitter = (text, y, pageWidth = widthPage, pageHeight = yCutOff, lineHeight = doc.getTextDimensions(text).h) => {
  const words = text.split(' ')
  let page = ''
  let pages = []

  for(const word of words) {
    if (canTextFit(page + word + ' ', y, pageWidth, pageHeight, lineHeight)) {
      page += word + ' '
    } else {
      pages.push(page)
      page = word + ' '
    }
  }
  pages.push(page.trim())
  return pages
}

const canTextFit = (text, y, pageWidth, pageHeight, lineHeight) => {
  const textWidth = doc.getTextDimensions(text).w;
  const lines = Math.ceil(textWidth / pageWidth);
  const bottomY = y + (lines * lineHeight);
  return bottomY <= pageHeight;
}
