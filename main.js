document.addEventListener('DOMContentLoaded', function() {
    function fetchProjectData() {
        const projectId = document.getElementById('projectIdInput').value;
        const tenant = 'liquid'; // Replace with your tenant name

        if (projectId) {
            fetch(`https:https://muddy-bird-8519.nfr-emea-liquid-c2.workers.dev/tasks/${tenant}/${projectId}`, {
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
                populateTable(data); 
            })
            .catch(error => console.error('Error fetching data:', error));
        } else {
            alert('Invalid project ID');
        }
    }

    document.getElementById('fetchButton').addEventListener('click', fetchProjectData);
});

// Function to populate the tasks table 
function populateTable(tasks) {
    const tableBody = document.querySelector('#tasksTable tbody');
    tableBody.innerHTML = ''; // Clear existing table data

    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.Title}</td> 
            <td>${task.Status}</td> 
            <td>${task.StartDate}</td> 
            <td>${task.DueDate}</td> 
            <td>${task.AssignedTo || 'Unassigned'}</td> 
            <td>${task.Progress}</td> 
            <td>${task.Description || 'No Description'}</td> 
        `;
        tableBody.appendChild(row);
    });
}

// Function to load CSV data for Risks and Issues
function loadCSVForRisksAndIssues() {
    const input = document.getElementById('csvFileInputRisks');
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const text = e.target.result;
        const rows = text.split('\n');
        const table = document.getElementById('risksTable').getElementsByTagName('tbody')[0];
        table.innerHTML = ''; // Clear existing rows

        rows.forEach((row, index) => {
            if (index === 0 || row.trim() === '') return; // Skip header row and empty rows
            const cols = row.split(',');
            const newRow = table.insertRow();
            cols.forEach(col => {
                const cell = newRow.insertCell();
                cell.textContent = col.trim();
                cell.setAttribute('contenteditable', 'true'); // Make cell editable
            });
        });
    };

    reader.readAsText(file);
}

// Function to save edited CSV data for Risks and Issues
function saveEditsForRisksAndIssues() {
    const table = document.getElementById('risksTable');
    let csvContent = '';
    for (let row of table.rows) {
        let rowData = [];
        for (let cell of row.cells) {
            rowData.push(cell.textContent);
        }
        csvContent += rowData.join(',') + '\n';
    }
    console.log(csvContent); // Handle the CSV content as needed
}

// Attach the loadCSVForRisksAndIssues and saveEditsForRisksAndIssues functions to the global scope
window.loadCSVForRisksAndIssues = loadCSVForRisksAndIssues;
window.saveEditsForRisksAndIssues = saveEditsForRisksAndIssues;

// Tab functionality
const tabs = document.querySelectorAll('.tab_btn');
const all_content = document.querySelectorAll('.content');

tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        tabs.forEach(tab => { tab.classList.remove('active') });
        tab.classList.add('active');

        let line  = document.querySelectorAll('.line');
        line[0].style.width = tab.offsetWidth + "px";
        line[0].style.left = tab.offsetLeft + "px";

        all_content.forEach(content => { content.classList.remove('active') });
        all_content[index].classList.add('active');
    });
});

// Attach the fetchProjectData function to a button click
const fetchButton = document.getElementById('fetchButton'); 
fetchButton.addEventListener('click', fetchProjectData); 
