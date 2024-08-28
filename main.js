// Declare fetchProjectData outside the event listener
function fetchProjectData() {
    const projectUrl = document.getElementById('projectIdInput').value;
    const tenant = 'liquid'; // Replace with your tenant name

    // Extract the project ID from the URL
    const projectId = projectUrl.split('/').pop().split('?')[0];

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
            console.log('Fetched data:', data.data); 
            populateTable(data.data);
        })
        .catch(error => console.error('Error fetching data:', error));
    } else {
        alert('Invalid project URL');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Attach the event listener after the DOM is fully loaded
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

        // Access attributes safely using conditionals
        const groupName = task.attributes.Group && task.attributes.Group.name ? task.attributes.Group.name : 'N/A';
// ... in populateTable() function
const startDate = new Date(task.attributes.StartDate);
const dueDate = new Date(task.attributes.DueDate);

row.innerHTML = `
    <td>${task.attributes.Name}</td> 
    <td>${task.attributes.AssignedTo ? task.attributes.AssignedTo.map(a => a.fullName).join(', ') : 'Unassigned'}</td> 
    <td>${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}</td> // MM/DD/YYYY format
    <td>${dueDate.getMonth() + 1}/${dueDate.getDate()}/${dueDate.getFullYear()}</td> // MM/DD/YYYY format
    <td>${task.attributes.Progress}</td> 
    <td>${groupName}</td> 
`;
// ...
        tableBody.appendChild(row);
    });
}
