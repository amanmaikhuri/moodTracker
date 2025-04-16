// Utility for DOM selection
const $ = (selector, err) => {
    const el = document.querySelector(selector);
    if (!el && err !== false) console.error(err || `Missing ${selector}`);
    return el;
};

const dom = {
    moodToday: $("#mood-options"),
    thoughts: $("#text-box"),
    submitbtn: $("#submit-btn"),
    deletebtn: $("#delete-btn"),
    logHistory: $("#log-history")
};

// App state
const state = {
    logs: JSON.parse(localStorage.getItem("logs") || "[]"),
};

/* Add event listeners */
function addEvents() {
    dom.submitbtn?.addEventListener("click", saveLogs);
    dom.deletebtn?.addEventListener("dblclick", removeLogs);
    dom.logHistory?.addEventListener("click", handleLogActions);
}

function handleLogActions(e) {
    const btn = e.target.closest("button");
    if (!btn) return;

    const index = parseInt(btn.dataset.id, 10);
    if (isNaN(index)) {
        console.warn("Invalid index on log action");
        return;
    }

    if (btn.classList.contains("delete-entry")) deleteLog(index);
    if (btn.classList.contains("edit-entry")) editLog(index);
}

function saveLogs() {
    try {
        const mood = dom.moodToday?.value?.trim();
        const recordThoughts = dom.thoughts?.value?.trim();

        const log = {
            mood,
            recordThoughts,
            timeStamp: `${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`
        };

        if (!log.mood || !log.recordThoughts) {
            alert("Please fill all fields!");
            return;
        }

        state.logs.unshift(log);
        saveToLocalStorage("logs", state.logs);
        renderLogs();
        resetInputs();
    } catch (err) {
        console.error("Save error", err);
    }
}

function renderLogs() {
    try {
        if (!dom.logHistory) return;

        dom.logHistory.innerHTML = "";

        if (state.logs.length === 0) {
            dom.logHistory.innerHTML = "<p>No logs yet.</p>";
            return;
        }

        state.logs.forEach((log, i) => {
            const logContent = document.createElement("div");
            logContent.classList.add("log-content");


            logContent.innerHTML =`
             <p class="time"><span>[ Time-stamp: </span>${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()} ]</p>
            <p class="mood"><span>Mood: </span>${log.mood} ${getEmoji(log.mood)}</p>
            <p class="thoughts"><span>My Day: </span>${log.recordThoughts}</p>
            <div class="btn-group">
                <button data-id="${i}" class="edit-entry"><i class="fa-solid fa-pen-to-square"></i></button>
                <button data-id="${i}" class="delete-entry"><i class="fa-solid fa-trash"></i></button>
            </div>
            `;

            dom.logHistory.appendChild(logContent);
            dom.submitbtn.innerHTML ="Save My Day"
        });
    } catch (err) {
        console.error("Error rendering logs! Please try again", err);
    }
}

// Delete entry
function deleteLog(index) {
    try {
        if (isNaN(index) || index < 0 || index >= state.logs.length) {
            console.warn("Invalid index for deletion");
            return;
        }

        state.logs.splice(index, 1);
        saveToLocalStorage("logs", state.logs);
        renderLogs();
        console.log(`Deleted log at index ${index}`);
    } catch (err) {
        console.error("Error deleting log, please try again!", err);
    }
}

// Edit entry
function editLog(index) {
    try {
        if (isNaN(index) || index < 0 || index >= state.logs.length) {
            console.warn("Invalid index for edit");
            return;
        }

        const log = state.logs[index];
        if (dom.moodToday) dom.moodToday.value = log.mood;
        if (dom.thoughts) dom.thoughts.value = log.recordThoughts;
        dom.submitbtn.innerHTML ="Save Changes";
        // Remove temporarily to re-add after editing
        state.logs.splice(index, 1);
        saveToLocalStorage("logs", state.logs);
        renderLogs();
    } catch (err) {
        console.error("Error editing the day log! Please try again later!", err);
    }
}

// Define mood emojis
function getEmoji(mood) {
    const moodEmojis = {
        happy: "😃", excited: "🤩", cheerful: "😄", Grateful: "🙏😊", loved: "❤️", confident: "😎",
        motivated: "🚀💪", relaxed: "😌🧘‍♂️", inspired: "✨😃", hopeful: "🌟🙂", calm: "😌",
        thoughtful: "🤔", focused: "🎯😐", neutral: "😐", meh: "😑", tired: "😴", sad: "😢",
        stressed: "😫", angry: "😠", frustrated: "😤", anxious: "😟😰", depressed: "😔💔",
        heartbroken: "💔😞", annoyed: "😒", disappointed: "😞", silly: "🤪", mischievous: "😈",
        sarcastic: "🙃", goofy: "🤭", laughing: "😂🤣", "excited-hyper": "🤩🔥", romantic: "😘💕",
        flirty: "😉😍", cuddly: "🥰🤗", crush: "😍💘", blushing: "😊🥵", sick: "🤒🤢",
        sleepy: "💤😴", scared: "😨👻", shocked: "😱", nervous: "😬"
    };
    return moodEmojis[mood] || "❓";
}

function removeLogs() {
    if (confirm("Are you sure you want to remove all logs?")) {
        state.logs = [];
        localStorage.removeItem("logs");
        renderLogs();
    }
}

function resetInputs() {
    if (dom.moodToday) dom.moodToday.value = "neutral";
    if (dom.thoughts) dom.thoughts.value = "";
    dom.moodToday?.focus();
}

// Utility function for localStorage
function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// App initializer
function init() {
    addEvents();
    renderLogs();
}

document.addEventListener("DOMContentLoaded", init);
