---
layout: sandbox-page
title: Game Gallery
full-width: true
---
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game Gallery</title>
<style>
body {
    font-family: monospace;
    min-height: 100vh;
    padding: 20px;
}

#game-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
}

.game-item {
    width: calc(25% - 10px);
    aspect-ratio: 635 / 291;
    background-size: cover;
    background-position: center;
    border-radius: 10px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s;
    cursor: pointer;
}

.game-item:hover {
    transform: scale(1.03);
}

/* Responsive Layout */
@media (max-width: 1024px) {
    .game-item { width: calc(33.33% - 10px); }
}
@media (max-width: 768px) {
    .game-item { width: calc(50% - 10px); }
}
@media (max-width: 480px) {
    .game-item { width: 100%; }
}

/* Popup Styling */
.popup {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    justify-content: center;
    align-items: center;
}

.popup-content {
    background: white;
    padding: 20px;
    border-radius: 10px;
    width: 75vw;
    max-width: 600px;
    position: relative;
    overflow-y: auto;
    max-height: 70vh;
}
html.dark-mode .popup-content {
    color: white;
    background: #0c0b0b;
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 20px;
    cursor: pointer;
}

#popup-images {
    width: 100%;
    margin-top: 10px;
    border-radius: 10px;
}
img, video {
  max-width: 100%;
  margin-top: 20px;
}
h2 {
  font-size: clamp(20px, 3vw, 24px);
}
p {
  font-size: clamp(13px, 2vw, 16px);
}
</style>
</head>
<body>
<div id="game-container"></div>

<!-- Popup for game details -->
<div id="popup" class="popup">
    <div class="popup-content">
        <span class="close-btn material-icons">close</span>
        <h2 id="popup-title"></h2>
        <p id="popup-description"></p>
        <p><strong>Players:</strong> <span id="popup-players"></span></p>
        <p><strong>Playtime:</strong> <span id="popup-playtime"></span></p>
        <p><strong>Remote Play:</strong> <span id="popup-stream-friendly"></span></p>
        <p><strong>Comments:</strong> <span id="popup-stream-friendly-description"></span></p>
        <p><strong>Subtitles:</strong> <span id="popup-subtitles"></span></p>
        <p><strong>Category:</strong> <span id="popup-categories"></span></p>
        <div id="popup-images"></div>
    </div>
</div></body>
<script>
fetch("https://raw.githubusercontent.com/AkiraArtuhaxis/JackboxUtility-Server-en/main/api/v2/packs.json") // Replace with the actual API URL
    .then(response => response.json()) // Parse JSON response
    .then(data => {
        const container = document.getElementById("game-container"); // Parent div to hold game items

        data.packs.forEach(pack => {
            pack.games.forEach(game => {
                const gameDiv = document.createElement("div"); // Create a new div for each game
                gameDiv.classList.add("game-item"); // Add a class for styling

                // Set background image
                gameDiv.style.backgroundImage = `url(${game.background})`;
                gameDiv.style.backgroundSize = "cover";
                gameDiv.style.backgroundPosition = "center";
		gameDiv.setAttribute("alt", game.name);

                gameDiv.addEventListener("click", () => openPopup(game));
                container.appendChild(gameDiv); // Append to container

                function openPopup(game) {
		    document.getElementById('game-container').overflow = "hidden";
                    document.getElementById("popup-title").textContent = game.name;
                    document.getElementById("popup-description").textContent = game.game_info.description;
                    document.getElementById("popup-players").textContent = `${game.game_info.players.min} - ${game.game_info.players.max}`;
                    document.getElementById("popup-playtime").textContent = `${game.game_info.playtime.min} - ${game.game_info.playtime.max} minutes`;
                    document.getElementById("popup-stream-friendly").textContent = game.game_info.stream_friendly;
                    document.getElementById("popup-stream-friendly-description").textContent = game.game_info.stream_friendly_description;
                    document.getElementById("popup-subtitles").textContent = game.game_info.subtitles;
                    document.getElementById("popup-categories").textContent = game.game_info.tags;

                    const imagesContainer = document.getElementById("popup-images");
                    imagesContainer.innerHTML = "";
                    game.game_info.images.forEach(imgSrc => {
                    	if (imgSrc.endsWith(".mp4")) {
           		  const video = document.createElement("video");
            		  video.src = imgSrc;
                          video.controls = true;
			  video.preload = true;
			  video.playsinline = true;
            		  imagesContainer.appendChild(video);
       									} else {
                       	 const img = document.createElement("img");
                       	 img.src = imgSrc;
                       	 imagesContainer.appendChild(img);
        								}
                    });

                    document.getElementById("popup").style.display = "flex";
                }

            });
        });
    })

document.querySelector(".close-btn").addEventListener("click", () => {
    document.getElementById("popup").style.display = "none";
    document.getElementById('game-container').overflow = "auto";
    document.querySelector('video').pause();
});
</script>