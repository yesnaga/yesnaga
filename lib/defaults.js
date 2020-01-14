module.exports = {
	players: {
		0: [16, 8, 12],
		1: [18, 10, 14],
	},
	tiles: {
		0: {
			neighbours: {
				r: 2,
				l: 5,
				tr: 1,
				tl: 6,
				br: 3,
				bl: 4,
			},
		},
		1: {
			neighbours: {
				r: 9,
				l: 6,
				tr: 8,
				tl: 7,
				br: 2,
				bl: 0,
			},
		},
		2: {
			neighbours: {
				r: 10,
				l: 0,
				tr: 9,
				tl: 1,
				br: 11,
				bl: 3,
			},
		},
		3: {
			neighbours: {
				r: 11,
				l: 4,
				tr: 2,
				tl: 1,
				br: 12,
				bl: 13,
			},
		},
		4: {
			neighbours: {
				r: 3,
				l: 15,
				tr: 0,
				tl: 5,
				br: 13,
				bl: 14,
			},
		},
		5: {
			neighbours: {
				r: 0,
				l: 16,
				tr: 6,
				tl: 17,
				br: 4,
				bl: 15,
			},
		},
		6: {
			neighbours: {
				r: 1,
				l: 17,
				tr: 7,
				tl: 18,
				br: 0,
				bl: 5,
			},
		},
		7: {
			neighbours: {
				r: 8,
				l: 18,
				br: 1,
				bl: 6,
			},
		},
		8: {
			neighbours: {
				l: 7,
				br: 9,
				bl: 1,
			},
		},
		9: {
			neighbours: {
				l: 1,
				tl: 8,
				bl: 2,
				br: 10,
			},
		},
		10: {
			neighbours: {
				l: 2,
				tl: 9,
				bl: 11,
			},
		},
		11: {
			neighbours: {
				l: 3,
				tr: 10,
				tl: 2,
				bl: 12,
			},
		},
		12: {
			neighbours: {
				l: 13,
				tl: 3,
				tr: 11,
			},
		},
		13: {
			neighbours: {
				l: 14,
				r: 12,
				tl: 4,
				tr: 3,
			},
		},
		14: {
			neighbours: {
				tl: 15,
				tr: 4,
				r: 13,
			},
		},
		15: {
			neighbours: {
				tl: 16,
				tr: 5,
				r: 4,
				br: 14,
			},
		},
		16: {
			neighbours: {
				tr: 17,
				r: 5,
				br: 15,
			},
		},
		17: {
			neighbours: {
				tr: 18,
				r: 6,
				br: 5,
				bl: 16,
			},
		},
		18: {
			neighbours: {
				r: 7,
				br: 6,
				bl: 17,
			},
		},
	},
};
