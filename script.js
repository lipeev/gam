const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const mainMenu = document.getElementById("main-menu");
const gameScreen = document.getElementById("game-screen");
const btnStart = document.getElementById("btn-start");
const btnChar = document.getElementById("btn-char");
const btnMaps = document.getElementById("btn-maps");
const btnBackMenu = document.getElementById("btn-back-menu");

const skinsModal = document.getElementById("skins-modal");
const btnCloseSkins = document.getElementById("btn-close-skins");
const skinItems = document.querySelectorAll(".skin-item");

const mapsModal = document.getElementById("maps-modal");
const btnCloseMaps = document.getElementById("btn-close-maps");
const mapItems = document.querySelectorAll(".map-item");

const creditsModal = document.getElementById("credits-modal");
const btnCredits = document.getElementById("btn-credits");
const btnCloseCredits = document.getElementById("btn-close-credits");

let score = 0;
let gameSpeed = 6;
let isGameStarted = false;
let isGameOver = false;
let currentCharacter = "dino";
let currentMap = "devils";
let highScore = Number(localStorage.getItem("dino_solo_highscore")) || 0;

let skyDunes = [];
let farDunes = [];
let nearDunes = [];
let particles = [];
let windLines = [];
let obstacles = [];

let spawnTimer = 0;
let nextSpawnInterval = 90;
let sunY = 70;
let spinAngle = 0;
let animationId = null;

