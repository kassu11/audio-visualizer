document.querySelector("input").addEventListener("change", event => {
  const files = event.target.files;
  console.log(videoElem)
  let output = [];
  for(const file of files) {
    console.log(file)
  
    allUploadedFiles.push(file)
    setAudioTrack(allUploadedFiles.length - 1);
  
    // video.createAnalyser();
    // video.load();
    // console.log(f.dataTransfer.items[i].webkitGetAsEntry());
    output.push("<li><strong>", file.name, "</strong> (", file.type || "n/a", ") - ",
      file.size, " bytes, last modified: ",
      file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : "n/a",
      "</li>");
    }

  console.log(output);



});

const fileUploadElem = document.querySelector(".file-upload");

function setAudioTrack(index) {
  const track = allUploadedFiles[index];
  playIndex = index;
  
  videoElem.src = URL.createObjectURL(track);
  videoElem.play();
  videoElem.volume = .2;
  currentTime.textContent = formatTime(0);

  videoElem.addEventListener("canplaythrough", e => {
    duration.textContent = formatTime(videoElem.duration);
  }, {once: true});
}

let dragOverTimeOut = null;
window.addEventListener("dragover", () => {
  fileUploadElem.classList.add("drag-over");
  clearTimeout(dragOverTimeOut);
  dragOverTimeOut = setTimeout(() => {
    fileUploadElem.classList.remove("drag-over")
  }, 100);
});