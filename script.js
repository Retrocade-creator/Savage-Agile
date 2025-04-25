console.log('Script loading...');

let columnCount = 0;
let leanCoffeeColumnCount = 0;
let tokensRemaining = 3;
const maxTokens = 3;
let players = {};
let storyPointingVotes = [];

function saveAppState() {
    console.log('Saving app state to localStorage');
    const state = {
        roomName: document.getElementById('room-name').textContent,
        columns: [],
        leanCoffeeColumns: [],
        feedbackBoard: [],
        actionItems: [],
        songs: [],
        tokensRemaining: tokensRemaining,
        agreements: {
            teamNorms: [],
            definitionOfReady: [],
            definitionOfDone: []
        },
        storyPointing: {
            storyTitle: document.getElementById('story-title-text')?.textContent || '',
            sizingMethod: document.getElementById('sizing-method')?.value || '',
            votes: storyPointingVotes
        }
    };

    const columns = document.querySelectorAll('#columns-container .column');
    columns.forEach(column => {
        const columnId = column.id;
        const columnName = document.getElementById(`${columnId}-name`).textContent;
        const feedbackItems = Array.from(document.getElementById(`${columnId}-feedback-list`).children).map(li => ({
            text: li.childNodes[2].textContent.trim(),
            votes: parseInt(li.querySelector('.vote-count').textContent)
        }));
        state.columns.push({ id: columnId, name: columnName, feedback: feedbackItems });
    });

    const leanCoffeeColumns = document.querySelectorAll('#lean-coffee-columns-container .column');
    leanCoffeeColumns.forEach(column => {
        const columnId = column.id;
        const columnName = document.getElementById(`${columnId}-name`).textContent;
        const feedbackItems = Array.from(document.getElementById(`${columnId}-feedback-list`).children).map(li => ({
            text: li.childNodes[2].textContent.trim(),
            votes: parseInt(li.querySelector('.vote-count').textContent)
        }));
        state.leanCoffeeColumns.push({ id: columnId, name: columnName, feedback: feedbackItems });
    });

    const feedbackList = document.getElementById('feedback-list');
    state.feedbackBoard = Array.from(feedbackList.children).map(li => li.childNodes[0].textContent.trim());

    const actionList = document.getElementById('action-list');
    state.actionItems = Array.from(actionList.children).map(li => ({
        text: li.childNodes[1].textContent.trim(),
        checked: li.querySelector('input[type="checkbox"]').checked
    }));

    const songList = document.getElementById('song-list');
    state.songs = Array.from(songList.children).map(li => ({
        videoId: li.querySelector('.song-player').id.replace('player-', ''),
        votes: parseInt(li.querySelector('.vote-count').textContent)
    }));

    const teamNormsList = document.querySelector('#agreement-list.team-norms');
    if (teamNormsList) {
        state.agreements.teamNorms = Array.from(teamNormsList.children).map(li => ({
            text: li.childNodes[2].textContent.trim(),
            votes: parseInt(li.querySelector('.vote-count').textContent)
        }));
    }

    const definitionOfReadyList = document.querySelector('#agreement-list.definition-of-ready');
    if (definitionOfReadyList) {
        state.agreements.definitionOfReady = Array.from(definitionOfReadyList.children).map(li => ({
            text: li.childNodes[2].textContent.trim(),
            votes: parseInt(li.querySelector('.vote-count').textContent)
        }));
    }

    const definitionOfDoneList = document.querySelector('#agreement-list.definition-of-done');
    if (definitionOfDoneList) {
        state.agreements.definitionOfDone = Array.from(definitionOfDoneList.children).map(li => ({
            text: li.childNodes[2].textContent.trim(),
            votes: parseInt(li.querySelector('.vote-count').textContent)
        }));
    }

    localStorage.setItem('retrocadeState', JSON.stringify(state));
}

