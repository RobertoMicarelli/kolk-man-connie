/* PAC-MAN in pure HTML/CSS/JS
   - No external dependencies
   - Arcade-like maze, sprites, ghost AI (scatter/chase/frightened), sounds
   - Responsive scaling (CSS), touch controls & swipe, fullscreen, sprite export
*/

"use strict";

// ---------- Constants ----------
const SPRITE_SIZE = 16; // Changeable; everything adapts
const TILE = SPRITE_SIZE;
const PACMAN_BASE_SPEED = 60;
const GHOST_BASE_SPEED = 55;
const COLS = 28;
const ROWS = 31;
const WIDTH = COLS * TILE;
const HEIGHT = ROWS * TILE;

// Maze tiles
// 0 empty, 1 wall, 2 pellet, 3 power pellet, 4 gate (ghost door), 5 tunnel
// Arcade-like 28x31 map simplified but near-faithful artwork layout
// Reference grid: pellets in corridors, power pellets at the four corners, gate centered
const MAZE = [
  // 28 columns per row
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,1,0,2,2,2,2,2,2,2,2,2,2,0,1,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,0,1,1,1,1,1,1,1,1,1,2,0,1,2,1,1,1,1,2,1],
  [1,3,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,3,1],
  [1,2,1,1,1,1,2,1,1,2,2,2,2,2,2,2,2,2,2,1,1,2,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,1,1,2,1,1,1,4,4,1,1,1,2,1,1,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,2,1,1,2,1,1,1,4,4,1,1,1,2,1,1,2,1,1,1,1,1,1],
  [0,0,0,0,0,1,2,1,1,2,1,1,1,4,4,1,1,1,2,1,1,2,1,0,0,0,0,0],
  [1,1,1,1,1,1,2,1,1,2,1,1,1,4,4,1,1,1,2,1,1,2,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,1,2,1,1,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,0,0,0,0,1,1,2,1,1,2,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,1,0,0,0,0,1,2,2,2,2,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,2,1,0,0,0,0,1,2,1,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,1,2,1,0,0,0,0,1,2,1,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,0,1,2,1,1,1,1,1,1,2,1,0,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,1,0,2,2,2,2,0,0,2,2,2,2,0,1,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,0,1,1,1,2,0,0,2,1,1,1,0,1,2,1,1,1,1,2,1],
  [1,3,2,2,2,2,2,2,2,2,2,1,2,0,0,2,1,2,2,2,2,2,2,2,2,2,3,1],
  [1,1,1,1,1,1,1,1,1,1,2,1,0,0,0,0,1,2,1,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,1,2,1,0,0,0,0,1,2,1,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,1,1,1,1,0,1,2,1,1,1,1,1,1,2,1,0,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,1,0,2,2,2,2,2,2,2,2,2,2,0,1,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,0,1,1,1,1,1,1,1,1,1,2,0,1,2,1,1,1,1,2,1],
  [1,3,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,3,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

// Note: rows with 0s at bottom are reserved (not drawn) to keep canvas 28x31 with room for HUD timing if needed.

// Snapshot pellet layout early so helpers can reference it safely
const originalPelletMask = MAZE.map(row=>row.map(v=> (v===2||v===3)?1:0));
// duplicate removed (moved to top after MAZE)
const GATE = (function(){
  let minRow=ROWS, maxRow=-1, minCol=COLS, maxCol=-1;
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      if(MAZE[r][c]===4){
        if(r<minRow) minRow=r; if(r>maxRow) maxRow=r;
        if(c<minCol) minCol=c; if(c>maxCol) maxCol=c;
      }
    }
  }
  return { left:minCol, right:maxCol, top:minRow, bottom:maxRow, exitRow: Math.max(0, minRow-1) };
})();

const COLORS = {
  wall: "#0011ff",
  wallDim: "#0011aa",
  pellet: "#ffb8ae",
  power: "#fff",
  gate: "#ccccff",
  bg: "#000000",
  text: "#fff",
  frightBlue: "#2222ff",
  frightWhite: "#ffffff"
};

// Custom ghost set and colors (Addy, Convy, Assy, Divy)
const ghostMeta = [
  { key: "addy",  name: "Addy",  color: "#ffd800" }, // yellow
  { key: "convy", name: "Convy", color: "#ff3030" }, // red
  { key: "assy",  name: "Assy",  color: "#22a7ff" }, // blue
  { key: "divy",  name: "Divy",  color: "#2ecc40" }, // green
];

// UI elements
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = WIDTH;
canvas.height = HEIGHT;

const scoreEl = document.getElementById("score");
const highEl = document.getElementById("highscore");
const livesEl = document.getElementById("lives");
const levelEl = document.getElementById("level");
const audioToggle = document.getElementById("audioToggle");
const pauseToggle = document.getElementById("pauseToggle");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const exportSpritesBtn = document.getElementById("exportSpritesBtn");
const touchControls = document.getElementById("touchControls");
const freeGhostBtn = document.getElementById("freeGhostBtn");

// Local state
const state = {
  score: 0,
  high: Number(localStorage.getItem("pacman_high")||0),
  lives: 3,
  level: 1,
  paused: false,
  audioOn: true,
  pelletsRemaining: 0,
  frightenedTime: 6,
  modeSchedule: [
    {mode:"scatter", t:7},
    {mode:"chase", t:20},
    {mode:"scatter", t:7},
    {mode:"chase", t:20},
    {mode:"scatter", t:5},
    {mode:"chase", t:Infinity},
  ],
  modeIndex: 0,
  modeTimer: 0,
  globalTime: 0,
  fruitShown1: false,
  fruitShown2: false,
  eatenInFright: 0,
};

