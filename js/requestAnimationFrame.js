function render() {
	
	updateAudioTimeToSlider(sliderContainer, videoElem);
	canvasRenderF?.();
	audioWaveAnimationF?.();



	requestAnimationFrame(render);
}

requestAnimationFrame(render);