function loadAppState() {
    console.log('Loading app state from localStorage');
    const savedState = localStorage.getItem('retrocadeState');
    if (!savedState) return;

    const state = JSON.parse(savedState);

    document.getElementById('room-name').textContent = state.roomName;

    state.columns.forEach(column => {
        addColumn(column.name);
        const columnId = `column-${columnCount}`;
        column.feedback.forEach(item => {
            const li = document.createElement('li');
            const voteCount = document.createElement('span');
            voteCount.textContent = item.votes;
            voteCount.style.marginRight = '10px';
            voteCount.className = 'vote-count';
            const voteTokenBtn = document.createElement('button');
            voteTokenBtn.textContent = 'Vote';
            voteTokenBtn.className = 'vote-token-btn';
            voteTokenBtn.onclick = () => {
                if (tokensRemaining > 0) {
                    voteCount.textContent = parseInt(voteCount.textContent) + 1;
                    tokensRemaining--;
                    updateTokenCounter();
                    if (tokensRemaining === 0) {
                        disableAllVoteButtons();
                    }
                    saveAppState();
                } else {
                    alert('You have used all your tokens!');
                }
            };
            li.appendChild(voteCount);
            li.appendChild(voteTokenBtn);
            li.appendChild(document.createTextNode(` ${item.text}`));
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.onclick = () => {
                li.remove();
                saveAppState();
            };
            li.appendChild(deleteBtn);
            document.getElementById(`${columnId}-feedback-list`).appendChild(li);
        });
    });

    state.leanCoffeeColumns.forEach(column => {
        addLeanCoffeeColumn(column.name);
        const columnId = `lean-coffee-column-${leanCoffeeColumnCount}`;
        column.feedback.forEach(item => {
            const li = document.createElement('li');
            const voteCount = document.createElement('span');
            voteCount.textContent = item.votes;
            voteCount.style.marginRight = '10px';
            voteCount.className = 'vote-count';
            const voteTokenBtn = document.createElement('button');
            voteTokenBtn.textContent = 'Vote';
            voteTokenBtn.className = 'vote-token-btn';
            voteTokenBtn.onclick = () => {
                if (tokensRemaining > 0) {
                    voteCount.textContent = parseInt(voteCount.textContent) + 1;
                    tokensRemaining--;
                    updateTokenCounter();
                    if (tokensRemaining === 0) {
                        disableAllVoteButtons();
                    }
                    saveAppState();
                } else {
                    alert('You have used all your tokens!');
                }
            };
            li.appendChild(voteCount);
            li.appendChild(voteTokenBtn);
            li.appendChild(document.createTextNode(` ${item.text}`));
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.onclick = () => {
                li.remove();
                saveAppState();
            };
            li.appendChild(deleteBtn);
            document.getElementById(`${columnId}-feedback-list`).appendChild(li);
        });
    });

    const feedbackList = document.getElementById('feedback-list');
    state.feedbackBoard.forEach(feedbackText => {
        const li = document.createElement('li');
        li.textContent = feedbackText;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => {
            li.remove();
            saveAppState();
        };
        li.appendChild(deleteBtn);
        feedbackList.appendChild(li);
    });

    const actionList = document.getElementById('action-list');
    state.actionItems.forEach(item => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = item.checked;
        checkbox.addEventListener('change', function () {
            li.style.textDecoration = this.checked ? 'line-through' : 'none';
            saveAppState();
        });
        li.appendChild(checkbox);
        li.appendChild(document.createTextNode(item.text));
        li.style.textDecoration = item.checked ? 'line-through' : 'none';
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => {
            li.remove();
            saveAppState();
        };
        li.appendChild(deleteBtn);
        actionList.appendChild(li);
    });

    const songList = document.getElementById('song-list');
    state.songs.forEach(song => {
        const li = document.createElement('li');
        const voteCount = document.createElement('span');
        voteCount.textContent = song.votes;
        voteCount.style.marginRight = '10px';
        voteCount.className = 'vote-count';
        const upvoteBtn = document.createElement('button');
        upvoteBtn.textContent = 'Upvote';
        upvoteBtn.className = 'upvote-btn';
        upvoteBtn.onclick = () => {
            voteCount.textContent = parseInt(voteCount.textContent) + 1;
            saveAppState();
        };
        li.appendChild(voteCount);
        li.appendChild(upvoteBtn);
        li.appendChild(document.createTextNode(` ${song.videoId}`));
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => {
            if (players[song.videoId]) {
                players[song.videoId].destroy();
                delete players[song.videoId];
            }
            li.remove();
            saveAppState();
        };
        li.appendChild(deleteBtn);

        const playerContainer = document.createElement('div');
        playerContainer.className = 'player-container';
        const playerDiv = document.createElement('div');
        playerDiv.id = `player-${song.videoId}`;
        playerDiv.className = 'song-player';
        playerContainer.appendChild(playerDiv);
        li.appendChild(playerContainer);

        songList.appendChild(li);

        players[song.videoId] = new YT.Player(`player-${song.videoId}`, {
            height: '112',
            width: '200',
            videoId: song.videoId,
            playerVars: {
                'autoplay': 0,
                'controls': 1,
                'modestbranding': 1,
                'rel': 0,
                'showinfo': 0
            },
            events: {
                'onReady': (event) => {
                    console.log(`YouTube player for ${song.videoId} is ready`);
                },
                'onError': (event) => {
                    console.error(`YouTube player error for ${song.videoId}:`, event.data);
                    alert('Error loading YouTube video. Please check the URL.');
                }
            }
        });
    });

    tokensRemaining = state.tokensRemaining;
    updateTokenCounter();
    if (tokensRemaining === 0) {
        disableAllVoteButtons();
    }

    if (state.agreements) {
        const presets = ['team-norms', 'definition-of-ready', 'definition-of-done'];
        presets.forEach(preset => {
            const list = document.querySelector(`#agreement-list.${preset}`);
            if (list && state.agreements[preset.replace(/-/g, '')]) {
                state.agreements[preset.replace(/-/g, '')].forEach(item => {
                    const li = document.createElement('li');
                    const voteCount = document.createElement('span');
                    voteCount.textContent = item.votes;
                    voteCount.style.marginRight = '10px';
                    voteCount.className = 'vote-count';
                    const upvoteBtn = document.createElement('button');
                    upvoteBtn.textContent = 'Upvote';
                    upvoteBtn.className = 'upvote-btn';
                    upvoteBtn.onclick = () => {
                        voteCount.textContent = parseInt(voteCount.textContent) + 1;
                        saveAppState();
                    };
                    li.appendChild(voteCount);
                    li.appendChild(upvoteBtn);
                    li.appendChild(document.createTextNode(` ${item.text}`));
                    const deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Delete';
                    deleteBtn.className = 'delete-btn';
                    deleteBtn.onclick = () => {
                        li.remove();
                        saveAppState();
                    };
                    li.appendChild(deleteBtn);
                    list.appendChild(li);
                });
            }
        });
    }

    if (state.storyPointing) {
        const { storyTitle, sizingMethod, votes } = state.storyPointing;
        if (storyTitle) {
            document.getElementById('story-title-text').textContent = storyTitle;
            document.getElementById('story-title-display').style.display = 'block';
            document.getElementById('story-title-section').style.display = 'none';
            document.getElementById('sizing-method-section').style.display = 'block';
        }
        if (sizingMethod) {
            document.getElementById('sizing-method').value = sizingMethod;
            updateSizingOptions();
            document.getElementById('voting-section').style.display = 'block';
        }
        storyPointingVotes = votes || [];
        displayVoteResults();
    }
}

function clearData() {
    console.log('clearData called');
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        localStorage.removeItem('retrocadeState');
        localStorage.removeItem('theme');
        location.reload();
    }
}

function toggleTheme() {
    console.log('toggleTheme called');
    const body = document.body;
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    loadAppState();
});

function startIcebreaker() {
    console.log('startIcebreaker called');
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('icebreaker-section').style.display = 'block';
}

function displayIcebreaker() {
    console.log('displayIcebreaker called');
    const preset = document.getElementById('icebreaker-presets').value;
    const displayDiv = document.getElementById('icebreaker-display');
    const displayText = document.getElementById('icebreaker-text');

    if (!preset || !displayDiv || !displayText) {
        console.error('Icebreaker elements missing:', { preset, displayDiv, displayText });
        alert('Error: Icebreaker elements not found. Check console.');
        return;
    }

    displayText.textContent = preset;
    displayDiv.style.display = 'block';
}

function skipIcebreaker() {
    console.log('skipIcebreaker called');
    document.getElementById('icebreaker-section').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
}

function returnToMainMenuFromIcebreaker() {
    console.log('returnToMainMenuFromIcebreaker called');
    document.getElementById('icebreaker-section').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
}

function startWorkingAgreements() {
    console.log('startWorkingAgreements called');
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('working-agreements-section').style.display = 'block';
}

function displayAgreement() {
    console.log('displayAgreement called');
    const preset = document.getElementById('agreement-presets').value;
    const displayDiv = document.getElementById('agreement-display');
    const displayText = document.getElementById('agreement-text');
    const agreementList = document.getElementById('agreement-list');

    if (!preset || !displayDiv || !displayText || !agreementList) {
        console.error('Agreement elements missing:', { preset, displayDiv, displayText, agreementList });
        alert('Error: Agreement elements not found. Check console.');
        return;
    }

    displayText.textContent = preset.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    agreementList.className = `agreement-list ${preset}`;
    agreementList.innerHTML = '';
    displayDiv.style.display = 'block';

    const state = JSON.parse(localStorage.getItem('retrocadeState') || '{}');
    if (state.agreements && state.agreements[preset.replace(/-/g, '')]) {
        state.agreements[preset.replace(/-/g, '')].forEach(item => {
            const li = document.createElement('li');
            const voteCount = document.createElement('span');
            voteCount.textContent = item.votes;
            voteCount.style.marginRight = '10px';
            voteCount.className = 'vote-count';
            const upvoteBtn = document.createElement('button');
            upvoteBtn.textContent = 'Upvote';
            upvoteBtn.className = 'upvote-btn';
            upvoteBtn.onclick = () => {
                voteCount.textContent = parseInt(voteCount.textContent) + 1;
                saveAppState();
            };
            li.appendChild(voteCount);
            li.appendChild(upvoteBtn);
            li.appendChild(document.createTextNode(` ${item.text}`));
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.onclick = () => {
                li.remove();
                saveAppState();
            };
            li.appendChild(deleteBtn);
            agreementList.appendChild(li);
        });
    }
}

