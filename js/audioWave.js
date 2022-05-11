function audioWaveLoadingAnimation() {

}

function audioWaveLoad(index) {
  // let ctx = new AudioContext();
  // let audio = video.current;
  // let audioSrc = ctx.createMediaElementSource(audio);
  // let analyser = ctx.createAnalyser();
  // audio.volume = 0.1;

  const audioContext = new AudioContext();
  // const visualizeAudio = url => {
  //   fetch(url)
  //     .then(response => response.arrayBuffer())
  //     .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
  //     .then(audioBuffer => visualize(audioBuffer));
  // };
  const visualizeAudio2 = index => {
		allUploadedFiles.at(index ?? -1).arrayBuffer()
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => visualize2(audioBuffer.getChannelData(0)));
  };

  // console.log(arr.at(-1))


  // visualizeAudio(audio.src);
  visualizeAudio2(index);
  // visualizeAudio2(audio);

  const filterData = (rawData, samples = 250) => {
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

  const normalizeData = filteredData => {
    const multiplier = Math.pow(Math.max(...filteredData), -1);
    return filteredData.map(n => n * multiplier);
  }

  function visualize(rawData) {
    const datas = normalizeData(filterData(rawData));
		const {width} = sliderContainer.getBoundingClientRect()
    const canvas = document.querySelector("canvas#audioWave");
    const ctx2 = canvas.getContext("2d");
    canvas.width = width;
    
    console.log(datas);
    for(let i = 0; i < datas.length; i++) {
      ctx2.fillStyle = `rgb(${255}, ${255}, ${255})`;
      ctx2.fillRect(i * 7, 0, 5, datas[i] * 20);
    }
  }

	function visualize2(audioBuffer) {
    const canvas = document.querySelector("canvas#audioWave");
		const {width} = sliderContainer.getBoundingClientRect();
    const ctx2 = canvas.getContext("2d");

		const bonusHeight = 7;
		const maxHeight = 21;

		const gap = 1;
		const barWidth = 2;
		const total = (gap + barWidth);
		const barAmount = Math.floor(width / total);

		
    const datas = normalizeData(filterData(audioBuffer, barAmount));
		canvas.width = (width - width % total) - gap;
		canvas.height = (maxHeight + bonusHeight) * 2;
		console.log(datas)

		for(let i = 0; i < datas.length; i++) {
			
			const value = Math.ceil(datas[i] * maxHeight) + bonusHeight;
			ctx2.fillStyle = `hsl(${Math.round(i / barAmount * 360)}deg 70% 80%)`;
			ctx2.fillStyle = `#e0e0e0`;
			ctx2.fillRect(i * total, maxHeight + bonusHeight - value, barWidth, value * 2);
		}
  }
  // we have to connect the MediaElementSource with the analyser 
  // audioSrc.connect(analyser);
  // audioSrc.connect(ctx.destination);

  // analyser.minDecibels = -90;
  // analyser.maxDecibels = 0;
  // analyser.fftSize = 4096;
  // analyser.smoothingTimeConstant = .9;
  // // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
 
  // // frequencyBinCount tells you how many values you'll receive from the analyser
  // let frequencyData = new Uint8Array(analyser.frequencyBinCount);

  // const canvas = document.querySelector("canvas");
  // const ctx2 = canvas.getContext("2d");
 
  // we're ready to receive some data!
  // loop
};