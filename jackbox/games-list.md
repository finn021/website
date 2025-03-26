---
layout: sandbox-page
title: Game Gallery
full-width: true
---
<head>
    <style>
        body {font-family:monospace;padding: 20px;}

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

        .game-item:hover {transform: scale(1.03);}

        @media (max-width: 1024px) {
            .game-item {width: calc(33.33% - 10px);}
        }
        @media (max-width: 768px) {
            .game-item {width: calc(50% - 10px);}
        }
        @media (max-width: 480px) {.game-item {width: 100%;}
        }

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
            max-height: 75vh;
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
            transition: color 200ms linear;
        }

        .close-btn:hover {
            color: #c51a00;
            cursor: pointer;
        }

        #popup-images {
            width: 100%;
            margin-top: 10px;
            border-radius: 10px;
        }

        img,video {
            max-width: 100%;
            margin-top: 20px;
        }

        h2 {
            font-size: clamp(20px, 3vw, 24px);
        }

        p,a {
            font-size: clamp(13px, 2vw, 16px);
        }
    </style>
</head>
<body>
    <div id="game-container"></div>
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
            <p><strong>Tags:</strong> <span style="text-transform:capitalize;" id="popup-tags"></span></p>
            <a id="popup-show-images-button">Show Images</a>
            <div id="popup-images"></div>
        </div>
    </div>
</body>
<script>
    const apiUrl = "https://raw.githubusercontent.com/AkiraArtuhaxis/JackboxUtility-Server-en/main/api/v2/packs.json";
    const assetsUrl = "https://raw.githubusercontent.com/AkiraArtuhaxis/JackboxUtility-Server-en/refs/heads/main/assets/";
    const blacklistUrl = "https://api.jsonbin.io/v3/b/67e3a6c68960c979a578a94a";
    const gameContainer = document.getElementById("game-container");
    const popupContainer = document.getElementById("popup");
    const imagesContainer = document.getElementById("popup-images");
    const showImagesButton = document.getElementById("popup-show-images-button");

    fetch(blacklistUrl)
        .then(response => response.json())
        .then(blacklistData => {
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                    data.packs.forEach(pack => {
                        pack.games.forEach(game => {
                            if (!blacklistData.record.blacklistedGames.includes(game.id)) {
                                const gameDiv = document.createElement("div");
                                gameDiv.classList.add("game-item");
                                gameDiv.style.backgroundImage = "url(" + assetsUrl + game.background + ")";
                                gameDiv.setAttribute("alt", game.name);
                                gameDiv.addEventListener("click", () => openPopup(game));
                                gameContainer.appendChild(gameDiv);
                            }
                        function openPopup(game) {
                            document.body.style.overflow = "hidden";
                            showImagesButton.style.display = "block";
                            document.getElementById("popup-title").textContent = game.name;
                            document.getElementById("popup-description").textContent = game.game_info.description;
                            document.getElementById("popup-players").textContent = `${game.game_info.players.min} - ${game.game_info.players.max}`;
                            document.getElementById("popup-playtime").textContent = `${game.game_info.playtime.min} - ${game.game_info.playtime.max} minutes`;
                            document.getElementById("popup-stream-friendly").textContent = game.game_info.stream_friendly.replace("_", " ");
                            if (game.game_info.stream_friendly_description == null) {document.getElementById("popup-stream-friendly-description").textContent = "N/A";} 
                            else {document.getElementById("popup-stream-friendly-description").textContent = game.game_info.stream_friendly_description;}
                            if (game.game_info.subtitles == true) {document.getElementById("popup-subtitles").textContent = "Supported";} 
                            else { document.getElementById("popup-subtitles").textContent = "Not Supported";}
                            document.getElementById("popup-tags").textContent = game.game_info.tags.toString().replaceAll(",", " | ");
                        
                            showImagesButton.onclick = () => {
                                imagesContainer.innerHTML = "";
                                showImagesButton.style.display = "none";
                                game.game_info.images.forEach(imgSrc => {
                                    if (imgSrc.endsWith(".mp4")) {
                                        const video = document.createElement("video");
                                        video.src = assetsUrl + imgSrc;
                                        video.controls = true;
                                        video.preload = true;
                                        imagesContainer.appendChild(video);
                                    } else {
                                        const img = document.createElement("img");
                                        img.src = assetsUrl + imgSrc;
                                        imagesContainer.appendChild(img);
                                    }
                                    imagesContainer.style.display = "block";
                                });
                            };
                        popupContainer.style.display = "flex";
                        }
                    });
                });
            })
        document.querySelector(".close-btn").addEventListener("click", () => {
            imagesContainer.style.display = "none";
            popupContainer.style.display = "none";
            document.body.style.overflow = "auto";
            document.querySelector('video').pause();
        });
    });
</script>