function addAgreement() {
    console.log('addAgreement called');
    const input = document.getElementById('agreement-input');
    const agreementList = document.getElementById('agreement-list');
    const agreementText = input.value.trim();
    const preset = document.getElementById('agreement-presets').value;

    if (!input || !agreementList || !preset) {
        console.error('Agreement elements missing:', { input, agreementList, preset });
        alert('Error: Agreement elements not found. Check console.');
        return;
    }

    if (agreementText !== '') {
        const li = document.createElement('li');
        const voteCount = document.createElement('span');
        voteCount.textContent = '0';
        voteCount.style.marginRight = '10px';
        voteCount.className = 'vote-count';
        const upvoteBtn = document.createElement('button');
        upvoteBtn.textContent = 'Upvote';
        upvoteBtn.className = 'upvote-btn';
        upvoteBtn.onclick = () => {
            voteCount.textContent = parseInt(voteCount.textContent) + 1;
            saveAppState();
        };
        li.appendChild(voteCount);
        li.appendChild(upvoteBtn);
        li.appendChild(document.createTextNode(` ${agreementText}`));
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => {
            li.remove();
            saveAppState();
        };
        li.appendChild(deleteBtn);
        agreementList.appendChild(li);
        input.value = '';
        saveAppState();
    } else {
        alert('Please enter an item before adding.');
    }
}

function saveAgreements() {
    console.log('saveAgreements called');
    const workingAgreementsSection = document.getElementById('working-agreements-section');
    const mainMenu = document.getElementById('main-menu');

    if (!workingAgreementsSection || !mainMenu) {
        console.error('Section elements missing:', { workingAgreementsSection, mainMenu });
        alert('Error: Section elements not found. Check console.');
        return;
    }

    workingAgreementsSection.style.display = 'none';
    mainMenu.style.display = 'block';
}

function proceedToRetrospective() {
    console.log('proceedToRetrospective called');
    const workingAgreementsSection = document.getElementById('working-agreements-section');
    const retroSections = document.getElementById('retro-sections');

    if (!workingAgreementsSection || !retroSections) {
        console.error('Section elements missing:', { workingAgreementsSection, retroSections });
        alert('Error: Section elements not found. Check console.');
        return;
    }

    workingAgreementsSection.style.display = 'none';
    retroSections.style.display = 'block';
}

function returnToMainMenuFromWorkingAgreements() {
    console.log('returnToMainMenuFromWorkingAgreements called');
    document.getElementById('working-agreements-section').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
}

function startRetrospective() {
    console.log('startRetrospective called');
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('retro-sections').style.display = 'block';
    resetTokens();
}

function returnToMainMenuFromRetro() {
    console.log('returnToMainMenuFromRetro called');
    document.getElementById('retro-sections').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
}

function toggleEditRoomName() {
    console.log('toggleEditRoomName called');
    const editSection = document.getElementById('room-name-edit');
    const editButton = document.getElementById('edit-room-name');
    const roomNameInput = document.getElementById('room-name-input');
    const roomNameDisplay = document.getElementById('room-name');

    if (!editSection || !editButton || !roomNameInput || !roomNameDisplay) {
        console.error('Room name elements missing:', { editSection, editButton, roomNameInput, roomNameDisplay });
        alert('Error: Room name elements not found. Check console.');
        return;
    }

    const isEditVisible = editSection.style.display === 'block';
    editSection.style.display = isEditVisible ? 'none' : 'block';
    editButton.style.display = isEditVisible ? 'inline-block' : 'none';
    if (!isEditVisible) {
        roomNameInput.value = roomNameDisplay.textContent;
    }
}

function saveRoomName() {
    console.log('saveRoomName called');
    const input = document.getElementById('room-name-input');
    const roomName = document.getElementById('room-name');
    const newName = input.value.trim();

    if (!input || !roomName) {
        console.error('Room name elements missing:', { input, roomName });
        alert('Error: Room name elements not found. Check console.');
        return;
    }

    if (newName !== '') {
        roomName.textContent = newName;
        toggleEditRoomName();
        saveAppState();
    } else {
        alert('Please enter a room name.');
    }
}

function addColumn(name = `New Column ${columnCount + 1}`) {
    console.log('addColumn called', name);
    columnCount++;
    const container = document.getElementById('columns-container');
    const columnId = `column-${columnCount}`;

    if (!container) {
        console.error('Columns container not found');
        return;
    }

    const column = document.createElement('div');
    column.className = 'column';
    column.id = columnId;
    column.setAttribute('draggable', 'true');

    const normalizedName = name.toLowerCase();
    if (normalizedName.includes('start') || normalizedName.includes('to discuss') || normalizedName.includes('liked') || normalizedName.includes('keep') || normalizedName.includes('plus') || normalizedName.includes('winds') || normalizedName.includes('fuel') || normalizedName.includes('energy') || normalizedName.includes('trust') || normalizedName.includes('wins')) column.classList.add('start');
    else if (normalizedName.includes('stop') || normalizedName.includes('discussing') || normalizedName.includes('lacked') || normalizedName.includes('drop') || normalizedName.includes('delta') || normalizedName.includes('anchors') || normalizedName.includes('weights') || normalizedName.includes('risky') || normalizedName.includes('challenges')) column.classList.add('stop');
    else if (normalizedName.includes('continue') || normalizedName.includes('discussed') || normalizedName.includes('learned') || normalizedName.includes('add') || normalizedName.includes('rocks') || normalizedName.includes('sky') || normalizedName.includes('build') || normalizedName.includes('cheers')) column.classList.add('continue');

    const header = document.createElement('h3');
    header.id = `${columnId}-name`;
    header.textContent = name;
    column.appendChild(header);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit';
    editButton.onclick = () => toggleEditColumnName(columnId);
    column.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete';
    deleteButton.onclick = () => {
        if (confirm('Are you sure you want to delete this column and all its feedback?')) {
            column.remove();
            saveAppState();
        }
    };
    column.appendChild(deleteButton);

    const editSection = document.createElement('div');
    editSection.className = 'column-edit';
    editSection.id = `${columnId}-edit`;
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.id = `${columnId}-input`;
    editInput.placeholder = 'Enter column name...';
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.onclick = () => saveColumnName(columnId);
    editSection.appendChild(editInput);
    editSection.appendChild(saveButton);
    column.appendChild(editSection);

    const feedbackInput = document.createElement('input');
    feedbackInput.type = 'text';
    feedbackInput.className = 'column-feedback-input';
    feedbackInput.id = `${columnId}-feedback-input`;
    feedbackInput.placeholder = 'Add feedback...';
    column.appendChild(feedbackInput);

    const feedbackButton = document.createElement('button');
    feedbackButton.textContent = 'Add';
    feedbackButton.onclick = () => addColumnFeedback(columnId);
    column.appendChild(feedbackButton);

    const feedbackList = document.createElement('ul');
    feedbackList.className = 'column-feedback-list';
    feedbackList.id = `${columnId}-feedback-list`;
    column.appendChild(feedbackList);

    container.appendChild(column);
    saveAppState();
}

