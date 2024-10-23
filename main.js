// Function to fetch project tasks
function fetchProjectTasks(projectId, tenant) {
  return fetch(
    `https://muddy-bird-8519.nfr-emea-liquid-c2.workers.dev/tasks/${tenant}/${projectId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Fetched tasks:", data.data);
      return data;
    })
    .catch((error) => console.error("Error fetching tasks:", error));
}

// Function to populate the tasks table (modified)
function populateTasksTable(tasks) {
  const tableBody = document.querySelector("#tasksTable tbody");
  tableBody.innerHTML = ""; // Clear existing table data

  if (!Array.isArray(tasks)) {
    console.error("Expected an array but got:", tasks);
    return;
  }

  tasks.forEach((task) => {
    const row = document.createElement("tr");
    const groupName = task.attributes.Group?.name ?? "N/A"; 
    const startDate = new Date(task.attributes.StartDate);
    const dueDate = new Date(task.attributes.DueDate);

    // Store the task ID in the row's dataset
    row.dataset.taskId = task.id; // Use the fetched task ID

    // Use input fields for editable table data
    row.innerHTML = `
      <td>${task.attributes.Name}</td> 
      <td>${
        task.attributes.AssignedTo
          ? task.attributes.AssignedTo.map((a) => a.fullName).join(", ")
          : "Unassigned"
      }</td>
      <td>
        <input
          type="date"
          value="${startDate.toISOString().slice(0, 10)}"
          data-task-id="${task.id}"
          class="task-start-date"
        />
      </td>
      <td>
        <input
          type="date"
          value="${dueDate.toISOString().slice(0, 10)}"
          data-task-id="${task.id}"
          class="task-due-date"
        />
      </td>
      <td>
        <input
          type="text"
          value="${task.attributes.Progress}"
          data-task-id="${task.id}"
          class="task-progress"
        />
      </td>
      <td>${groupName}</td> 
    `;

    tableBody.appendChild(row);
  });
}

// Function to fetch project details (including program name)
function fetchProjectDetails(projectId, tenant) {
  return fetch(
    `https://muddy-bird-8519.nfr-emea-liquid-c2.workers.dev/projects/${tenant}/${projectId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Fetched project details:", data.data);
      const clientName = data.data.attributes.ClientName;
      const programName = data.data.attributes.Program[0].name;
      updateProgramName(`${clientName} - ${programName}`); // Concatenate and update program name
      return data; // Return the project data
    })
    .catch((error) => console.error("Error fetching project details:", error));
}

// Function to fetch all data
function fetchAllProjectData() {
  const projectUrl = document.getElementById("projectIdInput").value;
  const tenant = "liquid"; // Replace with your tenant name

  // Extract the project ID from the URL
  const projectId = projectUrl.split("/").pop().split("?")[0];

  if (projectId) {
    // Fetch project details first
    fetchProjectDetails(projectId, tenant)
      .then((projectData) => {
        // Then fetch tasks
        return fetchProjectTasks(projectId, tenant);
      })
      .then((tasksData) => {
        // Populate tasks table
        populateTasksTable(tasksData.data);
        console.log("Fetched all project data successfully");
      })
      .catch((error) => console.error("Error fetching project data:", error));
  } else {
    alert("Invalid project URL");
  }
}

// Function to update the program name in all h1 tags
function updateProgramName(fullName) {
  const h1Elements = document.querySelectorAll("h1");
  h1Elements.forEach((h1) => {
    h1.textContent = `${fullName} Project`;
  });
}

// Function to gather updated data and send PATCH requests
function updateAllTasks() {
  const tenant = "liquid"; // Replace with your tenant name
  const tableRows = document.querySelectorAll("#tasksTable tbody tr");

  tableRows.forEach((row) => {
    const taskId = row.dataset.taskId; // Get the taskId from the row
    const taskStartDateInput = row.querySelector(".task-start-date");
    const taskDueDateInput = row.querySelector(".task-due-date");
    const taskProgressInput = row.querySelector(".task-progress");

    const updateData = {
      startDate: taskStartDateInput
        ? taskStartDateInput.value
        : task.attributes.StartDate,
      dueDate: taskDueDateInput ? taskDueDateInput.value : task.attributes.DueDate,
      progress: taskProgressInput ? taskProgressInput.value : task.attributes.Progress,
    };

    updateTask(taskId, updateData, tenant);
  });
}

// Function to update a task
function updateTask(taskId, updateData, tenant) {
  return fetch(
    `https://muddy-bird-8519.nfr-emea-liquid-c2.workers.dev/tasks/${tenant}/${taskId}`, // Use your worker as a proxy
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(`Task ${taskId} updated successfully:`, data);
    })
    .catch((error) => console.error(`Error updating task ${taskId}:`, error));
}

// Function to load CSV data for Risks
function loadCSVForRisks() {
  const input = document.getElementById("csvFileInputRisks");
  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const text = e.target.result;
    const rows = text.split("\n");
    console.log("CSV Rows:", rows); // Debugging line
    const table = document.getElementById("risksTable").getElementsByTagName(
      "tbody"
    )[0];
    table.innerHTML = ""; // Clear existing rows

    rows.forEach((row, index) => {
      if (index === 0 || row.trim() === "") return; // Skip header row and empty rows
      const cols = row.split(",");
      const newRow = table.insertRow();
      cols.forEach((col) => {
        const cell = newRow.insertCell();
        cell.textContent = col.trim();
        cell.setAttribute("contenteditable", "true"); // Make cell editable
      });
    });
  };

  reader.readAsText(file);
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Attach the event listener after the DOM is fully loaded
  document
    .getElementById("fetchButton")
    .addEventListener("click", fetchAllProjectData);

  // Event listener for the update task button
  document
    .getElementById("updateTasksButton")
    .addEventListener("click", updateAllTasks);

  // Tab functionality
  const tabs = document.querySelectorAll(".tab_btn");
  const all_content = document.querySelectorAll(".content");
  const line = document.querySelector(".line");
  const addTaskButton = document.getElementById("addTaskButton");
  const updateTasksButton = document.getElementById("updateTasksButton");

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      tabs.forEach((tab) => {
        tab.classList.remove("active");
      });
      tab.classList.add("active");

      line.style.width = tab.offsetWidth + "px";
      line.style.left = tab.offsetLeft + "px";

      all_content.forEach((content) => {
        content.classList.remove("active");
      });
      all_content[index].classList.add("active");

      // Show or hide buttons based on active tab
      if (index === 1) {
        // Index 1 is the "Timelines" tab
        addTaskButton.style.display = "block";
        updateTasksButton.style.display = "block";
      } else {
        addTaskButton.style.display = "none";
        updateTasksButton.style.display = "none";
      }
    });
  });

  // Initialize the line position
  const activeTab = document.querySelector(".tab_btn.active");
  if (activeTab) {
    line.style.width = activeTab.offsetWidth + "px";
    line.style.left = activeTab.offsetLeft + "px";
  }
});
// Function to load CSV data for Issues
function loadCSVForIssues() {
  const input = document.getElementById('csvFileInputIssues');
  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
      const text = e.target.result;
      const rows = text.split('\n');
      console.log('CSV Rows:', rows); // Debugging line
      const table = document.getElementById('issuesTable').getElementsByTagName('tbody')[0];
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

