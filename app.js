const swipee = document.querySelector(".swipee");
const message = document.querySelector(".message");
const modalWrapper = document.querySelector(".modal-wrapper");
const closeBtn = document.querySelector(".close-btn");
const start = { x: 0, y: 0 };
let direction = 0;

let superLikeCount = 0;
const threshold = swipee.clientWidth / 2;

document
  .querySelectorAll("unselectable")
  .forEach(elt => elt.addEventListener("selectstart", e => e.preventDefault()));

swipee.addEventListener("mousedown", e => {
  start.x = e.clientX;
  start.y = e.clientY;

  direction = Math.sign(e.clientY - swipee.offsetTop - swipee.clientHeight / 2);

  swipee.addEventListener("mousemove", updateSwipee);
  swipee.addEventListener("mouseup", resetSwipee);
  swipee.addEventListener("mouseleave", resetSwipee);
});

function updateSwipee(e) {
  swipee.style = `transform: translate(${(e.clientX - start.x) *
    1.25}px, ${e.clientY - start.y}px) rotate(${(e.clientX - start.x) *
    -0.1 *
    direction}deg);`;
  swipee.classList.add("eased-return");

  if (
    start.x - e.clientX < 0 &&
    Math.abs(e.clientY - start.y) < Math.abs(start.x - e.clientX)
  ) {
    message.style = `opacity:${Math.abs(start.x - e.clientX) /
      (threshold * 0.85)};`;
    message.classList.add("like");
    message.classList.remove("nope");
    message.classList.remove("super-like");
  } else if (
    start.x - e.clientX >= 0 &&
    Math.abs(e.clientY - start.y) < Math.abs(start.x - e.clientX)
  ) {
    message.style = `opacity:${Math.abs(start.x - e.clientX) /
      (threshold * 0.85)};`;
    message.classList.remove("like");
    message.classList.add("nope");
    message.classList.remove("super-like");
  } else if (
    start.y - e.clientY >= 0 &&
    Math.abs(e.clientY - start.y) > Math.abs(start.x - e.clientX)
  ) {
    message.style = `opacity:${(start.y - e.clientY) / (threshold * 0.85)};`;
    message.classList.remove("like");
    message.classList.remove("nope");
    message.classList.add("super-like");
  }

  if (
    Math.abs(e.clientX - start.x) > threshold ||
    start.y - e.clientY > threshold
  ) {
    if (start.y - e.clientY > threshold) {
      swipee.dispatchEvent(new CustomEvent("swipe", { detail: "super-like" }));
    } else if (start.x - e.clientX >= 0) {
      swipee.dispatchEvent(new CustomEvent("swipe", { detail: "nope" }));
    } else if (start.x - e.clientX < 0) {
      swipee.dispatchEvent(new CustomEvent("swipe", { detail: "like" }));
    }
  }
}

function resetSwipee() {
  swipee.removeEventListener("mousemove", updateSwipee);
  swipee.removeEventListener("mouseup", resetSwipee);
  swipee.removeEventListener("mouseleave", resetSwipee);

  swipee.style = "transform: translateY(0px);";
  swipee.classList.remove("faded");
  message.style = "opacity:0;";
}

swipee.addEventListener("swipe", e => {
  if (e.detail === "super-like") {
    superLikeCount++;
    if (superLikeCount > 1) {
      modalWrapper.classList.remove("hidden");
    }
  }

  swipee.classList.add("faded");
  swipee.removeEventListener("mousemove", updateSwipee);
  swipee.removeEventListener("mouseup", resetSwipee);
  swipee.removeEventListener("mouseleave", resetSwipee);

  swipee.classList.remove("eased-return");
  message.style = "opacity:0;";

  setTimeout(() => {
    swipee.style = "transform: translateY(0px);";
    swipee.classList.remove("faded");
  }, 500);
});

modalWrapper.addEventListener("click", e => {
  if (e.target === modalWrapper) {
    modalWrapper.classList.add("hidden");
  }
});

closeBtn.addEventListener("click", e => {
  modalWrapper.classList.add("hidden");
});