function toggleEditColumnName(columnId) {
    console.log(`toggleEditColumnName called for ${columnId}`);
    const editSection = document.getElementById(`${columnId}-edit`);
    const editButton = document.querySelector(`#${columnId} button.edit`);
    const nameInput = document.getElementById(`${columnId}-input`);
    const nameDisplay = document.getElementById(`${columnId}-name`);

    if (!editSection || !editButton || !nameInput || !nameDisplay) {
        console.error(`Column elements missing for ${columnId}:`, { editSection, editButton, nameInput, nameDisplay });
        alert(`Error: Column elements not found for ${columnId}. Check console.`);
        return;
    }

    const isEditVisible = editSection.style.display === 'block';
    editSection.style.display = isEditVisible ? 'none' : 'block';
    editButton.style.display = isEditVisible ? 'inline-block' : 'none';
    if (!isEditVisible) {
        nameInput.value = nameDisplay.textContent;
    }
}

function saveColumnName(columnId) {
    console.log(`saveColumnName called for ${columnId}`);
    const input = document.getElementById(`${columnId}-input`);
    const nameDisplay = document.getElementById(`${columnId}-name`);
    const column = document.getElementById(columnId);
    const newName = input.value.trim();

    if (!input || !nameDisplay || !column) {
        console.error('Column elements missing:', { input, nameDisplay, column });
        alert('Error: Column elements not found. Check console.');
        return;
    }

    if (newName !== '') {
        nameDisplay.textContent = newName;
        column.classList.remove('start', 'stop', 'continue');
        const normalizedName = newName.toLowerCase();
        if (normalizedName.includes('start') || normalizedName.includes('to discuss') || normalizedName.includes('liked') || normalizedName.includes('keep') || normalizedName.includes('plus') || normalizedName.includes('winds') || normalizedName.includes('fuel') || normalizedName.includes('energy') || normalizedName.includes('trust') || normalizedName.includes('wins')) column.classList.add('start');
        else if (normalizedName.includes('stop') || normalizedName.includes('discussing') || normalizedName.includes('lacked') || normalizedName.includes('drop') || normalizedName.includes('delta') || normalizedName.includes('anchors') || normalizedName.includes('weights') || normalizedName.includes('risky') || normalizedName.includes('challenges')) column.classList.add('stop');
        else if (normalizedName.includes('continue') || normalizedName.includes('discussed') || normalizedName.includes('learned') || normalizedName.includes('add') || normalizedName.includes('rocks') || normalizedName.includes('sky') || normalizedName.includes('build') || normalizedName.includes('cheers')) column.classList.add('continue');
        toggleEditColumnName(columnId);
        saveAppState();
    } else {
        alert('Please enter a column name.');
    }
}

function addColumnFeedback(columnId) {
    console.log(`addColumnFeedback called for ${columnId}`);
    const input = document.getElementById(`${columnId}-feedback-input`);
    const feedbackList = document.getElementById(`${columnId}-feedback-list`);
    const feedbackText = input.value.trim();

    if (!input || !feedbackList) {
        console.error('Feedback elements missing:', { input, feedbackList });
        alert('Error: Feedback elements not found. Check console.');
        return;
    }

    if (feedbackText !== '') {
        const li = document.createElement('li');
        const voteCount = document.createElement('span');
        voteCount.textContent = '0';
        voteCount.style.marginRight = '10px';
        voteCount.className = 'vote-count';
        const voteTokenBtn = document.createElement('button');
        voteTokenBtn.textContent = 'Vote';
        voteTokenBtn.className = 'vote-token-btn';
        voteTokenBtn.onclick = () => {
            if (tokensRemaining > 0) {
                voteCount.textContent = parseInt(voteCount.textContent) + 1;
                tokensRemaining--;
                updateTokenCounter();
                if (tokensRemaining === 0) {
                    disableAllVoteButtons();
                }
                saveAppState();
            } else {
                alert('You have used all your tokens!');
            }
        };
        li.appendChild(voteCount);
        li.appendChild(voteTokenBtn);
        li.appendChild(document.createTextNode(` ${feedbackText}`));
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => {
            li.remove();
            saveAppState();
        };
        li.appendChild(deleteBtn);
        feedbackList.appendChild(li);
        input.value = '';
        saveAppState();
    } else {
        alert('Please enter feedback before adding.');
    }
}

function updateTokenCounter() {
    const tokensRemainingElement = document.getElementById('tokens-remaining');
    if (tokensRemainingElement) {
        tokensRemainingElement.textContent = tokensRemaining;
    }
}

function disableAllVoteButtons() {
    const voteButtons = document.querySelectorAll('.vote-token-btn');
    voteButtons.forEach(button => {
        button.disabled = true;
    });
}

function resetTokens() {
    console.log('resetTokens called');
    tokensRemaining = maxTokens;
    updateTokenCounter();
    const voteCounts = document.querySelectorAll('.column-feedback-list .vote-count');
    voteCounts.forEach(count => {
        count.textContent = '0';
    });
    const voteButtons = document.querySelectorAll('.vote-token-btn');
    voteButtons.forEach(button => {
        button.disabled = false;
    });
    saveAppState();
}

function addFeedback() {
    console.log('addFeedback called');
    const input = document.getElementById('feedback-input');
    const feedbackList = document.getElementById('feedback-list');
    const feedbackText = input.value.trim();

    if (!input || !feedbackList) {
        console.error('Feedback elements missing:', { input, feedbackList });
        alert('Error: Feedback elements not found. Check console.');
        return;
    }

    if (feedbackText !== '') {
        const li = document.createElement('li');
        li.textContent = feedbackText;
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => {
            li.remove();
            saveAppState();
        };
        li.appendChild(deleteBtn);
        feedbackList.appendChild(li);
        input.value = '';
        saveAppState();
    } else {
        alert('Please enter feedback before submitting.');
    }
}

function addActionItem() {
    console.log('addActionItem called');
    const input = document.getElementById('action-input');
    const actionList = document.getElementById('action-list');
    const actionText = input.value.trim();

    if (!input || !actionList) {
        console.error('Action elements missing:', { input, actionList });
        alert('Error: Action elements not found. Check console.');
        return;
    }

    if (actionText !== '') {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', function () {
            li.style.textDecoration = this.checked ? 'line-through' : 'none';
            saveAppState();
        });
        li.appendChild(checkbox);
        li.appendChild(document.createTextNode(actionText));
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => {
            li.remove();
            saveAppState();
        };
        li.appendChild(deleteBtn);
        actionList.appendChild(li);
        input.value = '';
        saveAppState();
    } else {
        alert('Please enter an action item before adding.');
    }
}

