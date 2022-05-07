pauseButton.addEventListener("click", e => {
	if(videoElem.paused) {
		videoElem.play();
		pauseButton.classList.remove("paused");
	} else {
		videoElem.pause();
		pauseButton.classList.add("paused");
	}
});

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