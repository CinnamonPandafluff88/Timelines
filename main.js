// Function to fetch tasks
function fetchProjectTasks(projectId, tenant) {
    return fetch(`https://muddy-bird-8519.nfr-emea-liquid-c2.workers.dev/${tenant}/${projectId}/tasks`, {
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
        console.log('Fetched tasks:', data.data); 
        populateTasksTable(data.data);
    })
    .catch(error => console.error('Error fetching tasks:', error));
}

// Function to fetch all data
function fetchAllProjectData() {
    const projectUrl = document.getElementById('projectIdInput').value;
    const tenant = 'liquid'; // Replace with your tenant name

    // Extract the project ID from the URL
    const projectId = projectUrl.split('/').pop().split('?')[0];

    if (projectId) {
        Promise.all([
            fetchProjectTasks(projectId, tenant),
        ])
        .then(() => {
            console.log('Fetched all project data successfully');
        })
        .catch(error => console.error('Error fetching project data:', error));
    } else {
        alert('Invalid project URL');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Attach the event listener after the DOM is fully loaded
    document.getElementById('fetchButton').addEventListener('click', fetchAllProjectData);

    // Function to populate the tasks table 
    function populateTasksTable(tasks) {
        const tableBody = document.querySelector('#tasksTable tbody');
        tableBody.innerHTML = ''; // Clear existing table data

        if (!Array.isArray(tasks)) {
            console.error('Expected an array but got:', tasks);
            return;
        }

        tasks.forEach(task => {
            const row = document.createElement('tr');

            // Access attributes safely using conditionals
            const groupName = task.attributes.Group?.name ?? 'N/A';
            const startDate = new Date(task.attributes.StartDate);
            const dueDate = new Date(task.attributes.DueDate);

            row.innerHTML = `
                <td>${task.attributes.Name}</td> 
                <td>${task.attributes.AssignedTo ? task.attributes.AssignedTo.map(a => a.fullName).join(', ') : 'Unassigned'}</td> 
                <td>${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}</td> 
                <td>${dueDate.getMonth() + 1}/${dueDate.getDate()}/${dueDate.getFullYear()}</td> 
                <td>${task.attributes.Progress}</td> 
                <td>${groupName}</td> 
            `;

            tableBody.appendChild(row);
        });
    }
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