function extractYouTubeVideoId(url) {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

function addSong() {
    console.log('addSong called');
    const input = document.getElementById('song-input');
    const songList = document.getElementById('song-list');
    const songUrl = input.value.trim();

    if (!input || !songList) {
        console.error('Song elements missing:', { input, songList });
        alert('Error: Song elements not found. Check console.');
        return;
    }

    if (songUrl !== '') {
        const videoId = extractYouTubeVideoId(songUrl);
        if (!videoId) {
            alert('Please enter a valid YouTube URL.');
            return;
        }

        const li = document.createElement('li');
        const voteCount = document.createElement('span');
        voteCount.textContent = '0';
        voteCount.style.marginRight = '10px';
        voteCount.className = 'vote-count';
        const upvoteBtn = document.createElement('button');
        upvoteBtn.textContent = 'Upvote';
        upvoteBtn.className = 'upvote-btn';
        upvoteBtn.onclick = () => {
            voteCount.textContent = parseInt(voteCount.textContent) + 1;
            saveAppState();
        };
        li.appendChild(voteCount);
        li.appendChild(upvoteBtn);
        li.appendChild(document.createTextNode(` ${songUrl}`));
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => {
            if (players[videoId]) {
                players[videoId].destroy();
                delete players[videoId];
            }
            li.remove();
            saveAppState();
        };
        li.appendChild(deleteBtn);

        const playerContainer = document.createElement('div');
        playerContainer.className = 'player-container';
        const playerDiv = document.createElement('div');
        playerDiv.id = `player-${videoId}`;
        playerDiv.className = 'song-player';
        playerContainer.appendChild(playerDiv);
        li.appendChild(playerContainer);

        songList.appendChild(li);

        players[videoId] = new YT.Player(`player-${videoId}`, {
            height: '112',
            width: '200',
            videoId: videoId,
            playerVars: {
                'autoplay': 0,
                'controls': 1,
                'modestbranding': 1,
                'rel': 0,
                'showinfo': 0
            },
            events: {
                'onReady': (event) => {
                    console.log(`YouTube player for ${videoId} is ready`);
                },
                'onError': (event) => {
                    console.error(`YouTube player error for ${videoId}:`, event.data);
                    alert('Error loading YouTube video. Please check the URL.');
                }
            }
        });

        input.value = '';
        saveAppState();
    } else {
        alert('Please enter a song URL before adding.');
    }
}

// Story Pointing Functions
function startStoryPointing() {
    console.log('startStoryPointing called');
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('story-pointing-section').style.display = 'block';
}

function saveStoryTitle() {
    console.log('saveStoryTitle called');
    const input = document.getElementById('story-title-input');
    const display = document.getElementById('story-title-display');
    const text = document.getElementById('story-title-text');
    const storyTitleSection = document.getElementById('story-title-section');
    const sizingMethodSection = document.getElementById('sizing-method-section');

    if (!input || !display || !text || !storyTitleSection || !sizingMethodSection) {
        console.error('Story pointing elements missing:', { input, display, text, storyTitleSection, sizingMethodSection });
        alert('Error: Story pointing elements not found. Check console.');
        return;
    }

    const storyTitle = input.value.trim();
    if (storyTitle !== '') {
        text.textContent = storyTitle;
        display.style.display = 'block';
        storyTitleSection.style.display = 'none';
        sizingMethodSection.style.display = 'block';
        saveAppState();
    } else {
        alert('Please enter a story title.');
    }
}

function editStoryTitle() {
    console.log('editStoryTitle called');
    const input = document.getElementById('story-title-input');
    const display = document.getElementById('story-title-display');
    const storyTitleSection = document.getElementById('story-title-section');
    const text = document.getElementById('story-title-text');

    if (!input || !display || !storyTitleSection || !text) {
        console.error('Story pointing elements missing:', { input, display, storyTitleSection, text });
        alert('Error: Story pointing elements not found. Check console.');
        return;
    }

    input.value = text.textContent;
    display.style.display = 'none';
    storyTitleSection.style.display = 'block';
}

function updateSizingOptions() {
    console.log('updateSizingOptions called');
    const method = document.getElementById('sizing-method').value;
    const voteOptions = document.getElementById('vote-options');
    const votingSection = document.getElementById('voting-section');

    if (!method || !voteOptions || !votingSection) {
        console.error('Sizing method elements missing:', { method, voteOptions, votingSection });
        alert('Error: Sizing method elements not found. Check console.');
        return;
    }

    voteOptions.innerHTML = '<option value="">Select a size...</option>';

    if (method === 'fibonacci') {
        const fibOptions = [1, 2, 3, 5, 8, 13, 21];
        fibOptions.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            voteOptions.appendChild(option);
        });
    } else if (method === 'tshirt') {
        const tshirtOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
        tshirtOptions.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt;
            option.textContent = opt;
            voteOptions.appendChild(option);
        });
    }

    votingSection.style.display = 'block';
    saveAppState();
}

function submitVote() {
    console.log('submitVote called');
    const voteOptions = document.getElementById('vote-options');
    const vote = voteOptions.value;

    if (!vote) {
        alert('Please select a size to vote.');
        return;
    }

    storyPointingVotes.push(vote);
    displayVoteResults();
    saveAppState();
}

function displayVoteResults() {
    console.log('displayVoteResults called');
    const resultsList = document.getElementById('vote-results-list');
    const summary = document.getElementById('vote-summary');

    if (!resultsList || !summary) {
        console.error('Vote results elements missing:', { resultsList, summary });
        return;
    }

    resultsList.innerHTML = '';
    storyPointingVotes.forEach((vote, index) => {
        const li = document.createElement('li');
        li.textContent = `Vote ${index + 1}: ${vote}`;
        resultsList.appendChild(li);
    });

    if (storyPointingVotes.length > 0) {
        const method = document.getElementById('sizing-method').value;
        if (method === 'fibonacci') {
            const average = storyPointingVotes.reduce((sum, vote) => sum + parseInt(vote), 0) / storyPointingVotes.length;
            const closestFib = [1, 2, 3, 5, 8, 13, 21].reduce((prev, curr) => Math.abs(curr - average) < Math.abs(prev - average) ? curr : prev);
            summary.textContent = `Average: ${average.toFixed(1)}, Suggested Fibonacci: ${closestFib}`;
        } else {
            const voteCounts = {};
            storyPointingVotes.forEach(vote => {
                voteCounts[vote] = (voteCounts[vote] || 0) + 1;
            });
            const mostCommon = Object.keys(voteCounts).reduce((a, b) => voteCounts[a] > voteCounts[b] ? a : b);
            summary.textContent = `Most common size: ${mostCommon} (${voteCounts[mostCommon]} votes)`;
        }
    } else {
        summary.textContent = 'No votes yet.';
    }
}

