

let projects = JSON.parse(localStorage.getItem('projects')) || [];

let savedBrand = localStorage.getItem('brandName') || 'Pro Manage';
let savedTheme = localStorage.getItem('theme') || 'light';

const navBrand = document.getElementById('navBrand');
navBrand.textContent = savedBrand;

const htmlEl = document.documentElement;
htmlEl.setAttribute('data-theme', savedTheme);

const boardLink = document.getElementById('boardLink');
const analyticsLink = document.getElementById('analyticsLink');
const settingsLink = document.getElementById('settingsLink');

const boardSection = document.getElementById('boardSection');
const analyticsSection = document.getElementById('analyticsSection');
const settingsSection = document.getElementById('settingsSection');

boardLink.addEventListener('click', () => showSection('board'));
analyticsLink.addEventListener('click', () => showSection('analytics'));
settingsLink.addEventListener('click', () => showSection('settings'));

function showSection(section) {
    [boardLink, analyticsLink, settingsLink].forEach(link => link.classList.remove('active'));
    [boardSection, analyticsSection, settingsSection].forEach(sec => sec.classList.remove('active'));

    if (section === 'board') {
        boardLink.classList.add('active');
        boardSection.classList.add('active');
        document.getElementById('headerTitle').textContent = 'Board';
        document.getElementById('timeRange').style.display = 'inline-block';
        document.getElementById('searchProject').style.display = 'inline-block';
        document.getElementById('filterStatus').style.display = 'inline-block';
        document.getElementById('addProjectBtn').style.display = 'inline-block';
        renderBoard();
    } else if (section === 'analytics') {
        analyticsLink.classList.add('active');
        analyticsSection.classList.add('active');
        document.getElementById('headerTitle').textContent = 'Analytics';
        document.getElementById('timeRange').style.display = 'none';
        document.getElementById('searchProject').style.display = 'none';
        document.getElementById('filterStatus').style.display = 'none';
        document.getElementById('addProjectBtn').style.display = 'none';
        renderAnalytics();
    } else if (section === 'settings') {
        settingsLink.classList.add('active');
        settingsSection.classList.add('active');
        document.getElementById('headerTitle').textContent = 'Settings';
        document.getElementById('timeRange').style.display = 'none';
        document.getElementById('searchProject').style.display = 'none';
        document.getElementById('filterStatus').style.display = 'none';
        document.getElementById('addProjectBtn').style.display = 'none';
    }
}


const boardContainer = document.getElementById('boardContainer');
const filterStatus = document.getElementById('filterStatus');
const searchProject = document.getElementById('searchProject');

filterStatus.addEventListener('change', renderBoard);
searchProject.addEventListener('input', renderBoard);

function saveProjects() {
    localStorage.setItem('projects', JSON.stringify(projects));
}

function renderBoard() {
    boardContainer.innerHTML = '';

    const statusFilter = filterStatus.value;
    const searchQuery = searchProject.value.toLowerCase();

    const columns = [
        { status: 'Pending', label: 'Pending' },
        { status: 'In Progress', label: 'In Progress' },
        { status: 'Completed', label: 'Completed' }
    ];

    columns.forEach(col => {
        const columnDiv = document.createElement('div');
        columnDiv.classList.add('column');

        const colHeader = document.createElement('h3');
        colHeader.textContent = col.label;
        columnDiv.appendChild(colHeader);

        const filteredProjects = projects.filter(proj => {
            const matchesColumn = proj.status === col.status;
            const matchesStatus = (statusFilter === 'All' || proj.status === statusFilter);
            const matchesSearch = proj.title.toLowerCase().includes(searchQuery);
            return matchesColumn && matchesStatus && matchesSearch;
        });

        filteredProjects.forEach((proj, index) => {
            const card = document.createElement('div');
            card.classList.add('card');

            const cardHeader = document.createElement('div');
            cardHeader.classList.add('card-header');

            const titleEl = document.createElement('div');
            titleEl.classList.add('card-title');
            titleEl.textContent = proj.title;

            const statusEl = document.createElement('div');
            statusEl.classList.add('card-status');
            if (proj.status === 'Pending') {
                statusEl.classList.add('status-pending');
            } else if (proj.status === 'In Progress') {
                statusEl.classList.add('status-inprogress');
            } else if (proj.status === 'Completed') {
                statusEl.classList.add('status-completed');
            }
            statusEl.textContent = proj.status;

            cardHeader.appendChild(titleEl);
            cardHeader.appendChild(statusEl);

            const descEl = document.createElement('div');
            descEl.classList.add('card-description');
            descEl.textContent = proj.description;

            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('card-actions');

            const editBtn = document.createElement('button');
            editBtn.classList.add('edit-btn');
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => openEditModal(index));

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deleteProject(index));

            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);

            card.appendChild(cardHeader);
            card.appendChild(descEl);
            card.appendChild(actionsDiv);

            columnDiv.appendChild(card);
        });

        boardContainer.appendChild(columnDiv);
    });
}