// Input handling
const input = {
  currentDir: {x:0,y:0},
  desiredDir: {x:0,y:0},
};

// Helpers
const dirs = {
  up: {x:0, y:-1},
  down: {x:0, y:1},
  left: {x:-1, y:0},
  right: {x:1, y:0}
};
function isOpposite(a,b){ return a && b && a.x===-b.x && a.y===-b.y; }

function tileAt(col, row){
  if(col < 0){ col = COLS-1; }
  if(col >= COLS){ col = 0; }
  if(row < 0 || row >= ROWS) return 1; // treat out of bounds as wall
  return MAZE[row][col];
}

function isWalkable(col,row){
  const t = tileAt(col,row);
  return t !== 1;
}

// Corridor detection used to constrain ghost movement to paths
function isCorridorTile(col,row){
  const t = tileAt(col,row);
  if(t===2 || t===3 || t===5) return true; // pellets, power, tunnel
  if(t===0 && originalPelletMask[row] && originalPelletMask[row][col]===1) return true; // eaten pellet path
  return false;
}

function canEnter(col,row,isGhost, inHouse=false){
  const t = tileAt(col,row);
  if(t === 1) return false; // wall
  if(t === 4 && !isGhost) return false; // gate blocks Pac-Man
  if(isGhost){
    if(inHouse) return t !== 1; // inside the house, allow movement except walls
    // outside: only corridors (or gate tile)
    if(!isCorridorTile(col,row) && t!==4) return false;
  }
  return true;
}

function posToTile(x,y){
  return { col: Math.round(x / TILE), row: Math.round(y / TILE) };
}

function centerOfTile(col,row){
  return { x: col * TILE, y: row * TILE };
}

function wrapX(x){
  if(x < 0) return WIDTH - TILE;
  if(x > WIDTH - TILE) return 0;
  return x;
}

// Tile alignment helpers
const EPS = 0.1;
function isAlignedToGrid(val){
  const k = Math.round(val / TILE) * TILE;
  return Math.abs(val - k) < EPS;
}
function atTileCenter(ent){
  return isAlignedToGrid(ent.x) && isAlignedToGrid(ent.y);
}
function snapToGrid(ent){
  ent.x = Math.round(ent.x / TILE) * TILE;
  ent.y = Math.round(ent.y / TILE) * TILE;
}

// Entities
function createPacman(){
  const s = findStartPellet();
  return {
    x: s.c*TILE, y: s.r*TILE, dir:{x:0,y:0}, speed: PACMAN_BASE_SPEED, radius: 7,
    mouth: 0,
  };
}

function createGhost(name){
  const mapHome = { addy:{col:25,row:2}, convy:{col:2,row:2}, assy:{col:25,row:20}, divy:{col:2,row:20} };
  const meta = ghostMeta.find(g=>g.key===name) || ghostMeta[0];
  return {
    name: meta.key,
    x: 13*TILE, y: 14*TILE,
    dir: {x:1,y:0},
    speed: GHOST_BASE_SPEED,
    mode: "scatter",
    frightenedTimer: 0,
    inHouse: true,
    home: mapHome[meta.key]||{col:25,row:2},
    color: meta.color,
    lastCol: 13, lastRow: 14,
    stuckTimer: 0,
    dirHistory: [],
    oscillateCount: 0,
    lastDir: {x:0,y:0},
    repeatCount: 0,
  };
}

const pacman = createPacman();
const ghosts = [ createGhost("addy"), createGhost("convy"), createGhost("assy"), createGhost("divy") ];

// Spawn slots inside the house to avoid overlaps - now with better spacing
const GHOST_SLOTS = [ {c:12,r:16}, {c:13,r:16}, {c:14,r:15}, {c:15,r:15} ];
let nextRespawnSlot = 0;

function getFreeSpawnSlot(){
  // try each slot in round-robin; pick the first not occupied closely
  for(let k=0;k<GHOST_SLOTS.length;k++){
    const idx = (nextRespawnSlot + k) % GHOST_SLOTS.length;
    const s = GHOST_SLOTS[idx];
    let occupied = false;
    for(const g of ghosts){
      const gc = Math.round(g.x/TILE), gr = Math.round(g.y/TILE);
      if(Math.abs(gc - s.c) + Math.abs(gr - s.r) <= 0) { occupied = true; break; }
    }
    if(!occupied){ nextRespawnSlot = (idx+1)%GHOST_SLOTS.length; return s; }
  }
  // fallback: first slot
  const s = GHOST_SLOTS[nextRespawnSlot];
  nextRespawnSlot = (nextRespawnSlot+1)%GHOST_SLOTS.length;
  return s;
}

// Count pellets
(function initPellets(){
  let c = 0;
  for(let r=0;r<ROWS;r++){
    for(let ccol=0;ccol<COLS;ccol++){
      const t = MAZE[r][ccol];
      if(t===2||t===3) c++;
    }
  }
  state.pelletsRemaining = c;
})();

// ---------- Audio (WebAudio) ----------
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let audioUnlocked = false;

async function unlockAudio(){
  try{
    if(!audioCtx){ audioCtx = new AudioCtx(); }
    if(audioCtx.state === 'suspended') await audioCtx.resume();
    if(!audioUnlocked){
      const osc = audioCtx.createOscillator();
      osc.frequency.value = 1;
      const gain = audioCtx.createGain();
      gain.gain.value = 0;
      osc.connect(gain).connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime+0.01);
      audioUnlocked = true;
      soundIntro();
    }
  }catch(e){ /* ignore */ }
}

