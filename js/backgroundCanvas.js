const backgroundCanvas = document.querySelector("canvas#bg");
const backgroundCtx = backgroundCanvas.getContext("2d");
let canvasRenderF = null;

function playVideo(e, video) {
  console.log("lol");
  if(käyty) return;
  käyty = true;
  let ctx = new AudioContext();
  let audio = video.current;
  let audioSrc = ctx.createMediaElementSource(audio);
  let analyser = ctx.createAnalyser();
  audio.volume = 0.1;
  // we have to connect the MediaElementSource with the analyser 
  audioSrc.connect(analyser);
  audioSrc.connect(ctx.destination);

  // analyser.minDecibels = -90;
  // analyser.maxDecibels = 0;
  analyser.fftSize = 4096;
  analyser.smoothingTimeConstant = .9;
  // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
 
  // frequencyBinCount tells you how many values you'll receive from the analyser
  let frequencyData = new Uint8Array(analyser.frequencyBinCount);

  const canvas = document.querySelector("canvas");
  const ctx2 = canvas.getContext("2d");
 
  // we're ready to receive some data!
  // loop
  function renderFrame() {
      requestAnimationFrame(renderFrame);
      const gap = 2;
      const fixedWith = 5;
      const total = (gap + fixedWith);
      // update data in frequencyData
      // analyser.getByteFrequencyData(frequencyData);
      analyser.getByteTimeDomainData(frequencyData);
      const barAmount = Math.ceil(window.innerWidth / total);
      const steps = Math.ceil(frequencyData.length / barAmount);
      // const barAmount = Math.ceil(frequencyData.length / (fixedWith + gap));
      // const width = Math.max(window.innerWidth / (frequencyData.length / gap) * 2.5 - 1, 2);
      canvas.width = barAmount * total - gap;
      console.log(frequencyData.length)
      // render frame based on values in frequencyData
      // console.log(frequencyData)
      // console.log(frequencyData.length)
      let barY = 0;
      for(let i = 0; i < frequencyData.length; i+=steps) {
        let num = 0;
        // for(let j = 0; j < steps; j++) num += frequencyData[i + j] || 0;
        for(let j = 0; j < steps; j++) num = Math.max(frequencyData[i + j], num);
        // const value = num / steps;
        const value = num;

        ctx2.fillStyle = `rgb(${255}, ${255}, ${255})`;
        ctx2.fillRect(barY * total, 0, fixedWith, Math.max(value * 2, 10));
        barY++;
      }
  }
  audio.play();
  renderFrame();
};

function renderBackgroundCanvas() {
	const gap = 2;
	const fixedWith = 5;
	const total = (gap + fixedWith);
	// update data in frequencyData
	analyser.getByteFrequencyData(frequencyData);
	// analyser.getByteTimeDomainData(frequencyData);
	const barAmount = Math.ceil(window.innerWidth / total);
	const steps = Math.ceil(frequencyData.length / barAmount);
	// const barAmount = Math.ceil(frequencyData.length / (fixedWith + gap));
	// const width = Math.max(window.innerWidth / (frequencyData.length / gap) * 2.5 - 1, 2);
	backgroundCanvas.width = barAmount * total - gap;
	console.log(frequencyData.length)
	// render frame based on values in frequencyData
	// console.log(frequencyData)
	// console.log(frequencyData.length)
	let barY = 0;
	for(let i = 0; i < frequencyData.length; i+=steps) {
		let num = 0;
		// for(let j = 0; j < steps; j++) num += frequencyData[i + j] || 0;
		for(let j = 0; j < steps; j++) num = Math.max(frequencyData[i + j], num);
		// const value = num / steps;
		const value = num;

		backgroundCtx.fillStyle = `rgb(${255}, ${255}, ${255})`;
		backgroundCtx.fillRect(barY * total, 0, fixedWith, Math.max(value * 2, 10));
		barY++;
	}
}

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
	
		// update data in frequencyData
		analyser.getByteFrequencyData(frequencyData);
		// analyser.getByteTimeDomainData(frequencyData);
		const barAmount = Math.floor(window.innerWidth / total);
		const blockSize = Math.max(Math.floor((frequencyData.length - 500) / barAmount), 1);
		// const barAmount = Math.ceil(frequencyData.length / (fixedWith + gap));
		// const width = Math.max(window.innerWidth / (frequencyData.length / gap) * 2.5 - 1, 2);
		backgroundCanvas.width = (window.innerWidth - window.innerWidth % total) - gap;
		// console.log(frequencyData.length);
	
		// render frame based on values in frequencyData
		// console.log(frequencyData)
		// console.log(frequencyData.length)
		// let barY = 0;
		// for(let i = 0; i < frequencyData.length; i+=blockSize) {
		// 	let num = 0;
		// 	// for(let j = 0; j < steps; j++) num += frequencyData[i + j] || 0;
		// 	for(let j = 0; j < blockSize; j++) num = Math.max(frequencyData[i + j], num);
		// 	// const value = num / steps;
		// 	const value = num;
	
		// 	backgroundCtx.fillStyle = `rgb(${255}, ${255}, ${255})`;
		// 	backgroundCtx.fillRect(barY * total, 0, barWidth, Math.max(value * 2, 10));
		// 	barY++;
		// }
	
		for(let i = 0; i < barAmount; i++) {
			const blockStart = blockSize * i;
			let sum = 0;
			for (let j = 0; j < blockSize; j++) {
				sum += Math.abs(frequencyData[blockStart + j]) 
			}
	
			const value = sum / blockSize;
			backgroundCtx.fillStyle = `rgb(${255}, ${255}, ${255})`;
			backgroundCtx.fillStyle = `hsl(${Math.round(i / barAmount * 360)}deg 70% 60%)`;
			backgroundCtx.fillRect(i * total, 0, barWidth, Math.max(value * 2, 2));
		}
	}
}, {once: true});

