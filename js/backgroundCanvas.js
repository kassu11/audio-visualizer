const backgroundCanvas = document.querySelector("canvas#bg");
const backgroundCtx = backgroundCanvas.getContext("2d");
let canvasRenderF = null;

videoElem.addEventListener("play", e => {
	const audioCtx = new AudioContext();
	const audioSrc = audioCtx.createMediaElementSource(videoElem);
	const analyser = audioCtx.createAnalyser();
	
	audioSrc.connect(analyser);
	audioSrc.connect(audioCtx.destination);
	
	analyser.fftSize = 4096;
	analyser.smoothingTimeConstant = 0.9;
	const frequencyData = new Uint8Array(analyser.frequencyBinCount);

	canvasRenderF = renderBackgroundCanvas2;

	function renderBackgroundCanvas2() {
		const gap = 2;
		const barWidth = 10;
		const total = (gap + barWidth);
		const minSaturation = 80;
	
		analyser.getByteFrequencyData(frequencyData);
		const barAmount = Math.floor(window.innerWidth / total);
		const blockSize = Math.max(Math.floor((frequencyData.length - 500) / barAmount), 1);
		backgroundCanvas.width = (window.innerWidth - window.innerWidth % total) - gap;

		for(let i = 0; i < barAmount; i++) {
			const blockStart = blockSize * i;
			let sum = 0;
			for (let j = 0; j < blockSize; j++) {
				sum += Math.abs(frequencyData[blockStart + j]) 
			}
	
			const value = sum / blockSize;
			backgroundCtx.fillStyle = `hsl(${Math.round(i / barAmount * 360)}deg 70% 60%)`;
			backgroundCtx.fillRect(i * total, 0, barWidth, Math.max(value * 2, 2));
		}
	}
}, {once: true});

