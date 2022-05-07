const volumeSliderContainerElem = document.querySelector(".volume-slider-container");
const volumeSliderBg = document.querySelector(".volume-slider-bg");
const volumeSliderFill = document.querySelector(".volume-slider-fill");
const volumeSliderBall = document.querySelector(".volume-slider-ball");

pauseButton.addEventListener("click", e => {
	if(videoElem.src == "") return;

	if(videoElem.paused) videoElem.play();
	else videoElem.pause();
	updatePauseButton();
});

function updatePauseButton() {
	pauseButton.classList.toggle("pause", !videoElem.paused);
	pauseButton.classList.toggle("play", videoElem.paused);
}

prevButton.addEventListener("click", e => {
	if(playIndex == 0) playIndex = allUploadedFiles.length;
	playIndex--;
	setAudioTrack(playIndex);
});

nextButton.addEventListener("click", e => {
	playIndex++;
	if(playIndex == allUploadedFiles.length) playIndex = 0;
	setAudioTrack(playIndex);
});

videoElem.addEventListener("ended", e => {
	nextButton.click();
});

volumeSliderContainerElem.addEventListener("mousedown", e => {
	e.preventDefault();
	window.onmousemove = mouseMove;
	window.onmouseup = mouseUp;

	const {left, width} = volumeSliderContainerElem.getBoundingClientRect();

	mouseMove(e); // Update on click

	function mouseMove(e) {
		const value = (e.clientX - left) / width;
		setAudioSliderValue(value);
	}

	function mouseUp(e) {
		const value = (e.clientX - left) / width;
		setAudioSliderValue(value);
		
		window.onmouseup = null;
		window.onmousemove = null;
	}
});

function setAudioSliderValue(value) {
	const v = Math.min(Math.max(value, 0), 1);
	volumeSliderFill.style.width = `${v * 100}%`;
	volumeSliderBall.style.left = `${v * 100}%`;

	videoElem.volume = v;
}


window.addEventListener("keydown", e => {
	if(e.code === "Space") pauseButton.click();
});