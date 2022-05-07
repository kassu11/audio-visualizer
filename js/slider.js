const sliderContainer = document.querySelector(".slider-container");
const sliderBG = sliderContainer.querySelector(".slider-bg");
const sliderFill = sliderContainer.querySelector(".slider-fill");
const sliderBall = sliderContainer.querySelector(".slider-ball");
const sliderHover = sliderContainer.querySelector(".slider-hover");

const currentTime = sliderContainer.querySelector(".current-time");
const duration = sliderContainer.querySelector(".duration");

function updateAudioTimeToSlider() {
	if(videoElem.paused || videoElem.ended || !videoElem.duration) return;
	const value = videoElem.currentTime / videoElem.duration;

	setSliderValue(value);
}

function setSliderValue(value) {
	const v = Math.min(Math.max(value, 0), 1);
	sliderFill.style.width = `${v * 100}%`;
	sliderBall.style.left = `${v * 100}%`;
	sliderHover.style.left = `${v * 100}%`;

	currentTime.textContent = formatTime(videoElem.duration * v);
}

function setAudioTime(value) {
	const time = videoElem.duration * value;
	videoElem.currentTime = time;
}

sliderContainer.addEventListener("mousedown", e => {
	e.preventDefault();
	if(videoElem.src == "") return;
	console.log(videoElem.src);
	window.onmousemove = mouseMove;
	window.onmouseup = mouseUp;

	const {left, width} = sliderContainer.getBoundingClientRect();
	const wasPlaying = !videoElem.paused;
	if(!videoElem.ended) videoElem.pause();

	mouseMove(e); // Update on click

	function mouseMove(e) {
		const value = (e.clientX - left) / width;
		setSliderValue(value);
	}

	function mouseUp(e) {
		const value = (e.clientX - left) / width;
		
		setAudioTime(value);
		setSliderValue(value);
		
		window.onmouseup = null;
		window.onmousemove = null;
		if(wasPlaying) videoElem.play();
	}
});

function formatTime(time) {
	const seconds = Math.floor(time % 60).toString().padStart(2, "0");
	const minutes = Math.floor(time / 60);
	const hours = Math.floor(minutes / 60);
	if(hours) return `${hours}:${(minutes % 60).toString().padStart(2, "0")}:${seconds}`;
	return `${minutes}:${seconds}`;
}