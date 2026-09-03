import { tourDates } from "./tour-dates.js?v=1.0.7";

const tourList = document.querySelector("#tourList");

const statusLabels = {
  buy: "TICKETS ON SALE NOW",
  newBuy: "TICKETS ON SALE NOW",
  comingSoon: "COMING SOON",
  newComingSoon: "COMING SOON",
  soldOut: "SOLD OUT"
};

function createButton(item) {
  if (item.status === "none") return "";

  const hasNew = item.status === "newBuy" || item.status === "newComingSoon";
  const isLink = item.status === "buy" || item.status === "newBuy";

  const buttonClass = `tour-btn tour-btn-${item.status}`;

  const buttonInner = `
    ${hasNew ? `<span class="tour-new-label">NEW</span>` : ""}
    <span>${statusLabels[item.status]}</span>
  `;

  if (isLink) {
    return `
      <a class="${buttonClass}" href="${item.url}" target="_blank" rel="noopener noreferrer">
        ${buttonInner}
      </a>
    `;
  }

  return `
    <div class="${buttonClass}">
      ${buttonInner}
    </div>
  `;
}

function renderTourDates() {
  const sortedDates = [...tourDates].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  tourList.innerHTML = sortedDates.map((item) => {
    const hasButton = item.status !== "none";

    return `
      <article class="tour-row ${!hasButton ? "tour-row-no-button" : ""}">
        <div class="tour-date">${item.displayDate}</div>
        <div class="tour-city">${item.city}</div>
        <div class="tour-venue">${item.venue || ""}</div>
        ${hasButton ? `<div class="tour-action">${createButton(item)}</div>` : ""}
      </article>
    `;
  }).join("");
}

renderTourDates();