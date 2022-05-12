const waveCanvas = document.querySelector("canvas#audioWave");
const waveCanvasCtx = waveCanvas.getContext("2d");
let audioWaveAnimationF = null;
let audioWaveState = 200;

function audioWaveLoadingAnimation() {
  const {width} = sliderContainer.getBoundingClientRect();
  const bonusHeight = 6;
  const maxHeight = 22;

  const gap = 1;
  const barWidth = 2;
  const total = (gap + barWidth);
  const barAmount = Math.floor(width / total);

  waveCanvas.width = (width - width % total) - gap;
  waveCanvas.height = (maxHeight + bonusHeight) * 2;

  audioWaveState -= .02;

  for(let i = 0; i < barAmount; i++) {
    const value2 = Math.abs(Math.sin(i / 20 + audioWaveState)) * maxHeight + bonusHeight;
    // const value = (i + audioWaveState) % 20;
    // const value2 = value <= 1 ? 10 : value;
    waveCanvasCtx.fillStyle = `hsl(${Math.round(i / barAmount * 360)}deg 70% 80%)`;
    waveCanvasCtx.fillStyle = `#e0e0e0`;
    waveCanvasCtx.fillRect(i * total, maxHeight + bonusHeight - value2, barWidth, value2 * 2 + 1);
  }
}

function audioWaveLoad(index = 0) {
  const audioContext = new AudioContext();

  if(allUploadedFiles[index].audioWave) {
    visualize2(allUploadedFiles[index].audioWave);
    window.onresize = () => visualize2(allUploadedFiles[index].audioWave);
  } else {
    visualizeAudio2(index);
    audioWaveState = 200;
    audioWaveAnimationF = audioWaveLoadingAnimation;
  }

  function visualizeAudio2(index) {
    allUploadedFiles[index].file.arrayBuffer()
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      const data = audioBuffer.getChannelData(0);
      allUploadedFiles[index].audioWave = data;
      visualize2(data);
      window.onresize = () => visualize2(data);
    });
  }

  function filterData(rawData, samples = 250) {
    const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
    const filteredData = [];
    for (let i = 0; i < samples; i++) {
      let blockStart = blockSize * i; // the location of the first sample in the block
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum = sum + Math.abs(rawData[blockStart + j]) // find the sum of all the samples in the block
      }
      filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
    }
    return filteredData;
  }

  function normalizeData(filteredData) {
    const multiplier = Math.pow(Math.max(...filteredData), -1);
    return filteredData.map(n => n * multiplier);
  }

	function visualize2(audioBuffer) {
		const {width} = sliderContainer.getBoundingClientRect();
    audioWaveAnimationF = null;
    if(playIndex !== index) return;

		const bonusHeight = 6;
		const maxHeight = 22;

		const gap = 1;
		const barWidth = 2;
		const total = (gap + barWidth);
		const barAmount = Math.floor(width / total);
		
    const datas = normalizeData(filterData(audioBuffer, barAmount));
		waveCanvas.width = (width - width % total) - gap;
		waveCanvas.height = (maxHeight + bonusHeight) * 2;

		for(let i = 0; i < datas.length; i++) {
			const value = Math.ceil(datas[i] * maxHeight) + bonusHeight;
			waveCanvasCtx.fillStyle = `hsl(${Math.round(i / barAmount * 360)}deg 70% 80%)`;
			waveCanvasCtx.fillStyle = `#e0e0e0`;
			waveCanvasCtx.fillRect(i * total, maxHeight + bonusHeight - value, barWidth, value * 2 + 1);
		}
  }
};