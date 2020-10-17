
const instructions =
    `The game has a hexagonal playing area composed of 19 discs,
     with each player having three moveable tokens, that start in alternating vertices around the hexagon.
    Every turn, a player must do two things, in order:
    
        - Move one of their tokens in a straight line up to the end of the board or up to colliding with another token
        - Move one of the exterior empty discs to another location on the playing area where it touches at least two discs.
    Whoever first manages to connect their three tokens wins!`

const newGameOptionsItems = {
    player1: {
        color: '#F79B18',
        textAndPosition: ['Player 1', 350, 180],
        inputPosition: {
            x: 300,
            y: 200,
            width: 250,
            height: 60,
        },
    },
    player2: {
        color: '#00ADEF',
        textAndPosition: ['Player 2', 650, 180],
        inputPosition: {
            x: 600,
            y: 200,
            width: 250,
            height: 60,
        },
    },
    confirmButton: {
        color: 'green',
        textAndPosition: [`LOS GEHT'S!`, 575, 320],
        buttonPosition: {
            x: 475,
            y: 300,
            width: 200,
            height: 60
        }
    }
}

class Menu {
    constructor() {
        this.pid = ''
        this.showInstructions = false
        this.showNewGameOptions = false
        this.textSelectAtPlayer1 = true
        this.player1 = ''
        this.player2 = ''
    }
    setup() {
        this.menuItems = {
            title: {
                content: 'YESNAGA',
                color: 'black',
                textAlign: [CENTER, TOP],
                x: 0,
                y: 60,
                textSize: width / 10,
                allowHovering: false,
                click: function () {
                    console.log('https://github.com/Ojself/yesnaga')
                }
            },
            newGame: {
                content: 'New Game',
                color: 'black',
                textAlign: [CENTER, TOP],
                x: 0,
                y: 250,
                textSize: width / 14,
                allowHovering: true,
                click: () => {
                    this.showNewGameOptions = true
                    this.hideAllMenuItems()
                }
            },
            continueGame: {
                content: 'Continue Game',
                color: this.pid ? 'black' : 'grey',
                textAlign: [CENTER, TOP],
                x: 0,
                y: 370,
                textSize: width / 14,
                allowHovering: !!this.pid,
                click: () => {
                    console.log('continue game')
                }
            },
            instructions: {
                content: 'Instructions',
                color: 'black',
                textAlign: [CENTER, TOP],
                x: 0,
                y: 490,
                textSize: width / 14,
                allowHovering: true,
                click: () => this.showInstructions = !this.showInstructions
            },
        }
    }

    draw() {
        clear()
        Object.keys(this.menuItems).forEach((menuItem) => {
            const item = this.menuItems[menuItem]
            item.hovering = hoveringMenuItemCheck(item)
            drawContent(item)
        })

        if (this.showNewGameOptions) {
            drawNewGameOptions(this.player1, this.player2)
        }

        if (this.showInstructions) {
            textSize(width / 60);
            fill("black")
            textAlign(CENTER, TOP)
            text(instructions, 600, this.menuItems.instructions.y + 100)
        }

    }
    mouseClicked(event) {
        const currentMenuItem = Object.keys(this.menuItems).find(menuItem => {
            return hoveringMenuItemCheck(this.menuItems[menuItem], event)
        })
        if (currentMenuItem) {
            this.menuItems[currentMenuItem].click()
        }
        if (this.showNewGameOptions) {

        }
    }
    hideAllMenuItems(exception = '') {
        this.showInstructions = false
        Object.keys(this.menuItems).forEach(menuItem => {
            this.menuItems[menuItem].hide = !exception.includes(menuItem)
        })
    }
    keyPressed(key) {
        // ignores all input if the input fields are now visibles
        if (!this.showNewGameOptions) {
            return
        }

        switch (key) {
            // alternates between playerinput fields
            case 'Tab':
                this.textSelectAtPlayer1 = !this.textSelectAtPlayer1
                break;
            // shortcut to start the game
            case 'Enter':
                console.log('starting game')
            // Allows the player to redifine the name
            case 'Backspace':
                if (this.textSelectAtPlayer1) {
                    this.player1 = this.player1.slice(0, -1);
                } else {
                    this.player2 = this.player2.slice(0, -1);
                }
            default:
                // prevents meta keys (ALT, TAB, BACKSPACE etcs)
                if (key.length > 1) return
                if (this.textSelectAtPlayer1) {
                    this.player1 += key
                } else {
                    this.player2 += key
                }
                break;
        }

    }
}

const hoveringMenuItemCheck = (menuItem, event = { pageY: mouseY + 30, pageX: mouseX + 30 }) => {
    const [verticalOffset, horizontalOffset] = [40, 490]
    const { pageY, pageX } = event
    const [adjustedY, adjustedX] = [pageY - verticalOffset, pageX - horizontalOffset]

    // TODO add horizontal check too
    return adjustedY > menuItem.y
        && adjustedY < menuItem.y + menuItem.textSize
        && adjustedX > menuItem.x
        && adjustedX < menuItem.x + width / 2
}

const drawContent = (menuItem) => {
    if (menuItem.hide) return;
    textSize(menuItem.textSize);
    textAlign(...menuItem.textAlign)

    fill(menuItem.hovering && menuItem.allowHovering ? 'orange' : menuItem.color)
    text(menuItem.content, menuItem.x, menuItem.y, width)
}



const drawNewGameOptions = (player1Name, player2Name) => {
    drawPlayerInput(newGameOptionsItems.player1, player1Name)
    drawPlayerInput(newGameOptionsItems.player2, player2Name)


    // textSelectCursor
    fill('black')
    if (frameCount % 60 > 30) {
        // prevents the textselect to show if name has a value
        if ((menu.textSelectAtPlayer1 && !player1Name) || (!menu.textSelectAtPlayer1 && !player2Name)) {
            const selectPosition = menu.textSelectAtPlayer1 ? [315, 215, 315, 245] : [615, 215, 615, 245]
            line(...selectPosition)
        }
    }

    // confirmButton
    const { buttonPosition } = newGameOptionsItems.confirmButton
    fill(newGameOptionsItems.confirmButton.color)
    rect(buttonPosition.x, buttonPosition.y, buttonPosition.width, buttonPosition.height, 20)
    textSize(width / 60)
    fill('white')
    text(...newGameOptionsItems.confirmButton.textAndPosition)
}


const drawPlayerInput = (player, name) => {
    fill(player.color)
    text(...player.textAndPosition)
    fill('white')
    const { inputPosition } = player
    rect(inputPosition.x, inputPosition.y, inputPosition.width, inputPosition.height, 20)
    fill('black')
    textAlign(LEFT)
    text(name, inputPosition.x + 20, inputPosition.y + 20)
    textAlign(CENTER)
}
