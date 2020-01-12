console.log('logic');
const tiles = {
  0: {
    neighbours: {
      r: 1,
      bl: 2,
      br: 3
    },
    movable: false
  },
  1: {
    neighbours: {
      l: 0,
      bl: 3,
    }, movable: false
  },
  2: {
    neighbours: {
      tr: 0,
      r: 3
    }, movable: false
  },
  3: {
    neighbours: {
      tl: 0,
      tr: 1,
      l: 2,
      br: 4,
    }, movable: false
  },
  4: {
    neighbours: {
      tl: 3,
      br: 5
    }, movable: true
  },
  5: {
    neighbours: {
      tl: 3,
      br: 5
    }, movable: false
  },
  6: {
    neighbours: {
      tl: 5,
      br: 5
    }
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
  fill(255);
  // adds weight to movable circles
  if (tiles[id].movable) {
    strokeWeight(4);
  }
  ellipse(x, y, d);
  strokeWeight(1);

  /* textSize(32);
  fill(0, 102, 153);
  text(id.toString(), x, y) */
  const p1Color = '#F79B18'
  const p2Color = '#00ADEF'
  if (players[0].includes(id)) {
    fill(p1Color);
    ellipse(x, y, d - 20);
  }
  if (players[1].includes(id)) {
    fill(p2Color);
    ellipse(x, y, d - 20);

  }
  const t = tiles[id].neighbours

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