function beep(freq=440, dur=0.08, type="square", vol=0.06){
  if(!state.audioOn || !audioCtx || audioCtx.state !== 'running') return;
  const t = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(vol, t+0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, t+dur);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t+dur);
}

function soundPellet(){ beep(880,0.05,"square",0.03); }
function soundPower(){ beep(220,0.2,"square",0.05); }
function soundGhostEat(chain){
  const freqs = [880, 1240, 1760, 2480];
  beep(freqs[Math.min(chain,3)], 0.15, "triangle", 0.05);
}
function soundDeath(){ beep(110,0.5,"sawtooth",0.08); }
function soundFruit(){ beep(1320,0.12,"square",0.06); }
function soundIntro(){
  // simple chiptune triad
  beep(440,0.12); setTimeout(()=>beep(660,0.12),120); setTimeout(()=>beep(880,0.2),240);
}

// ---------- Sprite generation ----------
const sprite = {
  sheet: document.createElement("canvas"),
  ctx: null,
  scale: 1,
  init(){
    this.sheet.width = 16*TILE;
    this.sheet.height = 8*TILE;
    this.ctx = this.sheet.getContext("2d");
    this.ctx.imageSmoothingEnabled = false;
    this.drawAll();
  },
  drawAll(){
    const s = TILE;
    this.ctx.clearRect(0,0,this.sheet.width,this.sheet.height);
    // Pac-Man animations: draw CONNIE-style C-logo rotated by direction
    const drawPac = (cx,cy,dir,phase)=>{
      const stroke = "#ff2e46"; // Connie red
      const gap = Math.PI*0.35; // opening of the C
      const angleStart = gap/2;
      const angleEnd = Math.PI*2 - gap/2;
      const radiusOuter = s*0.45;
      const radiusInner = s*0.28;
      const lwOuter = s*0.16;
      const lwInner = s*0.08;
      this.ctx.save();
      // rotate C to face movement
      let rot=0;
      if(dir==="right") rot = 0;
      if(dir==="left") rot = Math.PI;
      if(dir==="up") rot = -Math.PI/2;
      if(dir==="down") rot = Math.PI/2;
      this.ctx.translate(cx,cy);
      this.ctx.rotate(rot);
      // outer stroke
      this.ctx.strokeStyle = stroke;
      this.ctx.lineCap = "round";
      this.ctx.lineWidth = lwOuter;
      this.ctx.beginPath();
      this.ctx.arc(0,0, radiusOuter, angleStart, angleEnd, false);
      this.ctx.stroke();
      // inner stroke
      this.ctx.lineWidth = lwInner;
      this.ctx.beginPath();
      this.ctx.arc(0,0, radiusInner, angleStart, angleEnd, false);
      this.ctx.stroke();
      this.ctx.restore();
    };
    const dirsOrder = ["right","left","up","down"];
    dirsOrder.forEach((d,i)=>{
      drawPac((i*2+0.5)*s,(0.5)*s,d,false);
      drawPac((i*2+1.5)*s,(0.5)*s,d,true);
    });
    // Ghost body (normal colors, frightened blue/white, eyes)
    const drawGhost = (cx,cy,color)=>{
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy - s*0.08, s*0.38, Math.PI, 0);
      this.ctx.lineTo(cx + s*0.38, cy + s*0.35);
      // skirt
      for(let i=3;i>=-3;i--){
        const dx = i* s*0.12;
        const dy = (i%2===0)? s*0.1 : 0;
        this.ctx.quadraticCurveTo(cx + dx + s*0.06, cy + s*0.45 + dy, cx + dx, cy + s*0.45);
      }
      this.ctx.closePath();
      this.ctx.fill();
      // eyes
      this.ctx.fillStyle = "#fff";
      this.ctx.fillRect(cx - s*0.16, cy - s*0.05, s*0.16, s*0.2);
      this.ctx.fillRect(cx + s*0.02, cy - s*0.05, s*0.16, s*0.2);
      this.ctx.fillStyle = "#00f";
      this.ctx.fillRect(cx - s*0.10, cy + 1, s*0.08, s*0.08);
      this.ctx.fillRect(cx + s*0.08, cy + 1, s*0.08, s*0.08);
    };
    const colors = ghostMeta.map(g=>g.color);
    colors.forEach((c,i)=>drawGhost((i*2+0.5)*s,(2.5)*s,c));
    // frightened
    drawGhost((0.5)*s,(4.5)*s,COLORS.frightBlue);
    drawGhost((2.5)*s,(4.5)*s,COLORS.frightWhite);
    // fruit placeholders (cherry, strawberry)
    const drawCherry=(cx,cy)=>{
      this.ctx.fillStyle = "#d00";
      this.ctx.beginPath(); this.ctx.arc(cx-3,cy,4,0,2*Math.PI); this.ctx.fill();
      this.ctx.beginPath(); this.ctx.arc(cx+3,cy,4,0,2*Math.PI); this.ctx.fill();
      this.ctx.strokeStyle = "#0f0"; this.ctx.lineWidth = 2;
      this.ctx.beginPath(); this.ctx.moveTo(cx,cy-6); this.ctx.quadraticCurveTo(cx+2,cy-10,cx+6,cy-8); this.ctx.stroke();
    };
    const drawStrawberry=(cx,cy)=>{
      this.ctx.fillStyle = "#f44";
      this.ctx.beginPath(); this.ctx.moveTo(cx,cy-5); this.ctx.quadraticCurveTo(cx+7,cy-2,cx,cy+6); this.ctx.quadraticCurveTo(cx-7,cy-2,cx,cy-5); this.ctx.fill();
      this.ctx.fillStyle = "#0f0"; this.ctx.fillRect(cx-3,cy-8,6,3);
      this.ctx.fillStyle = "#fff"; for(let i=0;i<5;i++){ this.ctx.fillRect(cx-3+i*1.5,cy-1,1,1);} 
    };
    drawCherry(0.5*s,6.5*s);
    drawStrawberry(2.5*s,6.5*s);
  },
  exportPNG(){
    const a = document.createElement("a");
    a.download = "pacman_sprites.png";
    a.href = this.sheet.toDataURL("image/png");
    a.click();
  }
};
sprite.init();

