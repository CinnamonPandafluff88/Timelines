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

// Function to load CSV data for Risks
function loadCSVForRisks() {
  const input = document.getElementById("csvFileInputRisks");
  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
      const text = e.target.result;
      const rows = text.split("\n");
      console.log("CSV Rows:", rows); // Debugging line
      const table = document.getElementById("risksTable").getElementsByTagName("tbody")[0];
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

// Function to load CSV data for Issues
function loadCSVForIssues() {
  const input = document.getElementById("csvFileInputIssues");
  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
      const text = e.target.result;
      const rows = text.split("\n");
      console.log("CSV Rows:", rows); // Debugging line
      const table = document.getElementById("issuesTable").getElementsByTagName("tbody")[0];
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
  document.getElementById("fetchButton").addEventListener("click", function () {
      // TO DO: Implement the fetch functionality
  });

  // Tab functionality
  const tabs = document.querySelectorAll(".tab_btn");
  const all_content = document.querySelectorAll(".content");
  const line = document.querySelector(".line");

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
      });
  });

  // Initialize the line position
  const activeTab = document.querySelector(".tab_btn.active");
  if (activeTab) {
      line.style.width = activeTab.offsetWidth + "px";
      line.style.left = activeTab.offsetLeft + "px";
  }
});