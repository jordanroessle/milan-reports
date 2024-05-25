const downloadNarrativeReport = async () => {
  // Grab all data
  const data = {
    officerReporting: document.getElementById("officerReporting").value,
    ihsCase: document.getElementById("ihsCase").value,
    omnigoNumber: document.getElementById("omnigoNumber").value,
    drNumber: document.getElementById("drNumber").value,
    datetimeOccured: document.getElementById("datetimeOccured").value,
    initialContact: document.getElementById("initialContact").value,
    suspectInterview: document.getElementById("suspectInterview").value,
    victimInterview: document.getElementById("victimInterview").value,
    witnessInterview: document.getElementById("witnessInterview").value,
    injuries: document.getElementById("injuries").value,
    conclusion: document.getElementById("conclusion").value,
  }

  const pdf = await createNarrativeReport(data)
  pdf.save(`narrative-report-${data.ihsCase}.pdf`)
}