// ---------- Rendering ----------
function drawMaze(){
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0,0,WIDTH,HEIGHT);
  // walls and pellets
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      const t = MAZE[r][c];
      const x = c*TILE, y = r*TILE;
      if(t===1){
        ctx.fillStyle = COLORS.wall;
        ctx.fillRect(x+2,y+2,TILE-4,TILE-4);
        ctx.strokeStyle = COLORS.wallDim; ctx.lineWidth = 2;
        ctx.strokeRect(x+2.5,y+2.5,TILE-5,TILE-5);
      } else if(t===2){
        ctx.fillStyle = COLORS.pellet;
        ctx.fillRect(x + TILE/2 - 1, y + TILE/2 - 1, 2, 2);
      } else if(t===3){
        ctx.fillStyle = COLORS.power;
        ctx.beginPath(); ctx.arc(x+TILE/2, y+TILE/2, 3, 0, 2*Math.PI); ctx.fill();
      } else if(t===4){
        ctx.fillStyle = COLORS.gate;
        ctx.fillRect(x+2,y+TILE/2-1,TILE-4,2);
      }
    }
  }
}

function drawEntity(){
  // Pac-Man
  const dirName = pacman.dir.x>0?"right":pacman.dir.x<0?"left":pacman.dir.y<0?"up":"down";
  const phase = Math.floor((state.globalTime*10)%2)===0;
  drawSprite("pacman", pacman.x, pacman.y, dirName, phase);
  // Ghosts
  ghosts.forEach(g=>{
    drawGhostSprite(g);
  });
}

function drawSprite(kind, x, y, dirName, phase){
  const s = TILE;
  const tx = {right:0,left:2,up:4,down:6}[dirName] + (phase?1:0);
  const ty = 0;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(sprite.sheet, tx*s, ty*s, s, s, Math.round(x), Math.round(y), s, s);
}

function drawGhostSprite(g){
  const s = TILE;
  let sx=0, sy=0;
  if(g.mode==="frightened"){
    const blink = g.frightenedTimer < 2 && Math.floor(state.globalTime*6)%2===0;
    sx = (blink?2:0)*s; sy = 4*s;
  } else if(g.mode==="eyes"){
    sx = 2*s; sy = 4*s;
  } else {
    // draw from colored sprite area dynamically using tint via solid fill body
    // fallback using first ghost frame; color tint is applied when sprite sheet was drawn
    const idx = ghostMeta.findIndex(m=>m.key===g.name);
    sx = Math.max(0, idx)*2*s; sy = 2*s;
  }
  ctx.drawImage(sprite.sheet, sx, sy, s, s, Math.round(g.x), Math.round(g.y), s, s);
}

function drawHUD(){
  scoreEl.textContent = String(state.score);
  highEl.textContent = String(state.high);
  levelEl.textContent = String(state.level);
  // lives
  livesEl.innerHTML = "";
  for(let i=0;i<state.lives;i++){
    const span = document.createElement("span");
    span.className = "life";
    livesEl.appendChild(span);
  }
  // legend
  const legendEl = document.getElementById("legend");
  if(legendEl){
    legendEl.innerHTML = ghostMeta.map(g=>`<span class="legend-item"><span class="legend-swatch" style="background:${g.color}"></span><span class="legend-name">${g.name}${g.key==='divy'?' — THE KOLBY GHOST':''}</span></span>`).join("");
  }
  // Ghost legend
  const ghostLegend = document.getElementById("ghostLegend");
  if(ghostLegend){
    ghostLegend.innerHTML = ""; // Clear previous legend
    ghostMeta.forEach(g => {
      const span = document.createElement("span");
      span.className = "ghost-legend-item";
      span.style.backgroundColor = g.color;
      span.textContent = g.name;
      ghostLegend.appendChild(span);
    });
  }
}

// ---------- Game mechanics ----------
function resetLevel(nextLevel=false){
  // Reset speeds based on level
  const start = findStartPellet();
  pacman.x = start.c*TILE; pacman.y = start.r*TILE; pacman.dir = {x:0,y:0}; snapToGrid(pacman);
  pacman.speed = PACMAN_BASE_SPEED + (state.level-1)*5;
  input.desiredDir = {x:0,y:0};
  ghosts.forEach((g,i)=>{
    const s = GHOST_SLOTS[i % GHOST_SLOTS.length];
    g.x = s.c*TILE; g.y = s.r*TILE; snapToGrid(g);
    g.dir = {x:0, y:-1}; // spingi verso l'uscita
    g.mode = "scatter"; g.frightenedTimer = 0; g.inHouse = true; // iniziano nella casa
    g.speed = GHOST_BASE_SPEED + (state.level-1)*5 + ({addy:2,convy:0,assy:1,divy:-1}[g.name]||0);
    g.dirHistory = []; g.oscillateCount = 0; g.stuckTimer = 0; g.lastCol = Math.round(g.x/TILE); g.lastRow = Math.round(g.y/TILE);
  });
  state.modeIndex = 0; state.modeTimer = 0; state.eatenInFright = 0;
  if(nextLevel){
    state.level++;
    // Refill pellets
    for(let r=0;r<ROWS;r++){
      for(let c=0;c<COLS;c++){
        const t = MAZE[r][c];
        if(t===0) continue;
        if(t===1||t===4) continue;
        if(t===5) continue;
        if(t===2||t===3) continue; // already pellets in map definition remain
        // convert empty corridors (where we consumed pellets) back to pellets if needed
      }
    }
    // Recount pellets by scanning corridors: reset any zeros that were pellets historically is complex;
    // Simplify using an original snapshot reapply
    restorePellets();
    state.fruitShown1 = false; state.fruitShown2 = false; fruit = null;
  }
}

