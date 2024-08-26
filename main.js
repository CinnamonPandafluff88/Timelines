function fetchProjectData() {
  const projectId = document.getElementById('projectIdInput').value;
  const apiUrl = `https://muddy-bird-8519.nfr-emea-liquid-c2.workers.dev/tasks/liquid/${projectId}`;

  if (projectId) {
    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      populateTable(data); // Assuming the tasks are in the response data directly
    })
    .catch(error => console.error('Error fetching data:', error));
  } else {
    alert('Invalid project ID');
  }
}

function populateTable(data) {
  const tasksTableBody = document.getElementById('tasksTable').getElementsByTagName('tbody')[0];
  tasksTableBody.innerHTML = ''; // Clear existing rows

  data.forEach(task => {
    const row = tasksTableBody.insertRow();
    row.insertCell(0).textContent = task.title;
    row.insertCell(1).textContent = task.assignedTo;
    row.insertCell(2).textContent = task.startDate;
    row.insertCell(3).textContent = task.dueDate;
    row.insertCell(4).textContent = task.progress;
    row.insertCell(5).textContent = task.group;
  });
}

async function loadCSVForRisksAndIssues() {
  const fileInput = document.getElementById('csvFileInputRisks');
  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = function(event) {
    const csvData = event.target.result;
    const data = parseCSV(csvData);
    populateRisksTable(data);
  };

  reader.readAsText(file);
}

function parseCSV(csvData) {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');
  const data = lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index];
      return obj;
    }, {});
  });
  return data;
}

function populateRisksTable(data) {
  const risksTableBody = document.getElementById('risksTable').getElementsByTagName('tbody')[0];
  risksTableBody.innerHTML = ''; // Clear existing rows

  data.forEach(risk => {
    const row = risksTableBody.insertRow();
    row.insertCell(0).textContent = risk['Task Name'];
    row.insertCell(1).textContent = risk.Status;
    row.insertCell(2).textContent = risk['Start date'];
    row.insertCell(3).textContent = risk['Tentative end date'];
    row.insertCell(4).textContent = risk['Assigned to'];
    row.insertCell(5).textContent = risk.Progress;
    row.insertCell(6).textContent = risk.Description;
  });
}

function saveEditsForRisksAndIssues() {
  // Implement save functionality here
}
