console.log('logic');
const tiles = {
  0: {
    r: 1,
    bl: 2,
    br: 3
  },
  1: {
    l: 0,
    bl: 3,
  },
  2: {
    tr: 0,
    r: 3
  },
  3: {
    tl: 0,
    tr: 1,
    l: 2,
    br: 4,
  },
  4: {
    tl: 3,
    br: 5
  },
  5: {
    tl: 3,
    br: 5
  },
  6: {
    tl: 5,
    br: 5
  }
}
const players = {
  // player one
  0: [2, 4, 6],
  // player two
  1: [1, 3, 5]
}

function setup() {
  createCanvas(1000, 600);
  background(100, 200, 100);
  noLoop();
}

function draw() {
  console.log('hello')
  const drawn = []
  drawTile(0, 200, 200, drawn)
}

function drawTile(id, x, y, drawn) {
  console.log(...arguments)
  const sin30 = Math.sin(Math.PI / 6)
  const sin60 = Math.sin(Math.PI / 3)
  const sin90 = Math.sin(Math.PI / 2)

  // d 
  const d = 80
  // m
  const m = 2
  drawn.push(id)
  ellipse(x, y, d);
  const t = tiles[id]

  const neighbours = {
    tl: {
      x: (oldX) => oldX - (d + m) * sin30 / sin90,
      y: (oldY) => oldY - (d + m) * sin60 / sin90
    },
    tr: {
      x: (oldX) => oldX + (d + m) * sin30 / sin90,
      y: (oldY) => oldY - (d + m) * sin60 / sin90
    },
    l: {
      x: (oldX) => oldX - (d + m),
      y: (oldY) => oldY
    },
    r: {
      x: (oldX) => oldX + (d + m),
      y: (oldY) => oldY
    },
    bl: {
      x: (oldX) => oldX - (d + m) * sin30 / sin90,
      y: (oldY) => oldY + (d + m) * sin60 / sin90
    },
    br: {
      x: (oldX) => oldX + (d + m) * sin30 / sin90,
      y: (oldY) => oldY + (d + m) * sin60 / sin90
    },
  }
  Object.keys(t).forEach(d => {
    if (!drawn.includes(t[d])) {
      drawTile(t[d], neighbours[d].x(x), neighbours[d].y(y), drawn)
    }
  })

}