function restorePellets(){
  let count=0;
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      if(originalPelletMask[r][c]===1) {
        if(MAZE[r][c]!==1 && MAZE[r][c]!==4){ MAZE[r][c]= (r===1&&(c===1||c===26) || r===24&&(c===1||c===26))?3:2; }
        count++;
      }
    }
  }
  state.pelletsRemaining = count;
}

function eatAt(col,row){
  const t = tileAt(col,row);
  if(t===2){
    MAZE[row][col]=0; state.score += 10; state.pelletsRemaining--; soundPellet();
    fruitCheck();
  } else if(t===3){
    MAZE[row][col]=0; state.score += 50; state.pelletsRemaining--; soundPower();
    enterFrightened(); state.eatenInFright = 0; fruitCheck();
  }
  if(state.score > state.high){ state.high = state.score; localStorage.setItem("pacman_high", String(state.high)); }
}

function fruitCheck(){
  const eaten = originalPelletsTotal - state.pelletsRemaining;
  if(!state.fruitShown1 && eaten >= originalPelletsTotal/2){ spawnFruit(); state.fruitShown1 = true; }
  if(!state.fruitShown2 && state.pelletsRemaining <= 5){ spawnFruit(); state.fruitShown2 = true; }
}

let fruit = null; // {x,y,type, timer}
const FRUITS = [ {name:"cherry", score:100, sx:0, sy:6*TILE}, {name:"strawberry", score:300, sx:2*TILE, sy:6*TILE} ];
function spawnFruit(){
  const f = FRUITS[(state.level-1)%FRUITS.length];
  fruit = { x:14*TILE, y:17*TILE, type:f, timer:9 };
}

function drawFruit(){
  if(!fruit) return;
  ctx.drawImage(sprite.sheet, fruit.type.sx, fruit.type.sy, TILE, TILE, Math.round(fruit.x), Math.round(fruit.y), TILE, TILE);
}

function tryEatFruit(){
  if(!fruit) return;
  const pCol = Math.round(pacman.x/TILE), pRow = Math.round(pacman.y/TILE);
  const fCol = Math.round(fruit.x/TILE), fRow = Math.round(fruit.y/TILE);
  if(pCol===fCol && pRow===fRow){
    state.score += fruit.type.score; soundFruit(); fruit = null;
  }
}

const originalPelletsTotal = (function(){
  let c=0; for(let r=0;r<ROWS;r++){ for(let x=0;x<COLS;x++){ if(originalPelletMask[r][x]) c++; }} return c;
})();

// Find a safe starting corridor (first power pellet corner)
function findStartPellet(){
  for(let r=0;r<ROWS;r++){
    for(let c=0;c<COLS;c++){
      if(originalPelletMask[r][c]===1) return {c,r};
    }
  }
  return {c:10,r:23};
}

function enterFrightened(){
  ghosts.forEach(g=>{
    if(g.mode!=="eyes"){
      g.mode = "frightened";
      g.frightenedTimer = Math.max(3, state.frightenedTime - Math.floor(state.level/2));
    }
  });
}

function updateModes(dt){
  // if any ghost in frightened, continue timers separately
  ghosts.forEach(g=>{
    if(g.mode==="frightened"){
      g.frightenedTimer -= dt;
      if(g.frightenedTimer <= 0){ g.mode = state.modeSchedule[Math.min(state.modeIndex, state.modeSchedule.length-1)].mode; }
    }
  });
  // global mode schedule (scatter/chase)
  const current = state.modeSchedule[Math.min(state.modeIndex, state.modeSchedule.length-1)];
  if(current.t !== Infinity){
    state.modeTimer += dt;
    if(state.modeTimer >= current.t){
      state.modeIndex = Math.min(state.modeIndex+1, state.modeSchedule.length-1);
      state.modeTimer = 0;
      const next = state.modeSchedule[state.modeIndex].mode;
      ghosts.forEach(g=>{ if(g.mode!=="frightened" && g.mode!=="eyes") g.mode = next; });
    }
  }
}

function distance(a,b){ return Math.hypot(a.col-b.col, a.row-b.row); }

function ghostTarget(g){
  const pTile = posToTile(pacman.x, pacman.y);
  if(g.mode==="scatter") return g.home;
  if(g.mode==="frightened") return pTile; // wander-ish
  if(g.mode==="eyes") return {col:13,row:14}; // house
  // chase per-ghost
  if(g.name==="addy"){ return pTile; }
  if(g.name==="convy"){ // 4 tiles ahead with up-direction quirk
    const ahead = {...pTile};
    const d = pacman.dir;
    ahead.col += d.x*4 + (d.y<0? -4:0); // pinky overflow bug approximation
    ahead.row += d.y*4;
    return ahead;
  }
  if(g.name==="assy"){ // vector from Blinky to 2 ahead of pacman, doubled
    const blinky = ghosts.find(x=>x.name==="addy");
    const a = {...pTile}; a.col += pacman.dir.x*2; a.row += pacman.dir.y*2;
    const vx = a.col - Math.round(blinky.x/TILE);
    const vy = a.row - Math.round(blinky.y/TILE);
    return { col: a.col + vx, row: a.row + vy };
  }
  if(g.name==="divy"){ // if close (<8), go home; else chase
    if(distance(posToTile(g.x,g.y), pTile) < 8) return g.home;
    return pTile;
  }
  return pTile;
}

