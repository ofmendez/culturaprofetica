const iframe = document.getElementById("ytVideo");
const btn = document.getElementById("unmuteBtn");

btn.addEventListener("click", () => {
  iframe.contentWindow.postMessage(
    '{"event":"command","func":"unMute","args":""}',
    '*'
  );

  btn.classList.add("hide");
});
