document.querySelector("input").addEventListener("change", event => {
  const files = event.target.files;
  let newFile = false;

  let output = [];
  for(const file of files) {
    if((file.type.match("audio.*") || file.type.match("video.*")) && !allUploadedFiles.find(e => searchFiles(e, file))) {
      allUploadedFiles.push(file);
      newFile = true;
    }
  }
  setAudioTrack(allUploadedFiles.length - 1);

  function searchFiles(newFile, oldFile) {
    return newFile.name == oldFile.name &&
      newFile.type == oldFile.type &&
      newFile.size == oldFile.size &&
      newFile.lastModified == oldFile.lastModified;
  }

});

const fileUploadElem = document.querySelector(".file-upload");

function setAudioTrack(index) {
  if(allUploadedFiles.length == 0) return;
  const track = allUploadedFiles[index];
  playIndex = index;

  console.log("??")
  
  videoElem.src = URL.createObjectURL(track);
  currentTime.textContent = formatTime(0);
  
  videoElem.addEventListener("canplaythrough", e => {
    duration.textContent = formatTime(videoElem.duration);
    videoElem.play();
    updatePauseButton();
    audioWaveLoad(index);
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