const sin30 = Math.sin(Math.PI / 6);
const sin60 = Math.sin(Math.PI / 3);
const sin90 = Math.sin(Math.PI / 2);

const m = 4;
const d = 80;

const NEIGHBOURS = {
	tl: {
		x: (oldX) => oldX - (d + m) * sin30 / sin90,
		y: (oldY) => oldY - (d + m) * sin60 / sin90,
	},
	tr: {
		x: (oldX) => oldX + (d + m) * sin30 / sin90,
		y: (oldY) => oldY - (d + m) * sin60 / sin90,
	},
	l: {
		x: (oldX) => oldX - (d + m),
		y: (oldY) => oldY,
	},
	r: {
		x: (oldX) => oldX + (d + m),
		y: (oldY) => oldY,
	},
	bl: {
		x: (oldX) => oldX - (d + m) * sin30 / sin90,
		y: (oldY) => oldY + (d + m) * sin60 / sin90,
	},
	br: {
		x: (oldX) => oldX + (d + m) * sin30 / sin90,
		y: (oldY) => oldY + (d + m) * sin60 / sin90,
	},
};

// unused
/* const TILESSETUP = {
    0: {
        neighbours: {
            r: 2,
            l: 5,
            tr: 1,
            tl: 6,
            br: 3,
            bl: 4
        },
        movable: false
    },
    1: {
        neighbours: {
            r: 9,
            l: 6,
            tr: 8,
            tl: 7,
            br: 2,
            bl: 0
        },
        movable: false
    },
    2: {
        neighbours: {
            r: 10,
            l: 0,
            tr: 9,
            tl: 1,
            br: 11,
            bl: 3
        },
        movable: false
    },
    3: {
        neighbours: {
            r: 11,
            l: 4,
            tr: 2,
            tl: 1,
            br: 12,
            bl: 13
        }, movable: false
    },
    4: {
        neighbours: {
            r: 3,
            l: 15,
            tr: 0,
            tl: 5,
            br: 13,
            bl: 14
        }, movable: false
    },
    5: {
        neighbours: {
            r: 0,
            l: 16,
            tr: 6,
            tl: 17,
            br: 4,
            bl: 15
        }, movable: false
    },
    6: {
        neighbours: {
            r: 1,
            l: 17,
            tr: 7,
            tl: 18,
            br: 0,
            bl: 5
        }, movable: false
    },

    7: {
        neighbours: {
            r: 8,
            l: 18,
            br: 1,
            bl: 6
        }, movable: false
    },
    8: {
        neighbours: {
            l: 7,
            br: 9,
            bl: 1
        }, movable: false
    },
    9: {
        neighbours: {
            l: 1,
            tl: 8,
            bl: 2,
            br: 10
        }, movable: false
    },
    10: {
        neighbours: {
            l: 2,
            tl: 9,
            bl: 11
        }, movable: false
    },
    11: {
        neighbours: {
            l: 3,
            tr: 10,
            tl: 2,
            bl: 12,
        }, movable: false
    },

    12: {
        neighbours: {
            l: 13,
            tl: 3,
            tr: 11,
        }, movable: false
    },
    13: {
        neighbours: {
            l: 14,
            r: 12,
            tl: 4,
            tr: 3,
        }, movable: false
    },
    14: {
        neighbours: {
            tl: 15,
            tr: 4,
            r: 13,

        }, movable: false
    },
    15: {
        neighbours: {
            tl: 16,
            tr: 5,
            r: 4,
            br: 14,
        }, movable: false
    },
    16: {
        neighbours: {
            tr: 17,
            r: 5,
            br: 15
        }, movable: false
    },
    17: {
        neighbours: {
            tr: 18,
            r: 6,
            br: 5,
            bl: 16,
        }, movable: false
    },
    18: {
        neighbours: {
            r: 7,
            br: 6,
            bl: 17,
        }, movable: false
    },

} */
/* // unused
const PLAYERS = {
    // player one
    0: [16, 8, 12],
    // player two
    1: [18, 10, 14]
} */
