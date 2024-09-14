const imageWrapper = document.querySelector(".images");
const wrapper = document.querySelector(".wrapper");
const loadBtn = document.querySelector(".load");
const searchInput = document.querySelector(".search");
const lightBox = document.querySelector(".img-preview-details");
const closeBtn = document.getElementById("close");
const downloadBtn = document.querySelector(".bx-download");

const apiKey = "G3t8u98ZzBOq7cm5yYsrzZwLjFVe942PXShtmNyo3MfA2VWhYiTuaJFI";
let prePage = 20;
let currentPage = 1;
let searchTerm = null;


const downloadImg = (imgURL) => {
  fetch(imgURL).then(res => res.blob()).then(file => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    a.download = new Date().getTime();
    a.click();
  }).catch(() => alert("Failed to download images!!"))
}



const showImg = (name, img) => {
  lightBox.querySelector("img").src = img;
  lightBox.querySelector("span").innerText = name;
  downloadBtn.setAttribute("data-img", img);
  lightBox.classList.add("show");
  document.body.style.overflow = "hidden";
}

const close = () => {
  lightBox.classList.remove("show");
  document.body.style.overflow = "auto";
}

const generateHTML = (images) => {
  imageWrapper.innerHTML += images.map(img =>
    ` <li class="card" onclick = "showImg('${img.photographer}','${img.src.large2x}')" >
            <img src="${img.src.large2x}" alt="image">
                <div class="details">
                    <div class="photographer">
                        <i class='bx bx-camera'></i>
                        <span>${img.photographer}</span>
                    </div>
                    <button id="download" onclick = "downloadImg('${img.src.large2x}');event.stopPropagation();">
                        <i class='bx bx-download'></i>
                    </button>
                </div>
        </li>`
  ).join("")
}


const getImages = (apiURL) => {
  loadBtn.textContent = "Loading....";
  loadBtn.classList.add("disabled");
  fetch(apiURL, {
    headers: { Authorization: apiKey },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      generateHTML(data.photos);
      loadBtn.textContent = "Load More";
      loadBtn.classList.remove("disabled");
    }).catch(() => alert("Failed to load images!! "));
};

const loadImages = () => {
  currentPage++;
  let apiURL = `https://api.pexels.com/v1/curated?per_page=${currentPage}&per_page=${prePage}`
  apiURL = searchTerm ? `https://api.pexels.com/v1//search?query=${searchTerm}&per_page=${currentPage}&per_page=${prePage}` : apiURL;
  getImages(apiURL);
}

const searchImages = (e) => {
  if (e.target.value === '') return searchTerm == null;
  if (e.key === "Enter") {
    currentPage = 1;
    searchTerm = e.target.value;
    console.log(searchTerm);
    imageWrapper.textContent = "";
    getImages(`https://api.pexels.com/v1//search?query=${searchTerm}&per_page=${currentPage}&per_page=${prePage}`);
  }
}

getImages(`https://api.pexels.com/v1/curated?per_page=${currentPage}&per_page=${prePage}`);
loadBtn.addEventListener('click', loadImages);
closeBtn.addEventListener('click', close);
searchInput.addEventListener('keyup', searchImages);
downloadBtn.addEventListener('click', (e) => downloadImg(e.target.dataset.img));