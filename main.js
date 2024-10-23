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

// Function to populate the tasks table
function populateTasksTable(tasksData) {
  const tasksTableBody = document.getElementById("tasksTable").getElementsByTagName("tbody")[0];
  tasksTableBody.innerHTML = "";

  tasksData.forEach((task) => {
      const taskRow = document.createElement("tr");
      taskRow.innerHTML = `
          <td>${task.attributes.Title}</td>
          <td>${task.attributes.AssignedTo}</td>
          <td>${task.attributes.StartDate}</td>
          <td>${task.attributes.DueDate}</td>
          <td>${task.attributes.Progress}</td>
          <td>${task.attributes.Group}</td>
      `;
      tasksTableBody.appendChild(taskRow);
  });
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Attach the event listener after the DOM is fully loaded
  document.getElementById("fetchButton").addEventListener("click ", fetchAllProjectData);

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