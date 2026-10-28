// The JS below is so you can click and drag to scroll on desktop
// @source https://codepen.io/thenutz/pen/VwYeYEE
const slider = document.querySelector(".slides");
let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener("pointerdown", (e) => {
	isDown = true;
	slider.classList.add("dragging");
	startX = e.pageX - slider.offsetLeft;
	scrollLeft = slider.scrollLeft;
});
slider.addEventListener("pointerleave", () => {
	isDown = false;
	slider.classList.remove("dragging");
});
slider.addEventListener("pointerup", () => {
	isDown = false;
	slider.classList.remove("dragging");
});
slider.addEventListener("pointermove", (e) => {
	if (!isDown) return;
	e.preventDefault();
	const x = e.pageX - slider.offsetLeft;
	const walk = (x - startX) * 3; //scroll-fast
	slider.scrollLeft = scrollLeft - walk;
});
