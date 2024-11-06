document.addEventListener('DOMContentLoaded', function () {
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const projectSection = document.getElementById('project-section');
    const projectListSection = document.getElementById('projects-list');

    document.getElementById('show-register').addEventListener('click', function () {
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
    });

    document.getElementById('show-login').addEventListener('click', function () {
        registerSection.style.display = 'none';
        loginSection.style.display = 'block';
    });

    // Login
    document.getElementById('login-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        const storedUser = localStorage.getItem(username);
        if (storedUser) {
            const user = JSON.parse(storedUser);
            if (user.password === password) {
                alert('Login bem-sucedido!');
                loginSection.style.display = 'none';
                projectSection.style.display = 'block';
                projectListSection.style.display = 'block';
            } else {
                alert('Senha incorreta!');
            }
        } else {
            alert('Usuário não encontrado!');
        }
    });

    // Registro
    document.getElementById('register-form').addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value;

        if (localStorage.getItem(username)) {
            alert('Usuário já existe!');
        } else {
            const user = { username, password };
            localStorage.setItem(username, JSON.stringify(user));
            alert('Conta criada com sucesso! Faça login para continuar.');
            registerSection.style.display = 'none';
            loginSection.style.display = 'block';
        }
    });

    // Adiciona projeto à lista de projetos
    document.getElementById('new-project-form').addEventListener('submit', function (event) {
        event.preventDefault();
        
        const projectName = document.getElementById('project-name').value.trim();
        const projectDesc = document.getElementById('project-desc').value.trim();
        
        if (!projectName || !projectDesc) {
            alert('Por favor, preencha todos os campos do projeto.');
            return;
        }

        const projectList = document.getElementById('project-list');
        const newProject = document.createElement('li');

    newProject.innerHTML = `
        <div class="project-header">
            <strong class="project-title">${projectName}</strong>
            <div>
                <button class="edit-btn" onclick="editProject(this)">Editar</button>
                <button class="delete-btn" onclick="deleteProject(this)">Excluir</button>
            </div>
        </div>
        <p class="project-desc">${projectDesc}</p>
        <div class="project-nav">
            <button class="nav-btn active" onclick="showPhase(this, 'initiation')">Inicio</button>
            <button class="nav-btn" onclick="showPhase(this, 'planning')">Planejamento</button>
            <button class="nav-btn" onclick="showPhase(this, 'execution')">Execução</button>
            <button class="nav-btn" onclick="showPhase(this, 'monitoring')">Monitoramento</button>
            <button class="nav-btn" onclick="showPhase(this, 'closure')">Encerramento</button>
            <button class="nav-btn" onclick="showPhase(this, 'schedule')">Cronograma</button>
        </div>
        ${generateProjectPhaseHTML()}
    `;
    


        
        projectList.appendChild(newProject);
        document.getElementById('new-project-form').reset();
    });

    function generateProjectPhaseHTML() {
        return `
            <div class="project-phase initiation active">
                <h3>Inicio</h3>
                <div class="checklist">
                    <h4>Checklist</h4>
                    <div class="checklist-items"></div>
                    <input type="text" placeholder="Nova ação" class="checklist-input">
                    <button class="add-btn" onclick="addChecklistItem(this)">Adicionar</button>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: 0%"></div>
                    </div>
                </div>
            </div>
            <div class="project-phase planning">
                <h3>Planejamento</h3>
                <div class="checklist">
                    <h4>Checklist</h4>
                    <div class="checklist-items"></div>
                    <input type="text" placeholder="Nova ação" class="checklist-input">
                    <button class="add-btn" onclick="addChecklistItem(this)">Adicionar</button>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: 0%"></div>
                    </div>
                </div>
            </div>
            <div class="project-phase execution">
                <h3>Execução</h3>
                <div class="checklist">
                    <h4>Checklist</h4>
                    <div class="checklist-items"></div>
                    <input type="text" placeholder="Nova ação" class="checklist-input">
                    <button class="add-btn" onclick="addChecklistItem(this)">Adicionar</button>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: 0%"></div>
                    </div>
                </div>
            </div>
            <div class="project-phase monitoring">
                <h3>Monitoramento</h3>
                <div class="checklist">
                    <h4>Checklist</h4>
                    <div class="checklist-items"></div>
                    <input type="text" placeholder="Nova ação" class="checklist-input">
                    <button class="add-btn" onclick="addChecklistItem(this)">Adicionar</button>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: 0%"></div>
                    </div>
                </div>
            </div>
            <div class="project-phase closure">
                <h3>Encerramento</h3>
                <div class="checklist">
                    <h4>Checklist</h4>
                    <div class="checklist-items"></div>
                    <input type="text" placeholder="Nova ação" class="checklist-input">
                    <button class="add-btn" onclick="addChecklistItem(this)">Adicionar</button>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: 0%"></div>
                    </div>
                </div>
            </div>
            <div class="project-phase schedule">
                <h3>Cronograma</h3>
                <div class="schedule-list">
                    <ul></ul>
                </div>
                <input type="text" placeholder="Nome da tarefa" class="task-name">
                <input type="date" placeholder="Data de início" class="start-date">
                <input type="date" placeholder="Data de término" class="end-date">
                <button class="add-schedule-btn" onclick="addScheduleItem(this)">Adicionar Tarefa</button>
            </div>
        `;
    }
});