function resetStoryPointing() {
    console.log('resetStoryPointing called');
    const storyTitleSection = document.getElementById('story-title-section');
    const storyTitleDisplay = document.getElementById('story-title-display');
    const storyTitleInput = document.getElementById('story-title-input');
    const sizingMethodSection = document.getElementById('sizing-method-section');
    const sizingMethod = document.getElementById('sizing-method');
    const votingSection = document.getElementById('voting-section');
    const voteOptions = document.getElementById('vote-options');
    const resultsList = document.getElementById('vote-results-list');
    const summary = document.getElementById('vote-summary');

    if (!storyTitleSection || !storyTitleDisplay || !storyTitleInput || !sizingMethodSection || !sizingMethod || !votingSection || !voteOptions || !resultsList || !summary) {
        console.error('Story pointing reset elements missing:', { storyTitleSection, storyTitleDisplay, storyTitleInput, sizingMethodSection, sizingMethod, votingSection, voteOptions, resultsList, summary });
        return;
    }

    storyTitleSection.style.display = 'block';
    storyTitleDisplay.style.display = 'none';
    storyTitleInput.value = '';
    sizingMethodSection.style.display = 'none';
    sizingMethod.value = '';
    votingSection.style.display = 'none';
    voteOptions.innerHTML = '<option value="">Select a size...</option>';
    storyPointingVotes = [];
    resultsList.innerHTML = '';
    summary.textContent = 'No votes yet.';
    saveAppState();
}

function returnToMainMenuFromStoryPointing() {
    console.log('returnToMainMenuFromStoryPointing called');
    document.getElementById('story-pointing-section').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
}

// Lean Coffee Functions
function startLeanCoffee() {
    console.log('startLeanCoffee called');
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('lean-coffee-section').style.display = 'block';
    resetTokens();
}

function prepopulateLeanCoffeeColumns() {
    console.log('prepopulateLeanCoffeeColumns called');
    const preset = document.getElementById('lean-coffee-presets').value;
    const customForm = document.getElementById('lean-coffee-custom-columns-form');

    if (!preset || !customForm) {
        console.error('Preset or custom form missing:', { preset, customForm });
        alert('Error: Preset or custom form not found. Check console.');
        return;
    }

    customForm.style.display = preset === 'custom' ? 'flex' : 'none';

    if (preset === 'custom') return;

    if (!preset) return;

    const container = document.getElementById('lean-coffee-columns-container');
    if (!container) {
        console.error('Lean Coffee columns container not found');
        return;
    }

    if (container.children.length > 0) {
        if (!confirm('This will clear existing columns. Continue?')) {
            document.getElementById('lean-coffee-presets').value = '';
            return;
        }
        container.innerHTML = '';
        leanCoffeeColumnCount = 0;
    }

    const presets = {
        'start-stop-continue': ['Start', 'Stop', 'Continue'],
        'well-didnt-improve': ['What Went Well', 'What Didn\'t', 'What to Improve'],
        'mad-sad-glad': ['Mad', 'Sad', 'Glad'],
        'lean-coffee': ['To Discuss', 'Discussing', 'Discussed'],
        'liked-learned-lacked-longed': ['Liked', 'Learned', 'Lacked', 'Longed For'],
        'four-ls': ['Liked', 'Learned', 'Lacked', 'Longed For'],
        'keep-add-drop': ['Keep', 'Add', 'Drop'],
        'plus-delta': ['Plus', 'Delta'],
        'kalms': ['Keep', 'Add', 'Less', 'More'],
        'stop-start-continue': ['Stop', 'Start', 'Continue'],
        'sailboat': ['Winds', 'Anchors', 'Rocks', 'Island'],
        'hot-air-balloon': ['Fuel', 'Weights', 'Sky', 'Ground'],
        'starfish': ['Start', 'Stop', 'Continue', 'Do More', 'Do Less'],
        'car-retrospective': ['Engine', 'Brakes', 'Road Ahead'],
        'garden': ['Flowers', 'Weeds', 'Fertilizer'],
        'space-mission': ['Launch', 'Orbit', 'Gravity', 'Stars'],
        'pirate-ship': ['Sails', 'Storms', 'Treasure', 'Sharks'],
        'mountain-climb': ['Peak', 'Base', 'Gear', 'Obstacles'],
        'movie-set': ['Action', 'Cut', 'Script', 'Props'],
        'weather-report': ['Sunny', 'Cloudy', 'Stormy', 'Forecast'],
        'team-health': ['Energy', 'Trust', 'Clarity'],
        'energy-levels': ['High', 'Low', 'Recharge'],
        'trust-circle': ['Safe', 'Risky', 'Build'],
        'communication-flow': ['Clear', 'Blocked', 'Improve'],
        'collaboration-check': ['Synergy', 'Silos', 'Bridges'],
        'roles-and-goals': ['Defined', 'Unclear', 'Align'],
        'feedback-loop': ['Given', 'Received', 'Action'],
        'team-vibe': ['Positive', 'Tense', 'Boost'],
        'workload-balance': ['Light', 'Heavy', 'Adjust'],
        'celebration': ['Wins', 'Challenges', 'Cheers'],
        'superhero': ['Superhero (Powers, Kryptonite, Mission)'],
        'time-machine': ['Past', 'Present', 'Future'],
        'zoo': ['Lions', 'Snakes', 'Monkeys'],
        'circus': ['Acts', 'Clowns', 'Audience'],
        'music-festival': ['Headliners', 'Backstage', 'Crowd'],
        'art-gallery': ['Masterpieces', 'Sketches', 'Frames'],
        'cooking-show': ['Ingredients', 'Recipe', 'Taste'],
        'olympics': ['Gold', 'Silver', 'Bronze'],
        'space-exploration': ['Stars', 'Black Holes', 'Planets'],
        'road-trip': ['Destination', 'Detours', 'Fuel'],
        'treasure-hunt': ['Map', 'Clues', 'Treasure'],
        'game-show': ['Wins', 'Challenges', 'Prizes'],
        'fashion-show': ['Runway', 'Designs', 'Audience'],
        'magic-show': ['Tricks', 'Illusions', 'Reveal'],
        'science-experiment': ['Hypothesis', 'Results', 'Conclusions'],
        'detective-case': ['Clues', 'Suspects', 'Solve'],
        'campfire': ['Stories', 'Sparks', 'Warmth'],
        'world-tour': ['Stops', 'Highlights', 'Memories'],
        'puzzle': ['Pieces', 'Fit', 'Missing']
    };

    presets[preset].forEach(name => addLeanCoffeeColumn(name));
    document.getElementById('lean-coffee-presets').value = '';
    resetTokens();
}

