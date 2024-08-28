//Get Element
const player = document.querySelector(".player");
const video = document.querySelector(".viewer");
const progress = document.querySelector(".progress");
const progressBar = document.querySelector(".progress__filled");
const toggle = document.querySelector(".toggle");
const ranges = document.querySelectorAll(".player__slider");
const skipButtons = document.querySelectorAll("[data-skip]");
//build function
function togglePlay() {
    const method = video.paused ? "play" : "pause";
    video[method]();
}

function updateButton() {
    const icon = this.paused ? "►" : "❚ ❚";
    toggle.textContent = icon;
}

function skip() {
    video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
    console.log(this.value);
    video[this.name] = this.value;
}

// const getCurrentTime = setInterval(() => {
//     const currentPercent = (video.currentTime / video.duration) * 100;
//     progressBar.style.setProperty(`flex-basis`, currentPercent + `%`);
//     console.log(currentPercent);
// }, 500);

function handleProgress() {
    const currentPercent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${currentPercent}%`;
}

function scrub(e) {
    video.currentTime = e.offsetX;
}

function scrubWhenMousemove(mousedown) {
    if (mousedown) {
        scrub();
    }
}

function openFullScreen() {
    if (!document.fullscreenElement) {
        player.requestFullscreen();
    }
}

function closeFullScreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
}

//event listener
video.addEventListener("click", togglePlay);
video.addEventListener("play", updateButton);
video.addEventListener("pause", updateButton);
video.addEventListener("timeupdate", handleProgress);

toggle.addEventListener("click", togglePlay);
skipButtons.forEach((button) => button.addEventListener("click", skip));
ranges.forEach((range) => range.addEventListener("input", handleRangeUpdate));

let mousedown = false;
progress.addEventListener("click", scrub);
progress.addEventListener("mousedown", () => (mousedown = true));
progress.addEventListener("mouseup", () => (mousedown = false));
progress.addEventListener("mouseout", () => (mousedown = false));
progress.addEventListener("mousemove", (e) => {
    if (mousedown) {
        scrub(e);
    }
});

video.addEventListener("dblclick", openFullScreen);
video.addEventListener("dblclick", closeFullScreen);