const player = {
    x: 60,
    y: 155,
    width: 40,
    height: 45,
    velocityY: 0,
    gravity: 0.6,
    isJumping: false,
    jump() {
        if (!this.isJumping) {
            this.velocityY = -11.5;
            this.isJumping = true;
            spawnJumpParticles();
        }
    },
    update() {
        this.y += this.velocityY;
        if (this.y + this.height < 200) {
            this.velocityY += this.gravity;
        } else {
            this.y = 200 - this.height;
            this.velocityY = 0;
            this.isJumping = false;
        }
        spinAngle += 0.15 * (gameSpeed / 6);
    },
    draw() {
        ctx.save();
        if (currentCharacter === "dino") {
            const gallop = this.isJumping ? -3 : Math.sin(spinAngle * 2.5) * 4;

            ctx.fillStyle = "#b2bec3";
            ctx.beginPath();
            ctx.moveTo(this.x + 2, this.y + 24);
            ctx.quadraticCurveTo(this.x - 10, this.y + 26 + gallop * 0.5, this.x - 6, this.y + 36);
            ctx.lineTo(this.x + 4, this.y + 28);
            ctx.fill();

            ctx.strokeStyle = "#dfe6e9";
            ctx.lineWidth = 3.5;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(this.x + 7, this.y + 33);
            ctx.lineTo(this.x + 3 - gallop, this.y + 44);
            ctx.moveTo(this.x + 27, this.y + 33);
            ctx.lineTo(this.x + 33 + gallop, this.y + 43);
            ctx.stroke();

            ctx.fillStyle = "#2d3436";
            ctx.fillRect(this.x + 1 - gallop, this.y + 42, 4, 3);
            ctx.fillRect(this.x + 31 + gallop, this.y + 41, 4, 3);

            ctx.fillStyle = "#f5f6fa";
            ctx.beginPath();
            ctx.ellipse(this.x + 17, this.y + 29, 15, 7, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#7f8fa6";
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = "#f5f6fa";
            ctx.beginPath();
            ctx.moveTo(this.x + 26, this.y + 27);
            ctx.lineTo(this.x + 33, this.y + 13);
            ctx.lineTo(this.x + 42, this.y + 20);
            ctx.lineTo(this.x + 38, this.y + 24);
            ctx.lineTo(this.x + 31, this.y + 31);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#95a5a6";
            ctx.beginPath();
            ctx.moveTo(this.x + 32, this.y + 13);
            ctx.lineTo(this.x + 24, this.y + 22);
            ctx.lineTo(this.x + 28, this.y + 24);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "#2f3640";
            ctx.beginPath();
            ctx.arc(this.x + 8, this.y + 30, 2, 0, Math.PI * 2);
            ctx.arc(this.x + 21, this.y + 31, 2.2, 0, Math.PI * 2);
            ctx.arc(this.x + 27, this.y + 27, 1.8, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(this.x + 11, this.y + 27, 7, 6);
            ctx.strokeStyle = "#2f3640";
            ctx.lineWidth = 0.8;
            ctx.strokeRect(this.x + 11, this.y + 27, 7, 6);

            ctx.strokeStyle = "#1abc9c";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x + 20, this.y + 23);
            ctx.lineTo(this.x + 25, this.y + 35);
            ctx.moveTo(this.x + 23, this.y + 29);
            ctx.lineTo(this.x + 33, this.y + 27);
            ctx.moveTo(this.x + 34, this.y + 16);
            ctx.lineTo(this.x + 40, this.y + 21);
            ctx.stroke();

            ctx.fillStyle = "#16a085";
            ctx.beginPath();
            ctx.arc(this.x + 32, this.y + 27, 2.3, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#2980b9";
            ctx.beginPath();
            ctx.moveTo(this.x + 15, this.y + 22);
            ctx.lineTo(this.x + 9, this.y + 25);
            ctx.lineTo(this.x + 17, this.y + 26);
            ctx.fill();

            ctx.fillStyle = "#f1c40f";
            ctx.beginPath();
            ctx.ellipse(this.x + 14, this.y + 19, 4.5, 3, -0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#b7950b";
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = "#ffffff";
            ctx.fillRect(this.x + 16, this.y + 11, 8, 10);
            ctx.fillStyle = "#2980b9";
            ctx.fillRect(this.x + 22, this.y + 13, 6, 3);

            ctx.fillStyle = "#fad390";
            ctx.beginPath();
            ctx.arc(this.x + 21, this.y + 8, 4.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#8d6e63";
            ctx.beginPath();
            ctx.moveTo(this.x + 18, this.y + 4);
            ctx.lineTo(this.x + 14, this.y - 3);
            ctx.lineTo(this.x + 20, this.y + 3);
            ctx.fill();

            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(this.x + 21, this.y + 6.5, 5, Math.PI, 0);
            ctx.fill();
            ctx.strokeStyle = "#2980b9";
            ctx.lineWidth = 1.2;
            ctx.stroke();

            ctx.strokeStyle = "#f1c40f";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(this.x + 23, this.y + 5.5, 2, 0.2, Math.PI - 0.2, true);
            ctx.stroke();
        } else if (currentCharacter === "gyro") {
            const gallop = this.isJumping ? -3 : Math.sin(spinAngle * 2.5) * 4;
            const capeWave = Math.sin(spinAngle * 2) * 3;

            ctx.fillStyle = "#c8a165";
            ctx.beginPath();
            ctx.moveTo(this.x + 2, this.y + 24);
            ctx.quadraticCurveTo(this.x - 11, this.y + 25 + gallop * 0.5, this.x - 7, this.y + 35);
            ctx.lineTo(this.x + 4, this.y + 28);
            ctx.fill();

            ctx.strokeStyle = "#8e441d";
            ctx.lineWidth = 3.5;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(this.x + 7, this.y + 33);
            ctx.lineTo(this.x + 3 - gallop, this.y + 44);
            ctx.moveTo(this.x + 27, this.y + 33);
            ctx.lineTo(this.x + 33 + gallop, this.y + 43);
            ctx.stroke();

            ctx.fillStyle = "#1abc9c";
            ctx.fillRect(this.x + 2 - gallop, this.y + 38, 4, 3.5);
            ctx.fillRect(this.x + 30 + gallop, this.y + 37, 4, 3.5);

            ctx.fillStyle = "#1e272e";
            ctx.fillRect(this.x + 1 - gallop, this.y + 42, 4, 3);
            ctx.fillRect(this.x + 31 + gallop, this.y + 41, 4, 3);

            const horseGrad = ctx.createLinearGradient(this.x + 5, this.y + 22, this.x + 30, this.y + 36);
            horseGrad.addColorStop(0, "#e67e22");
            horseGrad.addColorStop(0.5, "#b84b14");
            horseGrad.addColorStop(1, "#6e2c00");
            ctx.fillStyle = horseGrad;
            ctx.beginPath();
            ctx.ellipse(this.x + 17, this.y + 29, 15, 7, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#b2bec3";
            ctx.beginPath();
            ctx.moveTo(this.x + 6, this.y + 23);
            ctx.lineTo(this.x + 15, this.y + 23);
            ctx.lineTo(this.x + 13, this.y + 30);
            ctx.lineTo(this.x + 4, this.y + 29);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "#b84b14";
            ctx.beginPath();
            ctx.moveTo(this.x + 26, this.y + 27);
            ctx.lineTo(this.x + 33, this.y + 13);
            ctx.lineTo(this.x + 42, this.y + 20);
            ctx.lineTo(this.x + 38, this.y + 24);
            ctx.lineTo(this.x + 31, this.y + 31);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "#c0392b";
            ctx.beginPath();
            ctx.moveTo(this.x + 32, this.y + 13);
            ctx.lineTo(this.x + 39, this.y + 17);
            ctx.lineTo(this.x + 36, this.y + 22);
            ctx.lineTo(this.x + 30, this.y + 19);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "#eab543";
            ctx.beginPath();
            ctx.arc(this.x + 40, this.y + 21, 2.3, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = "#1abc9c";
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(this.x + 21, this.y + 23);
            ctx.lineTo(this.x + 25, this.y + 35);
            ctx.moveTo(this.x + 23, this.y + 29);
            ctx.lineTo(this.x + 33, this.y + 27);
            ctx.stroke();

            ctx.fillStyle = "#2980b9";
            ctx.beginPath();
            ctx.moveTo(this.x + 17, this.y + 13);
            ctx.quadraticCurveTo(this.x + 4, this.y + 12 + capeWave, this.x - 7, this.y + 15 - capeWave);
            ctx.lineTo(this.x - 4, this.y + 21 - capeWave);
            ctx.quadraticCurveTo(this.x + 7, this.y + 18, this.x + 17, this.y + 17);
            ctx.fill();

            ctx.fillStyle = "#d4ac0d";
            ctx.beginPath();
            ctx.moveTo(this.x + 17, this.y + 21);
            ctx.lineTo(this.x + 21, this.y + 30);
            ctx.lineTo(this.x + 17, this.y + 31);
            ctx.lineTo(this.x + 14, this.y + 23);
            ctx.fill();

            ctx.fillStyle = "#5b2c6f";
            ctx.fillRect(this.x + 16, this.y + 11, 8, 10);

            ctx.fillStyle = "#2ecc71";
            ctx.beginPath();
            ctx.arc(this.x + 27, this.y + 15, 3.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#196f3d";
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = "#f5d76e";
            ctx.beginPath();
            ctx.moveTo(this.x + 19, this.y + 7);
            ctx.lineTo(this.x + 13, this.y + 11);
            ctx.lineTo(this.x + 18, this.y + 12);
            ctx.fill();

            ctx.fillStyle = "#fad390";
            ctx.beginPath();
            ctx.arc(this.x + 21, this.y + 8, 4.2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#4e342e";
            ctx.beginPath();
            ctx.ellipse(this.x + 21, this.y + 5.5, 9, 2.2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(this.x + 17, this.y + 2, 8, 3.5);

            ctx.fillStyle = "#f1c40f";
            ctx.fillRect(this.x + 18, this.y + 4.5, 1.5, 1.5);
            ctx.fillRect(this.x + 21, this.y + 4.5, 1.5, 1.5);
            ctx.fillRect(this.x + 24, this.y + 4.5, 1.5, 1.5);
        } else if (currentCharacter === "diego") {
            const runCycle = this.isJumping ? 4 : Math.sin(spinAngle * 2.8) * 6;
            const jawOpen = this.isJumping ? 4 : Math.abs(Math.sin(spinAngle * 1.5)) * 2.5;

            ctx.fillStyle = "#0abde3";
            ctx.beginPath();
            ctx.moveTo(this.x + 12, this.y + 23);
            ctx.quadraticCurveTo(this.x - 6, this.y + 20 + runCycle * 0.3, this.x - 14, this.y + 25);
            ctx.quadraticCurveTo(this.x - 4, this.y + 28, this.x + 12, this.y + 31);
            ctx.fill();

            ctx.strokeStyle = "#f1c40f";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(this.x - 10, this.y + 25);
            ctx.lineTo(this.x + 8, this.y + 28);
            ctx.stroke();

            ctx.strokeStyle = "#192a56";
            ctx.lineWidth = 4;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(this.x + 15, this.y + 30);
            ctx.lineTo(this.x + 11 - runCycle, this.y + 38);
            ctx.lineTo(this.x + 15 - runCycle, this.y + 44);
            ctx.stroke();

            const bodyGrad = ctx.createLinearGradient(this.x + 10, this.y + 10, this.x + 30, this.y + 35);
            bodyGrad.addColorStop(0, "#48dbfb");
            bodyGrad.addColorStop(0.6, "#0abde3");
            bodyGrad.addColorStop(1, "#273c75");
            ctx.fillStyle = bodyGrad;

            ctx.beginPath();
            ctx.moveTo(this.x + 10, this.y + 24);
            ctx.lineTo(this.x + 21, this.y + 11);
            ctx.lineTo(this.x + 29, this.y + 15);
            ctx.lineTo(this.x + 26, this.y + 32);
            ctx.lineTo(this.x + 12, this.y + 33);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "#a3e4d7";
            ctx.beginPath();
            ctx.moveTo(this.x + 25, this.y + 16);
            ctx.lineTo(this.x + 29, this.y + 24);
            ctx.lineTo(this.x + 23, this.y + 32);
            ctx.lineTo(this.x + 22, this.y + 18);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = "#f1c40f";
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(this.x + 23, this.y + 20);
            ctx.lineTo(this.x + 28, this.y + 22);
            ctx.moveTo(this.x + 23, this.y + 25);
            ctx.lineTo(this.x + 27, this.y + 27);
            ctx.stroke();

            ctx.strokeStyle = "#192a56";
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(this.x + 19, this.y + 14);
            ctx.lineTo(this.x + 23, this.y + 16);
            ctx.moveTo(this.x + 16, this.y + 18);
            ctx.lineTo(this.x + 21, this.y + 20);
            ctx.moveTo(this.x + 13, this.y + 22);
            ctx.lineTo(this.x + 18, this.y + 24);
            ctx.stroke();

            ctx.strokeStyle = "#f39c12";
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.arc(this.x + 14, this.y + 28, 3.5, -0.5, Math.PI * 1.1);
            ctx.stroke();

            ctx.strokeStyle = "#273c75";
            ctx.lineWidth = 4.5;
            ctx.beginPath();
            ctx.moveTo(this.x + 16, this.y + 29);
            ctx.lineTo(this.x + 12 + runCycle, this.y + 37);
            ctx.lineTo(this.x + 18 + runCycle, this.y + 44);
            ctx.stroke();

            ctx.fillStyle = "#f1c40f";
            ctx.fillRect(this.x + 18 + runCycle, this.y + 42, 4, 2.5);

            ctx.strokeStyle = "#0abde3";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(this.x + 25, this.y + 21);
            ctx.lineTo(this.x + 32, this.y + 25);
            ctx.lineTo(this.x + 30, this.y + 29);
            ctx.stroke();
            ctx.fillStyle = "#f1c40f";
            ctx.fillRect(this.x + 29, this.y + 28, 3, 2);

            ctx.fillStyle = "#48dbfb";
            ctx.beginPath();
            ctx.moveTo(this.x + 21, this.y + 11);
            ctx.lineTo(this.x + 25, this.y + 3);
            ctx.lineTo(this.x + 42, this.y + 7);
            ctx.lineTo(this.x + 40, this.y + 12);
            ctx.lineTo(this.x + 27, this.y + 13);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = "#192a56";
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = "#0abde3";
            ctx.beginPath();
            ctx.moveTo(this.x + 26, this.y + 13);
            ctx.lineTo(this.x + 39, this.y + 13 + jawOpen);
            ctx.lineTo(this.x + 37, this.y + 16 + jawOpen);
            ctx.lineTo(this.x + 25, this.y + 16);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "#ffffff";
            for (let t = 0; t < 4; t++) {
                ctx.fillRect(this.x + 29 + t * 3, this.y + 11.5, 1.5, 2);
            }

            ctx.fillStyle = "#f1c40f";
            ctx.fillRect(this.x + 27, this.y + 6, 3, 2.5);
            ctx.fillStyle = "#000000";
            ctx.fillRect(this.x + 28.5, this.y + 6, 1, 2.5);

            ctx.strokeStyle = "#f1c40f";
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(this.x + 25, this.y + 4);
            ctx.lineTo(this.x + 24, this.y - 2);
            ctx.moveTo(this.x + 28, this.y + 4);
            ctx.lineTo(this.x + 29, this.y - 2);
            ctx.moveTo(this.x + 22, this.y + 7);
            ctx.lineTo(this.x + 18, this.y + 3);
            ctx.moveTo(this.x + 20, this.y + 11);
            ctx.lineTo(this.x + 15, this.y + 9);
            ctx.stroke();

            ctx.fillStyle = "#ee5253";
            ctx.font = "bold 11px Courier New";
            ctx.fillText("ド", this.x + 2, this.y + 42);
        } else if (currentCharacter === "john") {
            const step = this.isJumping ? 2.5 : Math.sin(spinAngle * 2.4) * 3.5;
            const tilt = this.isJumping ? -0.08 : Math.sin(spinAngle * 2.4) * 0.04;

            ctx.translate(this.x + 20, this.y + 22);
            ctx.rotate(tilt);
            ctx.scale(0.45, 0.45);
            ctx.translate(-30, -50);

            const rodPath = new Path2D(
                "M 25 22 " +
                "A 10 10 0 1 1 35 22 " +
                "L 35 26 L 44 29 L 43 32 L 51 39 L 38 48 " +
                `L ${32 + step} 90 L ${50 + step} 97 L ${49 + step} 99 L ${29 + step} 91 ` +
                "L 35 46 L 46 39 L 40 33 L 41 31 L 32 28 L 32 20 " +
                "A 7 7 0 1 0 28 20 " +
                "L 28 26 L 20 24 L 21 27 L 10 43 L 23 50 " +
                `L ${25 - step} 77 L ${12 - step} 77 L ${12 - step} 75 L ${22 - step} 75 ` +
                "L 20 52 L 6 44 L 18 26 L 17 21 Z"
            );

            ctx.fillStyle = "#ffffff";
            ctx.fill(rodPath);
            ctx.strokeStyle = "#222222";
            ctx.lineWidth = 2.2;
            ctx.lineJoin = "round";
            ctx.stroke(rodPath);

        } else if (currentCharacter === "hotpants") {
            const gallop = this.isJumping ? -3 : Math.sin(spinAngle * 2.5) * 4;

            ctx.fillStyle = "#2d3436";
            ctx.beginPath();
            ctx.moveTo(this.x + 2, this.y + 24);
            ctx.quadraticCurveTo(this.x - 10, this.y + 26 + gallop * 0.5, this.x - 6, this.y + 36);
            ctx.lineTo(this.x + 4, this.y + 28);
            ctx.fill();

            ctx.strokeStyle = "#b2bec3";
            ctx.lineWidth = 3.5;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(this.x + 7, this.y + 33);
            ctx.lineTo(this.x + 3 - gallop, this.y + 44);
            ctx.moveTo(this.x + 27, this.y + 33);
            ctx.lineTo(this.x + 33 + gallop, this.y + 43);
            ctx.stroke();

            ctx.fillStyle = "#2d3436";
            ctx.fillRect(this.x + 1 - gallop, this.y + 42, 4, 3);
            ctx.fillRect(this.x + 31 + gallop, this.y + 41, 4, 3);

            ctx.fillStyle = "#dfe6e9";
            ctx.beginPath();
            ctx.ellipse(this.x + 17, this.y + 29, 15, 7, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#636e72";
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.fillStyle = "#dfe6e9";
            ctx.beginPath();
            ctx.moveTo(this.x + 26, this.y + 27);
            ctx.lineTo(this.x + 33, this.y + 13);
            ctx.lineTo(this.x + 42, this.y + 20);
            ctx.lineTo(this.x + 38, this.y + 24);
            ctx.lineTo(this.x + 31, this.y + 31);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#2d3436";
            ctx.beginPath();
            ctx.moveTo(this.x + 32, this.y + 13);
            ctx.lineTo(this.x + 25, this.y + 21);
            ctx.lineTo(this.x + 29, this.y + 23);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = "#8d6e63";
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(this.x + 21, this.y + 23);
            ctx.lineTo(this.x + 25, this.y + 35);
            ctx.moveTo(this.x + 34, this.y + 16);
            ctx.lineTo(this.x + 40, this.y + 21);
            ctx.stroke();

            ctx.fillStyle = "#81ecec";
            ctx.beginPath();
            ctx.moveTo(this.x + 13, this.y + 22);
            ctx.lineTo(this.x + 6, this.y + 31);
            ctx.lineTo(this.x + 12, this.y + 31);
            ctx.fill();

            ctx.fillStyle = "#d1ccc0";
            ctx.fillRect(this.x + 9, this.y + 17, 6, 6);
            ctx.strokeStyle = "#636e72";
            ctx.lineWidth = 0.8;
            ctx.strokeRect(this.x + 9, this.y + 17, 6, 6);

            ctx.fillStyle = "#e84393";
            ctx.beginPath();
            ctx.moveTo(this.x + 17, this.y + 21);
            ctx.lineTo(this.x + 21, this.y + 31);
            ctx.lineTo(this.x + 18, this.y + 32);
            ctx.lineTo(this.x + 14, this.y + 23);
            ctx.fill();

            ctx.fillStyle = "#fd79a8";
            ctx.fillRect(this.x + 16, this.y + 11, 8, 11);

            ctx.fillStyle = "#dfe6e9";
            ctx.fillRect(this.x + 21, this.y + 13, 6, 3);

            ctx.fillStyle = "#f1c40f";
            ctx.fillRect(this.x + 16, this.y + 19, 8, 2);
            ctx.fillRect(this.x + 21, this.y + 13, 2.5, 2.5);

            ctx.fillStyle = "#fd79a8";
            ctx.fillRect(this.x + 16, this.y + 6, 4, 5);

            ctx.fillStyle = "#fad390";
            ctx.beginPath();
            ctx.arc(this.x + 21, this.y + 8, 4.2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#2d3436";
            ctx.beginPath();
            ctx.arc(this.x + 20.5, this.y + 6.5, 5, Math.PI, 0);
            ctx.fill();
            ctx.fillRect(this.x + 21, this.y + 5.5, 6.5, 1.8);

            ctx.fillStyle = "#f1c40f";
            ctx.beginPath();
            ctx.arc(this.x + 22.5, this.y + 5, 1.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(this.x + 19.5, this.y + 0.5, 2, 2);
        }
        ctx.restore();
    }
};
btnChar.addEventListener("click", () => skinsModal.classList.remove("hidden"));
btnCloseSkins.addEventListener("click", () => skinsModal.classList.add("hidden"));
skinsModal.addEventListener("click", (e) => {
    if (e.target === skinsModal) skinsModal.classList.add("hidden");
});

skinItems.forEach(item => {
    item.addEventListener("click", () => {
        skinItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        currentCharacter = item.getAttribute("data-skin");
    });
});

btnMaps.addEventListener("click", () => mapsModal.classList.remove("hidden"));
btnCloseMaps.addEventListener("click", () => mapsModal.classList.add("hidden"));
mapsModal.addEventListener("click", (e) => {
    if (e.target === mapsModal) mapsModal.classList.add("hidden");
});

mapItems.forEach(item => {
    item.addEventListener("click", () => {
        mapItems.forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        currentMap = item.getAttribute("data-map");
    });
});

btnCredits.addEventListener("click", () => creditsModal.classList.remove("hidden"));
btnCloseCredits.addEventListener("click", () => creditsModal.classList.add("hidden"));
creditsModal.addEventListener("click", (e) => {
    if (e.target === creditsModal) creditsModal.classList.add("hidden");
});

btnStart.addEventListener("click", () => {
    mainMenu.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    isGameStarted = true;
    resetGame();
});

btnBackMenu.addEventListener("click", returnToMenu);

function returnToMenu() {
    isGameStarted = false;
    isGameOver = false;
    if (animationId) cancelAnimationFrame(animationId);
    gameScreen.classList.add("hidden");
    mainMenu.classList.remove("hidden");
}

function handleActionInput() {
    if (!isGameStarted) return;
    if (isGameOver) {
        resetGame();
    } else {
        player.jump();
    }
}

document.addEventListener("keydown", (e) => {
    if ((e.key === " " || e.key === "ArrowUp") && isGameStarted) {
        handleActionInput();
        e.preventDefault();
    } else if (e.key === "Escape" && isGameStarted) {
        returnToMenu();
    }
});

canvas.addEventListener("mousedown", handleActionInput);
canvas.addEventListener("touchstart", (e) => {
    handleActionInput();
    e.preventDefault();
});

class Dune {
    constructor(layer, startX = null) {
        this.layer = layer;
        this.x = startX !== null ? startX : canvas.width + Math.random() * 150;

        if (currentMap === "devils") {
            this.width = Math.random() * 80 + 60;
            if (layer === "sky") { this.height = Math.random() * 60 + 60; this.speed = 0.2; this.color = "#84532c"; }
            else if (layer === "far") { this.height = Math.random() * 50 + 40; this.speed = 0.5; this.color = "#a16b3d"; }
            else { this.height = Math.random() * 30 + 20; this.speed = 1.2; this.color = "#be834e"; }
        } else if (currentMap === "sandiego") {
            this.width = Math.random() * 240 + 180;
            if (layer === "sky") { this.height = Math.random() * 20 + 15; this.speed = 0.3; this.color = "#2980b9"; }
            else if (layer === "far") { this.height = Math.random() * 25 + 10; this.speed = 0.6; this.color = "#eccc68"; }
            else { this.height = Math.random() * 15 + 8; this.speed = 1.3; this.color = "#ffdd59"; }
        } else {
            this.width = Math.random() * 120 + 90;
            if (layer === "sky") { this.height = Math.random() * 90 + 70; this.speed = 0.15; this.color = "#57606f"; }
            else if (layer === "far") { this.height = Math.random() * 65 + 45; this.speed = 0.45; this.color = "#747d8c"; }
            else { this.height = Math.random() * 35 + 20; this.speed = 1.1; this.color = "#a4b0be"; }
        }
    }

    update() {
        this.x -= this.speed * (gameSpeed / 6);
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x, 200);
        if (currentMap === "rocky") {
            ctx.lineTo(this.x + this.width * 0.5, 200 - this.height);
            ctx.lineTo(this.x + this.width, 200);
            ctx.fill();
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.moveTo(this.x + this.width * 0.5, 200 - this.height);
            ctx.lineTo(this.x + this.width * 0.35, 200 - this.height * 0.7);
            ctx.lineTo(this.x + this.width * 0.65, 200 - this.height * 0.7);
            ctx.fill();
        } else {
            ctx.quadraticCurveTo(this.x + this.width / 2, 200 - this.height * 1.6, this.x + this.width, 200);
            ctx.fill();
        }
    }
}

class Obstacle {
    constructor() {
        this.x = canvas.width + 20;
        const variant = Math.random();
        if (variant < 0.4) {
            this.width = 22;
            this.height = 38;
        } else if (variant < 0.8) {
            this.width = 34;
            this.height = 46;
        } else {
            this.width = 48;
            this.height = 30;
        }
        this.y = 200 - this.height;
    }

    update() {
        this.x -= gameSpeed;
    }

    draw() {
        if (currentMap === "devils") {
            ctx.fillStyle = "#27ae60";
            ctx.fillRect(this.x + 6, this.y, this.width - 12, this.height);
            ctx.fillRect(this.x, this.y + 10, 6, 14);
            ctx.fillRect(this.x + this.width - 6, this.y + 6, 6, 14);
            ctx.fillStyle = "#1e8449";
            ctx.fillRect(this.x + this.width / 2 - 1, this.y + 4, 2, this.height - 6);
        } else if (currentMap === "sandiego") {
            ctx.fillStyle = "#ee5253";
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2 + 4, this.width / 2, Math.PI, 0);
            ctx.fill();
            ctx.fillRect(this.x + 2, this.y + this.height / 2 + 4, this.width - 4, this.height / 2 - 4);
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(this.x + 8, this.y + 10, 4, 4);
            ctx.fillRect(this.x + this.width - 12, this.y + 10, 4, 4);
        } else {
            ctx.fillStyle = "#48dbfb";
            ctx.beginPath();
            ctx.moveTo(this.x, 200);
            ctx.lineTo(this.x + this.width * 0.3, this.y);
            ctx.lineTo(this.x + this.width * 0.6, this.y + 12);
            ctx.lineTo(this.x + this.width * 0.8, this.y + 4);
            ctx.lineTo(this.x + this.width, 200);
            ctx.fill();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
}
function spawnJumpParticles() {
    for (let i = 0; i < 8; i++) {
        particles.push({
            x: player.x + player.width / 2,
            y: 198,
            vx: (Math.random() - 0.5) * 4,
            vy: -Math.random() * 3,
            life: 20
        });
    }
}

function initBackground() {
    skyDunes = [];
    farDunes = [];
    nearDunes = [];
    windLines = [];
    for (let i = 0; i < 6; i++) {
        skyDunes.push(new Dune("sky", i * 160));
        farDunes.push(new Dune("far", i * 150));
        nearDunes.push(new Dune("near", i * 140));
    }
    for (let i = 0; i < 5; i++) {
        windLines.push({
            x: Math.random() * canvas.width,
            y: Math.random() * 170 + 10,
            len: Math.random() * 40 + 20,
            speed: Math.random() * 3 + 2
        });
    }
}

function drawBackground() {
    if (currentMap === "devils") {
        ctx.fillStyle = "#f7ca84";
        ctx.fillRect(0, 0, canvas.width, 200);
        ctx.fillStyle = "#ff793f";
        ctx.beginPath();
        ctx.arc(680, sunY, 32, 0, Math.PI * 2);
        ctx.fill();
    } else if (currentMap === "sandiego") {
        ctx.fillStyle = "#70a1ff";
        ctx.fillRect(0, 0, canvas.width, 200);
        ctx.fillStyle = "#ffeaa7";
        ctx.beginPath();
        ctx.arc(680, 55, 28, 0, Math.PI * 2);
        ctx.fill();
    } else {
        ctx.fillStyle = "#ced6e0";
        ctx.fillRect(0, 0, canvas.width, 200);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(680, 60, 24, 0, Math.PI * 2);
        ctx.fill();
    }

    [skyDunes, farDunes, nearDunes].forEach((layerArr, idx) => {
        const layerName = idx === 0 ? "sky" : idx === 1 ? "far" : "near";
        layerArr.forEach(d => {
            d.update();
            d.draw();
        });
        if (layerArr.length > 0 && layerArr[0].x + layerArr[0].width < 0) {
            layerArr.shift();
            layerArr.push(new Dune(layerName));
        }
    });

    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 2;
    windLines.forEach(w => {
        w.x -= w.speed * (gameSpeed / 6);
        if (w.x + w.len < 0) {
            w.x = canvas.width + 20;
            w.y = Math.random() * 170 + 10;
        }
        ctx.beginPath();
        ctx.moveTo(w.x, w.y);
        ctx.lineTo(w.x + w.len, w.y);
        ctx.stroke();
    });

    if (currentMap === "devils") {
        ctx.fillStyle = "#c07d34";
    } else if (currentMap === "sandiego") {
        ctx.fillStyle = "#f6e58d";
    } else {
        ctx.fillStyle = "#dfe4ea";
    }
    ctx.fillRect(0, 200, canvas.width, 50);

    ctx.strokeStyle = "#755a2f";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.lineTo(canvas.width, 200);
    ctx.stroke();
}

function checkCollision(p, obs) {
    const pad = 5;
    return (
        p.x + pad < obs.x + obs.width - pad &&
        p.x + p.width - pad > obs.x + pad &&
        p.y + pad < obs.y + obs.height - pad &&
        p.y + p.height - pad > obs.y + pad
    );
}

function drawUI() {
    ctx.fillStyle = "#5c3619";
    ctx.font = "bold 18px Courier New";
    ctx.textAlign = "right";
    const formattedScore = String(Math.floor(score)).padStart(5, "0");
    const formattedHigh = String(Math.floor(highScore)).padStart(5, "0");
    ctx.fillText(`HI ${formattedHigh}  ${formattedScore}`, canvas.width - 20, 32);

    if (isGameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#fffaf0";
        ctx.textAlign = "center";
        ctx.font = "bold 32px Courier New";
        ctx.fillText("GAME OVER", canvas.width / 2, 110);

        ctx.font = "bold 16px Courier New";
        ctx.fillText("Нажмите ПРОБЕЛ или КЛИК для рестарта", canvas.width / 2, 145);
    }
}

function resetGame() {
    if (animationId) cancelAnimationFrame(animationId);
    score = 0;
    gameSpeed = 6;
    isGameOver = false;
    obstacles = [];
    particles = [];
    spawnTimer = 0;
    nextSpawnInterval = 80;
    player.y = 155;
    player.velocityY = 0;
    player.isJumping = false;
    initBackground();
    gameLoop();
}

function gameLoop() {
    if (!isGameStarted) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    if (!isGameOver) {
        player.update();

        score += 0.15 * (gameSpeed / 6);
        gameSpeed = 6 + Math.floor(score / 100) * 0.4;

        spawnTimer++;
        if (spawnTimer >= nextSpawnInterval) {
            obstacles.push(new Obstacle());
            spawnTimer = 0;
            nextSpawnInterval = Math.max(45, Math.floor(Math.random() * 55 + 65 - gameSpeed * 2));
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].update();
            if (checkCollision(player, obstacles[i])) {
                isGameOver = true;
                if (score > highScore) {
                    highScore = Math.floor(score);
                    localStorage.setItem("dino_solo_highscore", highScore);
                }
            }
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
            }
        }
    }

    obstacles.forEach(obs => obs.draw());
    player.draw();

    for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
        ctx.fillStyle = "rgba(117, 90, 47, 0.6)";
        ctx.fillRect(pt.x, pt.y, 4, 4);
        if (pt.life <= 0) particles.splice(i, 1);
    }

    drawUI();

    animationId = requestAnimationFrame(gameLoop);
}

