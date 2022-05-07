function render() {
	
	updateAudioTimeToSlider(sliderContainer, videoElem);
	requestAnimationFrame(render);
}

requestAnimationFrame(render);