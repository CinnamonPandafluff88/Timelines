function fetchProjectData() {
    const projectId = document.getElementById('projectIdInput').value;
    const tenant = 'liquid'; // Replace with your tenant name

    if (projectId) {
        fetch(`https://muddy-bird-8519.nfr-emea-liquid-c2.workers.dev/tasks/${tenant}/${projectId}`, {
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
            console.log('Fetched data:', data.data.data); // Log the data to inspect its structure
            populateTable(data.data); // Access the 'data' property
        })
        .catch(error => console.error('Error fetching data:', error));
    } else {
        alert('Invalid project ID');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fetchButton').addEventListener('click', fetchProjectData);

    // Tab functionality
    const tabs = document.querySelectorAll('.tab_btn');
    const all_content = document.querySelectorAll('.content');
    const line = document.querySelector('.line');

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            tabs.forEach(tab => { tab.classList.remove('active') });
            tab.classList.add('active');

            line.style.width = tab.offsetWidth + "px";
            line.style.left = tab.offsetLeft + "px";

            all_content.forEach(content => { content.classList.remove('active') });
            all_content[index].classList.add('active');
        });
    });

    // Initialize the line position
    const activeTab = document.querySelector('.tab_btn.active');
    if (activeTab) {
        line.style.width = activeTab.offsetWidth + "px";
        line.style.left = activeTab.offsetLeft + "px";
    }
});

// Function to populate the tasks table 
function populateTable(tasks) {
    const tableBody = document.querySelector('#tasksTable tbody');
    tableBody.innerHTML = ''; // Clear existing table data

    if (!Array.isArray(tasks)) {
        console.error('Expected an array but got:', tasks);
        return;
    }

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
