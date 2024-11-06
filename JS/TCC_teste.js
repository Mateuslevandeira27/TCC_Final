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
    
    const firebaseConfig = {
        apiKey: "AIzaSyApA1QtAzmhjmvOWhQvbtMbflFa7isUdSg",
        authDomain: "flex-project-d8920.firebaseapp.com",
        projectId: "flex-project-d8920",
        storageBucket: "flex-project-d8920.firebasestorage.app",
        messagingSenderId: "119567572705",
        appId: "1:119567572705:web:e7cc55ebef7cd88c0621a0"
    };
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    //registro
    document.getElementById('register-form').addEventListener('submit', async function (event) {
        event.preventDefault();
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value;
        try {
          const createUserResponse = await firebase.auth().createUserWithEmailAndPassword(username, password);
          const user = createUserResponse.user;

          await db.collection('users').doc(user.uid).set({
            username: username,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
      
          alert('Conta criada com sucesso! Faça login para continuar.');
          document.getElementById('register-section').style.display = 'none';
          document.getElementById('login-section').style.display = 'block';
        } catch (error) {
          console.error("Error creating user:", error);
        }
      });

    // Login
    document.getElementById('login-form').addEventListener('submit', async function (event) {
        event.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
    
        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(username, password);
            const user = userCredential.user;
    
            const userDoc = await db.collection('users').doc(user.uid).get();
            
            if (userDoc.exists) {
                const userData = userDoc.data();
                alert(`Bem-vindo, ${userData.username}!`);
                document.getElementById('login-section').style.display = 'none';
                document.getElementById('project-section').style.display = 'block';
                
                // Carregar projetos do usuário
                loadUserProjects(user.uid);
            } else {
                console.log("Nenhum dado encontrado para o usuário!");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            alert('Erro ao fazer login: ' + error.message);
        }
    });
    
    // Função para carregar projetos do Firestore e exibir na lista
    async function loadUserProjects(userId) {
        const projectList = document.getElementById('project-list');
        projectList.innerHTML = ''; // Limpa a lista antes de carregar os projetos
        
        try {
            const projectsSnapshot = await db.collection('users').doc(userId).collection('projects').get();
            projectsSnapshot.forEach(doc => {
                const projectData = doc.data();
                displayProject(projectData.projectName, projectData.projectDesc);
            });
        } catch (error) {
            console.error("Erro ao carregar projetos:", error);
        }
    }

    // Adicionar e salvar novo projeto no Firestore
    document.getElementById('new-project-form').addEventListener('submit', async function (event) {
        event.preventDefault();
        
        const projectName = document.getElementById('project-name').value.trim();
        const projectDesc = document.getElementById('project-desc').value.trim();
        const user = firebase.auth().currentUser;
        
        if (!projectName || !projectDesc) {
            alert('Por favor, preencha todos os campos do projeto.');
            return;
        }

        if (user) {
            try {
                const projectData = {
                    projectName: projectName,
                    projectDesc: projectDesc,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                
                // Salva no Firestore na subcoleção 'projects' do usuário
                await db.collection('users').doc(user.uid).collection('projects').add(projectData);
                
                // Exibe o projeto na lista da interface
                displayProject(projectName, projectDesc);
                document.getElementById('new-project-form').reset();
                alert('Projeto adicionado com sucesso!');
            } catch (error) {
                console.error("Erro ao adicionar projeto:", error);
            }
        } else {
            alert('Você precisa estar logado para adicionar um projeto.');
        }
    });

    // Função para exibir um projeto na interface
    function displayProject(projectName, projectDesc) {
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
    }

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