function deleteProject(index) {
    if (confirm('Are you sure you want to delete this project?')) {
        projects.splice(index, 1);
        saveProjects();
        renderBoard();
    }
}

const modalOverlay = document.getElementById('modalOverlay');
const modalTitle = document.getElementById('modalTitle');
const projectForm = document.getElementById('projectForm');
const editIndex = document.getElementById('editIndex');
const projectTitle = document.getElementById('projectTitle');
const projectDescription = document.getElementById('projectDescription');
const projectStatus = document.getElementById('projectStatus');
const addProjectBtn = document.getElementById('addProjectBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');

addProjectBtn.addEventListener('click', () => {
    editIndex.value = '';
    modalTitle.textContent = 'Add New Project';
    projectTitle.value = '';
    projectDescription.value = '';
    projectStatus.value = 'Pending';
    modalOverlay.classList.add('active');
});

cancelModalBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('active');
});

projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const idx = editIndex.value.trim();
    const titleVal = projectTitle.value.trim();
    const descVal = projectDescription.value.trim();
    const statusVal = projectStatus.value;

    if (idx === '') {
        projects.push({ title: titleVal, description: descVal, status: statusVal });
    } else {
        projects[idx].title = titleVal;
        projects[idx].description = descVal;
        projects[idx].status = statusVal;
    }

    saveProjects();
    renderBoard();
    modalOverlay.classList.remove('active');
});

function openEditModal(index) {
    const proj = projects[index];
    editIndex.value = index;
    modalTitle.textContent = 'Edit Project';
    projectTitle.value = proj.title;
    projectDescription.value = proj.description;
    projectStatus.value = proj.status;
    modalOverlay.classList.add('active');
}

function renderAnalytics() {
    const totalTasksEl = document.getElementById('totalTasks');
    const pendingTasksEl = document.getElementById('pendingTasks');
    const inProgressTasksEl = document.getElementById('inProgressTasks');
    const completedTasksEl = document.getElementById('completedTasks');

    const pendingBar = document.getElementById('pendingBar');
    const inProgressBar = document.getElementById('inProgressBar');
    const completedBar = document.getElementById('completedBar');

    const pendingBarText = document.getElementById('pendingBarText');
    const inProgressBarText = document.getElementById('inProgressBarText');
    const completedBarText = document.getElementById('completedBarText');

    const total = projects.length;
    const pendingCount = projects.filter(p => p.status === 'Pending').length;
    const inProgressCount = projects.filter(p => p.status === 'In Progress').length;
    const completedCount = projects.filter(p => p.status === 'Completed').length;

    totalTasksEl.textContent = total;
    pendingTasksEl.textContent = pendingCount;
    inProgressTasksEl.textContent = inProgressCount;
    completedTasksEl.textContent = completedCount;

    const maxCount = Math.max(1, pendingCount, inProgressCount, completedCount);

    const pendingHeight = (pendingCount / maxCount) * 100;
    const inProgressHeight = (inProgressCount / maxCount) * 100;
    const completedHeight = (completedCount / maxCount) * 100;

    pendingBar.style.height = pendingHeight + '%';
    inProgressBar.style.height = inProgressHeight + '%';
    completedBar.style.height = completedHeight + '%';

    pendingBarText.textContent = pendingCount;
    inProgressBarText.textContent = inProgressCount;
    completedBarText.textContent = completedCount;
}

const brandNameInput = document.getElementById('brandName');
const saveBrandBtn = document.getElementById('saveBrandBtn');
const clearTasksBtn = document.getElementById('clearTasksBtn');
const resetDataBtn = document.getElementById('resetDataBtn');

brandNameInput.value = savedBrand;

saveBrandBtn.addEventListener('click', () => {
    const newName = brandNameInput.value.trim() || 'Pro Manage';
    localStorage.setItem('brandName', newName);
    navBrand.textContent = newName;
    alert('Brand name updated!');
});

clearTasksBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all tasks?')) {
        projects = [];
        saveProjects();
        renderBoard();
        alert('All tasks cleared!');
    }
});

resetDataBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset ALL data?')) {
        localStorage.clear();
        location.reload();
    }
});

const themeToggleBtn = document.getElementById('themeToggle');

function updateThemeButtonText(theme) {
    themeToggleBtn.textContent = (theme === 'light') ? 'Dark Mode' : 'Light Mode';
}
updateThemeButtonText(savedTheme);

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = (currentTheme === 'light') ? 'dark' : 'light';
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButtonText(newTheme);
});

function init() {
    showSection('board');
    renderBoard();
}
init();