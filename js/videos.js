const videoModal = document.querySelector("#videoModal");
const youtubeFrame = document.querySelector("#youtubeFrame");
const closeVideoBtn = document.querySelector(".video-modal-close");

function openVideo(videoId) {
  youtubeFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

  videoModal.classList.add("is-open");

  requestAnimationFrame(() => {
    videoModal.classList.add("is-visible");
  });
}

function closeVideo() {
  videoModal.classList.remove("is-visible");

  setTimeout(() => {
    videoModal.classList.remove("is-open");
    youtubeFrame.src = "";
  }, 350);
}

document.querySelectorAll(".video-card").forEach((card) => {
  const videoId = card.dataset.video;
  const thumb = card.querySelector(".video-thumb");
  const title = card.querySelector(".video-title");

  thumb.addEventListener("click", () => openVideo(videoId));
  title.addEventListener("click", () => openVideo(videoId));
});

closeVideoBtn.addEventListener("click", closeVideo);

videoModal.addEventListener("click", (event) => {
  if (event.target.classList.contains("video-modal-backdrop")) {
    closeVideo();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && videoModal.classList.contains("is-open")) {
    closeVideo();
  }
});




const videosMoreBtn = document.querySelector("#videosMoreBtn");
const videoCards = document.querySelectorAll(".video-card");

let videosExpanded = false;

function getVisibleLimit() {
  if (window.innerWidth <= 900) return 6;
  if (window.innerWidth <= 1400) return 8;
  return 10;
}

function updateVisibleVideos() {
  if (videosExpanded) {
    videoCards.forEach((card) => {
      card.classList.remove("is-hidden");
    });

    if (videosMoreBtn) {
      videosMoreBtn.style.display = "none";
    }

    return;
  }

  const limit = getVisibleLimit();

  videoCards.forEach((card, index) => {
    card.classList.toggle("is-hidden", index >= limit);
  });

  if (videosMoreBtn) {
    videosMoreBtn.style.display =
      videoCards.length > limit ? "inline-flex" : "none";
  }
}

videosMoreBtn?.addEventListener("click", () => {
  videosExpanded = true;
  updateVisibleVideos();
});

window.addEventListener("resize", updateVisibleVideos);

updateVisibleVideos();


const siteLoader = document.querySelector("#siteLoader");

window.addEventListener("load", () => {
  setTimeout(() => {
    siteLoader?.classList.add("is-hidden");
  }, 500);
});