function chooseDir(g){
  // avoid reversing unless forced; pick dir that minimizes manhattan to target
  const target = ghostTarget(g);
  const options = [dirs.up, dirs.left, dirs.down, dirs.right]; // tie-breaker order roughly arcade-like
  let best = g.dir; let bestDist = Infinity;
  const curTile = posToTile(g.x, g.y);
  const valid = [];
  options.forEach(d=>{
    // do not reverse directly
    if(d.x===-g.dir.x && d.y===-g.dir.y) return;
    const nx = curTile.col + d.x;
    const ny = curTile.row + d.y;
    if(!canEnter(nx,ny,true, g.inHouse)) return;
    valid.push(d);
    const dd = Math.abs(nx-target.col)+Math.abs(ny-target.row);
    if(dd < bestDist){ bestDist = dd; best = d; }
  });
  // If no valid non-reverse options, allow reverse if possible (dead-end handling)
  if(valid.length===0){
    const rev = {x:-g.dir.x, y:-g.dir.y};
    const nx = curTile.col + rev.x, ny = curTile.row + rev.y;
    if(canEnter(nx,ny,true, g.inHouse)) return rev;
  }
  return best;
}

function moveEntity(ent, dt, isGhost=false){
  const speed = ent.speed * dt;
  const col = Math.round(ent.x/TILE); const row = Math.round(ent.y/TILE);
  // Nudge to center corridor when moving horizontally/vertically
  if(ent.dir.x!==0 && !isAlignedToGrid(ent.y)){
    ent.y += Math.sign(Math.round(ent.y/TILE)*TILE - ent.y) * Math.min(Math.abs(Math.round(ent.y/TILE)*TILE - ent.y), speed);
  }
  if(ent.dir.y!==0 && !isAlignedToGrid(ent.x)){
    ent.x += Math.sign(Math.round(ent.x/TILE)*TILE - ent.x) * Math.min(Math.abs(Math.round(ent.x/TILE)*TILE - ent.x), speed);
  }
  // If aligned, we may turn or decide next tile
  if(atTileCenter(ent)){
    // Snap to clean integer grid to avoid drift
    snapToGrid(ent);
    // Pac-Man applies desired direction first
    if(!isGhost){
      if(input.desiredDir.x!==ent.dir.x || input.desiredDir.y!==ent.dir.y){
        const nx = col + input.desiredDir.x;
        const ny = row + input.desiredDir.y;
        if(canEnter(nx,ny,false)) ent.dir = {...input.desiredDir};
      }
    }
    // If next tile in current direction is blocked, stop
    const cx = col + ent.dir.x; const cy = row + ent.dir.y;
    if(!canEnter(cx,cy,isGhost, isGhost && ent.inHouse)){
      ent.dir = {x:0,y:0};
    }
  }
  // If Pac-Man is standing still, try to start moving toward desired direction from current tile
  if(!isGhost && ent.dir.x===0 && ent.dir.y===0 && (input.desiredDir.x||input.desiredDir.y)){
    const ccol = Math.round(ent.x/TILE), crow = Math.round(ent.y/TILE);
    const nx = ccol + input.desiredDir.x; const ny = crow + input.desiredDir.y;
    if(canEnter(nx,ny,false)) ent.dir = {...input.desiredDir};
  }
  // Move along current direction
  const prevX = ent.x, prevY = ent.y;
  ent.x += ent.dir.x * speed; ent.y += ent.dir.y * speed;
  // If we entered a blocked tile due to dt overshoot, rollback to boundary and stop
  const ncol = Math.round(ent.x / TILE); const nrow = Math.round(ent.y / TILE);
  if(!canEnter(ncol, nrow, isGhost, isGhost && ent.inHouse)){
    ent.x = prevX; ent.y = prevY;
    snapToGrid(ent);
    ent.dir = {x:0,y:0};
  }
  // tunnel wrap
  ent.x = wrapX(ent.x);
}