// Adicionar Itens à Checklist
function addChecklistItem(button) {
    const checklistContainer = button.closest('.checklist').querySelector('.checklist-items');
    const input = button.closest('.checklist').querySelector('.checklist-input'); // Seleciona o input diretamente
    const value = input.value.trim();
    
    if (value) {
        const checklistItem = document.createElement('div');
        checklistItem.classList.add('checklist-item');
        checklistItem.innerHTML = `
            <div class="done-square" onclick="toggleDone(this)"></div>
            <input type="text" value="${value}" readonly>
            <button class="edit-btn" onclick="editChecklistItem(this)">Editar</button>
            <button class="delete-checklist-btn" onclick="deleteChecklistItem(this)">Excluir</button>
        `;
        checklistContainer.appendChild(checklistItem);
        input.value = ''; // Limpa o campo de entrada
        updateProgressBar(button.closest('.project-phase'));
    } else {
        alert('Por favor, insira uma ação.');
    }
}

function addScheduleItem(button) {
    const scheduleList = button.closest('.schedule').querySelector('.schedule-list ul');
    const taskName = button.closest('.schedule').querySelector('.task-name').value.trim();
    const startDate = button.closest('.schedule').querySelector('.start-date').value;
    const endDate = button.closest('.schedule').querySelector('.end-date').value;

    if (taskName && startDate && endDate) {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `<strong>${taskName}</strong> - Início: ${startDate} / Fim: ${endDate}`;
        scheduleList.appendChild(taskItem);
        
        // Limpa os campos
        button.closest('.schedule').querySelector('.task-name').value = '';
        button.closest('.schedule').querySelector('.start-date').value = '';
        button.closest('.schedule').querySelector('.end-date').value = '';
    } else {
        alert('Por favor, preencha todos os campos da tarefa.');
    }
}

// Exibir Fase
function showPhase(button, phase) {
    const project = button.closest('li');
    const phases = project.querySelectorAll('.project-phase');
    const buttons = project.querySelectorAll('.nav-btn');
    
    phases.forEach(p => p.classList.remove('active'));
    buttons.forEach(b => b.classList.remove('active'));
    
    project.querySelector(`.${phase}`).classList.add('active');
    button.classList.add('active');
}

// Excluir Projeto
function deleteProject(button) {
    const project = button.closest('li');
    project.remove();
}

// Outros códigos relacionados ao checklist...

function toggleDone(square) {
    square.classList.toggle('checked');
    updateProgressBar(square.closest('.project-phase'));
}

// Editar Item de Checklist
function editChecklistItem(button) {
    const item = button.previousElementSibling;
    const isReadonly = item.hasAttribute('readonly');
    
    if (isReadonly) {
        item.removeAttribute('readonly');
        button.textContent = 'Salvar';
    } else {
        item.setAttribute('readonly', 'readonly');
        button.textContent = 'Editar';
    }
}

// Excluir Item de Checklist
function deleteChecklistItem(button) {
    const item = button.closest('.checklist-item');
    item.remove();
    updateProgressBar(button.closest('.project-phase'));
}

// Atualizar Barra de Progresso
function updateProgressBar(phase) {
    const checklistItems = phase.querySelectorAll('.checklist-item');
    const totalItems = checklistItems.length;
    const doneItems = Array.from(checklistItems).filter(item => item.querySelector('.done-square').classList.contains('checked')).length;
    const progressBar = phase.querySelector('.progress-bar');
    
    const percentage = totalItems > 0 ? (doneItems / totalItems) * 100 : 0;
    progressBar.style.width = `${percentage}%`;
    progressBar.textContent = `${Math.round(percentage)}%`;
}