function createLeanCoffeeCustomColumns() {
    console.log('createLeanCoffeeCustomColumns called');
    const container = document.getElementById('lean-coffee-columns-container');
    const column1 = document.getElementById('lean-coffee-custom-column-1').value.trim();
    const column2 = document.getElementById('lean-coffee-custom-column-2').value.trim();
    const column3 = document.getElementById('lean-coffee-custom-column-3').value.trim();
    const customColumns = [column1, column2, column3].filter(name => name !== '');

    if (!container) {
        console.error('Lean Coffee columns container not found');
        return;
    }

    if (customColumns.length === 0) {
        alert('Please enter at least one column name.');
        return;
    }

    if (container.children.length > 0) {
        if (!confirm('This will clear existing columns. Continue?')) {
            return;
        }
        container.innerHTML = '';
        leanCoffeeColumnCount = 0;
    }

    customColumns.forEach(name => addLeanCoffeeColumn(name));
    document.getElementById('lean-coffee-custom-columns-form').style.display = 'none';
    document.getElementById('lean-coffee-presets').value = '';
    document.getElementById('lean-coffee-custom-column-1').value = '';
    document.getElementById('lean-coffee-custom-column-2').value = '';
    document.getElementById('lean-coffee-custom-column-3').value = '';
    resetTokens();
}

