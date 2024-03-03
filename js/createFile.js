const createPdf = async (data) => {
  const { PDFDocument, StandardFonts, rgb } = PDFLib

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  // Set up fonts and sizes
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;

  // Function to add text to the page
  const addText = (text, x, y) => {
      page.drawText(text, {
          x: x,
          y: y,
          size: fontSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
      });
  }

  // Function to add a section title
  const addSectionTitle = (title, x, y) => {
      page.drawText(title, {
          x: x,
          y: y,
          size: fontSize + 2,
          font: helveticaFont,
          color: rgb(0, 0, 1),
      });
  }

  // Function to add a section
  const addSection = (section, x, y) => {
      addSectionTitle(section.title, x, y);
      let currentY = y - fontSize - 5;
      section.items.forEach(item => {
          currentY -= fontSize + 5;
          addText(`${item.name}: ${item.value}`, x, currentY);
      });
  }

  // Define the sections
  const sections = [
      {
          title: 'Charges',
          items: data.charges.map(charge => ({
              name: charge.charge,
              value: `${charge.law} - ${charge.severity} - Committed by: ${charge.committedBy}`
          }))
      },
      {
          title: 'People',
          items: data.people.map(person => ({
              name: person.peopleType,
              value: `${person.firstName} ${person.middleName ? person.middleName + ' ' : ''}${person.lastName}`
          }))
      },
      {
          title: 'Officers',
          items: data.officers.map(officer => ({
              name: 'Officer',
              value: `${officer.officerName} - ID: ${officer.officerId}`
          }))
      },
      {
          title: 'Case Information',
          items: [
              { name: 'Officer Reporting', value: data.officerReporting },
              { name: 'IHS Case', value: data.ihsCase },
              { name: 'Occurred From', value: data.occurredFrom },
              { name: 'Occurred To', value: data.occurredTo },
              { name: 'Date/Time Reported', value: data.datetimeReported },
              { name: 'Location', value: data.location },
              { name: 'Jurisdiction', value: data.jurisdiction },
              { name: 'Probable Cause', value: data.probableCause }
          ]
      }
  ];

  // Add sections to the page
  let currentY = page.getHeight() - 50;
  sections.forEach(section => {
      currentY -= fontSize + 10;
      addSection(section, 50, currentY);
  });

  // Save the PDF to a file
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
