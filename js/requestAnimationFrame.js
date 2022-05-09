function render() {
	
	updateAudioTimeToSlider(sliderContainer, videoElem);
	canvasRenderF?.();



	requestAnimationFrame(render);
}

requestAnimationFrame(render);