function updateGhost(g, dt){
  // leave house: pathfind semplice verso l'uscita (col 13-14, riga 13)
  if(g.mode!=="frightened" && g.mode!=="eyes" && g.inHouse){
    const t = posToTile(g.x,g.y);
    const centerLeft = 13, centerRight = 14, exitRow = 13;
    if(atTileCenter(g)){
      // se sotto l'uscita e possiamo salire, sali
      if(t.col>=centerLeft && t.col<=centerRight && t.row>exitRow && canEnter(t.col, t.row-1, true, true)){
        g.dir = dirs.up;
      } else if(t.col < centerLeft && canEnter(t.col+1, t.row, true, true)){
        g.dir = dirs.right; // vai verso centro
      } else if(t.col > centerRight && canEnter(t.col-1, t.row, true, true)){
        g.dir = dirs.left; // vai verso centro
      } else if(t.col>=centerLeft && t.col<=centerRight && t.row===exitRow){
        // siamo all'uscita: marca fuori e procedi in su
        g.inHouse = false; g.dir = dirs.up;
      } else {
        // fallback: prova tutte le direzioni valide
        const tryAll = [dirs.up,dirs.left,dirs.right,dirs.down];
        for(const d of tryAll){ if(canEnter(t.col+d.x, t.row+d.y, true, true)){ g.dir = d; break; } }
      }
    }
  }
  // If eyes reached house center, revive
  if(g.mode==="eyes" && atTileCenter(g)){
    const t = posToTile(g.x,g.y);
    if(t.col===13 || t.col===14){
      if(t.row===14 || t.row===15){
        g.mode = "scatter"; g.inHouse = true; g.speed = GHOST_BASE_SPEED + (state.level-1)*5;
      }
    }
  }
  if(atTileCenter(g)){
    snapToGrid(g);
    if(g.mode!=="frightened" && g.mode!=="eyes"){ g.dir = chooseDir(g); }
    else if(g.mode==="frightened"){ // random at intersections
      const opts = [dirs.up,dirs.down,dirs.left,dirs.right].filter(d=> canEnter(Math.round(g.x/TILE)+d.x, Math.round(g.y/TILE)+d.y, true, g.inHouse));
      if(opts.length){ g.dir = opts[Math.floor(Math.random()*opts.length)]; }
    }
    // Se ancora senza direzione (bloccato), muovi verso l'alto per cercare il cancello
    if(!g.dir || (g.dir.x===0 && g.dir.y===0)) g.dir = dirs.up;
    // Anti-stuck: se non cambia tile per troppo tempo, spingilo verso Pac-Man
    const tc = Math.round(g.x/TILE), tr = Math.round(g.y/TILE);
    if(tc===g.lastCol && tr===g.lastRow){ g.stuckTimer += dt; } else { g.stuckTimer = 0; g.lastCol = tc; g.lastRow = tr; }
    // Limitazione ripetizioni: non ripetere la stessa direzione >2 volte
    if(g.lastDir && g.lastDir.x===g.dir.x && g.lastDir.y===g.dir.y){
      g.repeatCount++;
      if(g.repeatCount>=2){
        const rnd = [dirs.up,dirs.down,dirs.left,dirs.right].filter(x=> canEnter(tc+x.x,tr+x.y,true,g.inHouse) && !(x.x===g.dir.x && x.y===g.dir.y));
        if(rnd.length){ g.dir = rnd[Math.floor(Math.random()*rnd.length)]; }
        g.repeatCount=0;
      }
    } else { g.repeatCount=0; g.lastDir = {x:g.dir.x,y:g.dir.y}; }
    // Oscillation detection: se sta invertendo avanti/indietro per 2 volte, randomizza
    g.dirHistory.push({x:g.dir.x,y:g.dir.y}); if(g.dirHistory.length>4) g.dirHistory.shift();
    if(g.dirHistory.length>=4){
      const a=g.dirHistory[g.dirHistory.length-4], b=g.dirHistory[g.dirHistory.length-3], c=g.dirHistory[g.dirHistory.length-2], d=g.dirHistory[g.dirHistory.length-1];
      if(isOpposite(a,b) && isOpposite(c,d)){
        g.oscillateCount++;
      } else { g.oscillateCount=0; }
    }
    if(g.oscillateCount>=1){
      const rnd = [dirs.up,dirs.down,dirs.left,dirs.right].filter(x=> canEnter(tc+x.x,tr+x.y,true,g.inHouse));
      if(rnd.length){ g.dir = rnd[Math.floor(Math.random()*rnd.length)]; }
      g.oscillateCount=0;
    }
    if(g.stuckTimer > 1.2){
      const p = posToTile(pacman.x,pacman.y);
      const dx = Math.sign(p.col - tc), dy = Math.sign(p.row - tr);
      // prova assi prioritizzando l'asse di maggiore distanza
      const tryDirs = (Math.abs(p.col-tc) > Math.abs(p.row-tr)) ? [{x:dx,y:0},{x:0,y:dy}] : [{x:0,y:dy},{x:dx,y:0}];
      for(const d of tryDirs){ if(canEnter(tc+d.x, tr+d.y, true, g.inHouse)){ g.dir = d; break; } }
      g.stuckTimer = 0.6; // evita ripetizioni troppo frequenti
    }
  }
  moveEntity(g, dt, true);
  g.x = wrapX(g.x);
}

function checkCollisions(){
  // Pac-Man eats pellets
  const pCol = Math.round(pacman.x/TILE);
  const pRow = Math.round(pacman.y/TILE);
  eatAt(pCol,pRow);
  tryEatFruit();
  // Ghost interactions
  ghosts.forEach(g=>{
    const gCol = Math.round(g.x/TILE);
    const gRow = Math.round(g.y/TILE);
    const dx = (g.x - pacman.x); const dy = (g.y - pacman.y);
    const close = (gCol===pCol && gRow===pRow) || (dx*dx+dy*dy) < (TILE*0.4)*(TILE*0.4);
    if(close){
      if(g.mode==="frightened"){
        const chain = state.eatenInFright++;
        const pts = [200,400,800,1600][Math.min(chain,3)];
        state.score += pts; soundGhostEat(chain);
        g.mode = "eyes"; g.speed = 90; // eyes move faster to house
      } else if(g.mode!=="eyes"){
        // death
        state.lives--;
        soundDeath();
        if(state.lives <= 0){
          gameOver();
        } else {
          // full reset to level state to avoid overlaps and restore timers
          resetLevel(false);
        }
      }
    }
  });
  if(state.pelletsRemaining<=0){
    state.fruitShown1=false; state.fruitShown2=false; fruit=null;
    resetLevel(true);
    state.score += 100; // level bonus
    if(Math.floor(state.score/10000) > Math.floor((state.score-100)/10000)) state.lives++;
  }
}

