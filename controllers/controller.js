window.addEventListener("DOMContentLoaded", bindEvent);
import { videoOperation } from "../services/crud-service.js";
function bindEvent() {
  getTrendingVideos();
  document.querySelector("#search").addEventListener("click", searchVideo);
}

let currIframe = null;

async function getTrendingVideos() {
  const API_KEY = "AIzaSyARw9FcV_w1Tybr0vwcWefvpg9clR4qB9E";
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&chart=mostPopular&regionCode=IN&maxResults=50&key=${API_KEY}`,
  );
  const res = await response.json();
  console.log(res);
  const datas = res.items;
  videoOperation.videos = datas;
  getVideos(datas);
}

export function getVideos(datas) {
  const main = document.querySelector("#content");
  main.innerHTML = "";
  for (let data of datas) {
    const main = document.querySelector("#content");
    const div = makeDiv(data);
    const img = makeImg(data);
    const desc = description(data);
    div.appendChild(img);
    div.addEventListener("click", runVideo);
    div.appendChild(desc);
    main.appendChild(div);
  }
}

function searchVideo() {
  const value = document.querySelector(".searchBox input").value;
  videoOperation.search(value);
}

function makeDiv(data) {
  const div = document.createElement("div");
  div.className = "box";
  div.setAttribute("video-id", data.id);
  return div;
}

function makeImg(data) {
  const img = document.createElement("img");
  img.src = `${data.snippet.thumbnails.high.url}`;
  img.className = "thumbnail";
  return img;
}

function description(data) {
  const div = document.createElement("div");
  const view = formatViews(data.statistics.viewCount);
  const time = formatDate(data.snippet.publishedAt);
  div.className = "desc";
  div.innerHTML += `
    <div class="title">
      ${data.snippet.title}
    </div>
    <div class='channel'>
      ${data.snippet.channelTitle}
    </div>
    <div class="channel">
      <span>${view}  <span>views</span></span>
      <span>${time}</span>
    </div>`;
  return div;
}

function runVideo() {
  const currVideo = this;
  const videoId = currVideo.getAttribute("video-id");
  if (currIframe) {
    const link = currIframe.getAttribute("data-thumb");
    currIframe.outerHTML = `<img class="thumbnail" src="${link}">`;
  }
  const img = currVideo.querySelector(".thumbnail");
  const thumb = img.src;
  img.outerHTML = `
          <iframe
              width="400"
              height="300"
              data-thumb="${thumb}"
              src="https://www.youtube.com/embed/${videoId}?autoplay=1"
              allowfullscreen>
          </iframe>
      `;
  currIframe = currVideo.querySelector("iframe");
}

function formatDate(date) {
  const now = new Date();
  const past = new Date(date);

  const seconds = Math.floor((now - past) / 1000);

  const years = Math.floor(seconds / (60 * 60 * 24 * 365));
  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;

  const months = Math.floor(seconds / (60 * 60 * 24 * 30));
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;

  const days = Math.floor(seconds / (60 * 60 * 24));
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;

  const hours = Math.floor(seconds / (60 * 60));
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

  return "Just now";
}

function formatViews(views) {
  if (views > 1000000) {
    return (views / 1000000).toFixed(1).replace(".0", "") + "M";
  } else if (views > 1000) {
    return (views / 1000).toFixed(1).replace(".0", "") + "k";
  }
}
