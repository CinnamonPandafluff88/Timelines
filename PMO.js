function fetchProjectData() {
    const projectId = document.getElementById('projectIdInput').value;
    const tenant = '@liquid'; // Replace with your tenant name

    if (projectId) {
        // Use a CORS proxy
        const corsProxy = 'https://cors-anywhere.herokuapp.com/';
        fetch(corsProxy + `${apiUrl}@${tenant}/v1.0/projects/${projectId}/tasks`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
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

            var line = document.querySelectorAll('.line');
            line[0].style.width = tab.offsetWidth + "px";
            line[0].style.left = tab.offsetLeft + "px";

            all_content.forEach(content => { content.classList.remove('active') });
            all_content[index].classList.add('active');
        });
    });

    // Email script portion for SMTP 
    document.getElementById('fs-frm').addEventListener('submit', function(event) {
        event.preventDefault();

        const emailField = document.getElementById('email');
        const messageField = document.getElementById('message');
        const email = emailField.value;
        const message = messageField.value;

        Email.send({
            SecureToken: "d0c95fa5-7a38-4c0a-a9d7-1785db02b37e",
            To: 'siphosihle.tsotsa@liquidc2.com',
            From: email,
            Subject: "Contact Form Submission",
            Body: `<p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`
        }).then(
            response => {
                alert("Email sent successfully!");
                emailField.value = '';
                messageField.value = '';
            }
        ).catch(
            error => alert("Failed to send email: " + error)
        );
    });
});
//helped by Chuma Raxothi