function gameOver(){
  state.paused = true;
  // reset after short delay
  setTimeout(()=>{
    state.score=0; state.lives=3; state.level=1; state.fruitShown1=false; state.fruitShown2=false; restorePellets(); resetLevel(false);
    state.paused=false; soundIntro();
  },1200);
}

// ---------- Input ----------
document.addEventListener("keydown", (e)=>{
  const code = e.code || e.key;
  if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","KeyP","Up","Down","Left","Right","p","P"].includes(code)) e.preventDefault();
  if(code==="ArrowUp"||code==="Up") input.desiredDir = dirs.up;
  if(code==="ArrowDown"||code==="Down") input.desiredDir = dirs.down;
  if(code==="ArrowLeft"||code==="Left") input.desiredDir = dirs.left;
  if(code==="ArrowRight"||code==="Right") input.desiredDir = dirs.right;
  if(code==="KeyP"||code==="p"||code==="P") togglePause();
  unlockAudio();
  // se l'utente preme una freccia e il gioco era in pausa, riprendi
  if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Up","Down","Left","Right"].includes(code)){
    if(state.paused){ state.paused=false; if(pauseToggle) pauseToggle.textContent = "Pause"; }
  }
});

// Pause with canvas tap only on touch devices (mobile/tablet)
canvas.addEventListener("pointerdown", ()=>{
  const isTouch = matchMedia("(pointer: coarse)").matches;
  if(isTouch) togglePause();
});

audioToggle.addEventListener("click", ()=>{
  state.audioOn = !state.audioOn; unlockAudio(); audioToggle.textContent = `Audio: ${state.audioOn?"On":"Off"}`;
});

pauseToggle.addEventListener("click", ()=>{ togglePause(); });

function togglePause(){
  state.paused = !state.paused;
  if(pauseToggle) pauseToggle.textContent = state.paused?"Resume":"Pause";
}

fullscreenBtn.addEventListener("click", async()=>{
  try{ await requestFullscreen(document.documentElement); }catch(e){}
});

exportSpritesBtn.addEventListener("click", ()=> sprite.exportPNG());

async function requestFullscreen(elem){
  if(elem.requestFullscreen) return elem.requestFullscreen();
  if(elem.webkitRequestFullscreen) return elem.webkitRequestFullscreen();
  if(elem.msRequestFullscreen) return elem.msRequestFullscreen();
}

// Unlock audio on first general click/tap anywhere
document.addEventListener('pointerdown', ()=>{ unlockAudio(); }, { once:true });

// Touch D-Pad
const dpadButtons = Array.from(document.querySelectorAll('.pad-btn'));
dpadButtons.forEach(btn=>{
  const dir = btn.getAttribute('data-dir');
  const map = {up:dirs.up,down:dirs.down,left:dirs.left,right:dirs.right};
  const handler = (e)=>{ e.preventDefault(); input.desiredDir = map[dir]; unlockAudio(); };
  btn.addEventListener('pointerdown', handler);
});

// Swipe
let swipeStart=null;
canvas.addEventListener('touchstart', (e)=>{ swipeStart = {x: e.touches[0].clientX, y: e.touches[0].clientY}; });
canvas.addEventListener('touchend', (e)=>{
  if(!swipeStart) return; const dx = e.changedTouches[0].clientX - swipeStart.x; const dy = e.changedTouches[0].clientY - swipeStart.y;
  if(Math.abs(dx)>Math.abs(dy)) input.desiredDir = dx>0?dirs.right:dirs.left; else input.desiredDir = dy>0?dirs.down:dirs.up;
  swipeStart=null; unlockAudio();
});

// Show touch controls if no keyboard
function detectTouch(){
  const hasTouch = matchMedia("(pointer: coarse)").matches;
  touchControls.setAttribute("aria-hidden", hasTouch?"false":"true");
  touchControls.classList.toggle("hidden", !hasTouch);
}
detectTouch();
window.addEventListener('resize', detectTouch);

// Free-Ghost button logic
if(freeGhostBtn){
  freeGhostBtn.addEventListener("click", ()=>{
    ghosts.forEach((g)=>{
      const isStuck = g.stuckTimer > 0.8 || (g.dir.x===0 && g.dir.y===0 && atTileCenter(g));
      if(isStuck){
        // respawn to a random corridor tile near center, not a wall
        const slots = GHOST_SLOTS;
        const rnd = slots[Math.floor(Math.random()*slots.length)];
        g.x = rnd.c*TILE; g.y = rnd.r*TILE; snapToGrid(g);
        g.dir = [{x:0,y:-1},{x:1,y:0},{x:-1,y:0},{x:0,y:1}][Math.floor(Math.random()*4)];
        g.inHouse = true; g.mode = "scatter"; g.stuckTimer = 0; g.dirHistory=[]; g.oscillateCount=0;
      }
    });
  });
}

// ---------- Game Loop ----------
let lastTime = performance.now();
function loop(now){
  const dt = Math.min(0.05, (now - lastTime)/1000);
  lastTime = now;
  if(!state.paused){
    state.globalTime += dt;
    updateModes(dt);
    // move Pac-Man
    moveEntity(pacman, dt, false);
    // set mouth animation
    pacman.mouth += dt;
    // ghosts
    ghosts.forEach(g=> updateGhost(g, dt));
    // fruit timer
    if(fruit){ fruit.timer -= dt; if(fruit.timer<=0) fruit=null; }
    // collisions and eats
    checkCollisions();
  }
  drawMaze();
  drawFruit();
  drawEntity();
  drawHUD();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);