function addLeanCoffeeColumn(name = `New Column ${leanCoffeeColumnCount + 1}`) {
    console.log('addLeanCoffeeColumn called', name);
    leanCoffeeColumnCount++;
    const container = document.getElementById('lean-coffee-columns-container');
    const columnId = `lean-coffee-column-${leanCoffeeColumnCount}`;

    if (!container) {
        console.error('Lean Coffee columns container not found');
        return;
    }

    const column = document.createElement('div');
    column.className = 'column';
    column.id = columnId;
    column.setAttribute('draggable', 'true');

    const normalizedName = name.toLowerCase();
    if (normalizedName.includes('start') || normalizedName.includes('to discuss') || normalizedName.includes('liked') || normalizedName.includes('keep') || normalizedName.includes('plus') || normalizedName.includes('winds') || normalizedName.includes('fuel') || normalizedName.includes('energy') || normalizedName.includes('trust') || normalizedName.includes('wins')) column.classList.add('start');
    else if (normalizedName.includes('stop') || normalizedName.includes('discussing') || normalizedName.includes('lacked') || normalizedName.includes('drop') || normalizedName.includes('delta') || normalizedName.includes('anchors') || normalizedName.includes('weights') || normalizedName.includes('risky') || normalizedName.includes('challenges')) column.classList.add('stop');
    else if (normalizedName.includes('continue') || normalizedName.includes('discussed') || normalizedName.includes('learned') || normalizedName.includes('add') || normalizedName.includes('rocks') || normalizedName.includes('sky') || normalizedName.includes('build') || normalizedName.includes('cheers')) column.classList.add('continue');

    const header = document.createElement('h3');
    header.id = `${columnId}-name`;
    header.textContent = name;
    column.appendChild(header);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit';
    editButton.onclick = () => toggleEditLeanCoffeeColumnName(columnId);
    column.appendChild(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete';
    deleteButton.onclick = () => {
        if (confirm('Are you sure you want to delete this column and all its feedback?')) {
            column.remove();
            saveAppState();
        }
    };
    column.appendChild(deleteButton);

    const editSection = document.createElement('div');
    editSection.className = 'column-edit';
    editSection.id = `${columnId}-edit`;
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.id = `${columnId}-input`;
    editInput.placeholder = 'Enter column name...';
    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.onclick = () => saveLeanCoffeeColumnName(columnId);
    editSection.appendChild(editInput);
    editSection.appendChild(saveButton);
    column.appendChild(editSection);

    const feedbackInput = document.createElement('input');
    feedbackInput.type = 'text';
    feedbackInput.className = 'column-feedback-input';
    feedbackInput.id = `${columnId}-feedback-input`;
    feedbackInput.placeholder = 'Add feedback...';
    column.appendChild(feedbackInput);

    const feedbackButton = document.createElement('button');
    feedbackButton.textContent = 'Add';
    feedbackButton.onclick = () => addLeanCoffeeColumnFeedback(columnId);
    column.appendChild(feedbackButton);

    const feedbackList = document.createElement('ul');
    feedbackList.className = 'column-feedback-list';
    feedbackList.id = `${columnId}-feedback-list`;
    column.appendChild(feedbackList);

    container.appendChild(column);
    saveAppState();
}

function toggleEditLeanCoffeeColumnName(columnId) {
    console.log(`toggleEditLeanCoffeeColumnName called for ${columnId}`);
    const editSection = document.getElementById(`${columnId}-edit`);
    const editButton = document.querySelector(`#${columnId} button.edit`);
    const nameInput = document.getElementById(`${columnId}-input`);
    const nameDisplay = document.getElementById(`${columnId}-name`);

    if (!editSection || !editButton || !nameInput || !nameDisplay) {
        console.error(`Lean Coffee column elements missing for ${columnId}:`, { editSection, editButton, nameInput, nameDisplay });
        alert(`Error: Lean Coffee column elements not found for ${columnId}. Check console.`);
        return;
    }

    const isEditVisible = editSection.style.display === 'block';
    editSection.style.display = isEditVisible ? 'none' : 'block';
    editButton.style.display = isEditVisible ? 'inline-block' : 'none';
    if (!isEditVisible) {
        nameInput.value = nameDisplay.textContent;
    }
}

function saveLeanCoffeeColumnName(columnId) {
    console.log(`saveLeanCoffeeColumnName called for ${columnId}`);
    const input = document.getElementById(`${columnId}-input`);
    const nameDisplay = document.getElementById(`${columnId}-name`);
    const column = document.getElementById(columnId);
    const newName = input.value.trim();

    if (!input || !nameDisplay || !column) {
        console.error('Lean Coffee column elements missing:', { input, nameDisplay, column });
        alert('Error: Lean Coffee column elements not found. Check console.');
        return;
    }

    if (newName !== '') {
        nameDisplay.textContent = newName;
        column.classList.remove('start', 'stop', 'continue');
        const normalizedName = newName.toLowerCase();
        if (normalizedName.includes('start') || normalizedName.includes('to discuss') || normalizedName.includes('liked') || normalizedName.includes('keep') || normalizedName.includes('plus') || normalizedName.includes('winds') || normalizedName.includes('fuel') || normalizedName.includes('energy') || normalizedName.includes('trust') || normalizedName.includes('wins')) column.classList.add('start');
        else if (normalizedName.includes('stop') || normalizedName.includes('discussing') || normalizedName.includes('lacked') || normalizedName.includes('drop') || normalizedName.includes('delta') || normalizedName.includes('anchors') || normalizedName.includes('weights') || normalizedName.includes('risky') || normalizedName.includes('challenges')) column.classList.add('stop');
        else if (normalizedName.includes('continue') || normalizedName.includes('discussed') || normalizedName.includes('learned') || normalizedName.includes('add') || normalizedName.includes('rocks') || normalizedName.includes('sky') || normalizedName.includes('build') || normalizedName.includes('cheers')) column.classList.add('continue');
        toggleEditLeanCoffeeColumnName(columnId);
        saveAppState();
    } else {
        alert('Please enter a column name.');
    }
}

function addLeanCoffeeColumnFeedback(columnId) {
    console.log(`addLeanCoffeeColumnFeedback called for ${columnId}`);
    const input = document.getElementById(`${columnId}-feedback-input`);
    const feedbackList = document.getElementById(`${columnId}-feedback-list`);
    const feedbackText = input.value.trim();

    if (!input || !feedbackList) {
        console.error('Lean Coffee feedback elements missing:', { input, feedbackList });
        alert('Error: Lean Coffee feedback elements not found. Check console.');
        return;
    }

    if (feedbackText !== '') {
        const li = document.createElement('li');
        const voteCount = document.createElement('span');
        voteCount.textContent = '0';
        voteCount.style.marginRight = '10px';
        voteCount.className = 'vote-count';
        const voteTokenBtn = document.createElement('button');
        voteTokenBtn.textContent = 'Vote';
        voteTokenBtn.className = 'vote-token-btn';
        voteTokenBtn.onclick = () => {
            if (tokensRemaining > 0) {
                voteCount.textContent = parseInt(voteCount.textContent) + 1;
                tokensRemaining--;
                updateTokenCounter();
                if (tokensRemaining === 0) {
                    disableAllVoteButtons();
                }
                saveAppState();
            } else {
                alert('You have used all your tokens!');
            }
        };
        li.appendChild(voteCount);
        li.appendChild(voteTokenBtn);
        li.appendChild(document.createTextNode(` ${feedbackText}`));
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => {
            li.remove();
            saveAppState();
        };
        li.appendChild(deleteBtn);
        feedbackList.appendChild(li);
        input.value = '';
        saveAppState();
    } else {
        alert('Please enter feedback before adding.');
    }
}

function returnToMainMenuFromLeanCoffee() {
    console.log('returnToMainMenuFromLeanCoffee called');
    document.getElementById('lean-coffee-section').style.display = 'none';
    document.getElementById('main-menu').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('columns-container');
    if (container) {
        container.addEventListener('dragstart', (e) => {
            const target = e.target.closest('.column');
            if (target) {
                target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', target.id);
            }
        });

        container.addEventListener('dragend', (e) => {
            const target = e.target.closest('.column');
            if (target) {
                target.classList.remove('dragging');
            }
        });

        container.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedId = e.dataTransfer.getData('text/plain');
            const draggedElement = document.getElementById(draggedId);
            const target = e.target.closest('.column');

            if (draggedElement && target && draggedElement !== target) {
                const allColumns = Array.from(container.children);
                const draggedIndex = allColumns.indexOf(draggedElement);
                const targetIndex = allColumns.indexOf(target);

                if (draggedIndex < targetIndex) {
                    container.insertBefore(draggedElement, target.nextSibling);
                } else {
                    container.insertBefore(draggedElement, target);
                }
                saveAppState();
            }
        });

        let touchTarget = null;
        let touchStartX = 0;
        let touchStartY = 0;

        container.addEventListener('touchstart', (e) => {
            const target = e.target.closest('.column');
            if (target) {
                touchTarget = target;
                touchTarget.classList.add('dragging');
                const touch = e.touches[0];
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
                e.preventDefault();
            }
        });

        container.addEventListener('touchmove', (e) => {
            if (touchTarget) {
                const touch = e.touches[0];
                const deltaX = touch.clientX - touchStartX;
                const deltaY = touch.clientY - touchStartY;
                touchTarget.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                e.preventDefault();
            }
        });

        container.addEventListener('touchend', (e) => {
            if (touchTarget) {
                touchTarget.classList.remove('dragging');
                touchTarget.style.transform = 'translate(0, 0)';

                const touch = e.changedTouches[0];
                const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.column');

                if (dropTarget && dropTarget !== touchTarget) {
                    const allColumns = Array.from(container.children);
                    const draggedIndex = allColumns.indexOf(touchTarget);
                    const targetIndex = allColumns.indexOf(dropTarget);

                    if (draggedIndex < targetIndex) {
                        container.insertBefore(touchTarget, dropTarget.nextSibling);
                    } else {
                        container.insertBefore(touchTarget, dropTarget);
                    }
                    saveAppState();
                }

                touchTarget = null;
            }
        });
    }

    const leanCoffeeContainer = document.getElementById('lean-coffee-columns-container');
    if (leanCoffeeContainer) {
        leanCoffeeContainer.addEventListener('dragstart', (e) => {
            const target = e.target.closest('.column');
            if (target) {
                target.classList.add('dragging');
                e.dataTransfer.setData('text/plain', target.id);
            }
        });

        leanCoffeeContainer.addEventListener('dragend', (e) => {
            const target = e.target.closest('.column');
            if (target) {
                target.classList.remove('dragging');
            }
        });

        leanCoffeeContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        leanCoffeeContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedId = e.dataTransfer.getData('text/plain');
            const draggedElement = document.getElementById(draggedId);
            const target = e.target.closest('.column');

            if (draggedElement && target && draggedElement !== target) {
                const allColumns = Array.from(leanCoffeeContainer.children);
                const draggedIndex = allColumns.indexOf(draggedElement);
                const targetIndex = allColumns.indexOf(target);

                if (draggedIndex < targetIndex) {
                    leanCoffeeContainer.insertBefore(draggedElement, target.nextSibling);
                } else {
                    leanCoffeeContainer.insertBefore(draggedElement, target);
                }
                saveAppState();
            }
        });

        let touchTarget = null;
        let touchStartX = 0;
        let touchStartY = 0;

        leanCoffeeContainer.addEventListener('touchstart', (e) => {
            const target = e.target.closest('.column');
            if (target) {
                touchTarget = target;
                touchTarget.classList.add('dragging');
                const touch = e.touches[0];
                touchStartX = touch.clientX;
                touchStartY = touch.clientY;
                e.preventDefault();
            }
        });

        leanCoffeeContainer.addEventListener('touchmove', (e) => {
            if (touchTarget) {
                const touch = e.touches[0];
                const deltaX = touch.clientX - touchStartX;
                const deltaY = touch.clientY - touchStartY;
                touchTarget.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
                e.preventDefault();
            }
        });

        leanCoffeeContainer.addEventListener('touchend', (e) => {
            if (touchTarget) {
                touchTarget.classList.remove('dragging');
                touchTarget.style.transform = 'translate(0, 0)';

                const touch = e.changedTouches[0];
                const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.column');

                if (dropTarget && dropTarget !== touchTarget) {
                    const allColumns = Array.from(leanCoffeeContainer.children);
                    const draggedIndex = allColumns.indexOf(touchTarget);
                    const targetIndex = allColumns.indexOf(dropTarget);

                    if (draggedIndex < targetIndex) {
                        leanCoffeeContainer.insertBefore(touchTarget, dropTarget.nextSibling);
                    } else {
                        leanCoffeeContainer.insertBefore(touchTarget, dropTarget);
                    }
                    saveAppState();
                }

                touchTarget = null;
            }
        });
    }

    console.log('DOM fully loaded');
    console.log('Checking for room-name-section:', document.getElementById('room-name-section'));
    const editButton = document.getElementById('edit-room-name');
    if (editButton) {
        console.log('Edit button found');
        editButton.addEventListener('click', toggleEditRoomName);
    } else {
        console.error('Edit button not found!');
        alert('Error: Edit button not found. Check console.');
    }
});

console.log('Script loaded');