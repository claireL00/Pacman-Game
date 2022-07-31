const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const scoreEl = document.querySelector('#scoreEl')
const startGameBtn = document.querySelector('#startGameBtn')
const modalEl = document.querySelector('#modalEl')
const resultEl = document.querySelector('#resultEl')
const bigScoreEl = document.querySelector('#bigScoreEl')
const pointsEl = document.querySelector('#pointsEl')

//background music
var arcade=document.querySelector("#arcade")
var gameOver=document.querySelector("#gameOver")
var hit=document.querySelector("#hit")

canvas.width = innerWidth
canvas.height = innerHeight

class Boundary {
    static width = 40
    static height = 40
    constructor({ position, image }) {
        this.position = position
        this.width = 40
        this.height = 40
        this.image = image
    }

    draw() {
        // context.fillStyle = "blue"
        // context.fillRect(this.position.x, this.position.y, this.width, this.height)
        context.drawImage(this.image, this.position.x, this.position.y)
    }
}

class Player {
    constructor({
        position, velocity
    }) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.radians =0.75
        this.openRate=0.12
        this.rotation=0
    }

    draw() {
        context.save()
        context.translate(this.position.x, this.position.y)
        context.rotate(this.rotation)
        context.translate(-this.position.x, -this.position.y)
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 -this.radians)
        context.lineTo(this.position.x, this.position.y)
        context.fillStyle = "yellow"
        context.fill()
        context.closePath()
        context.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.radians < 0 || this.radians >0.75) this.openRate =- this.openRate

        this.radians += this.openRate
    }
}
class Ghost {
    static speed = 2
    constructor({
        position, velocity, color = 'red'
    }) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.color = color
        this.prevCollisions = []
        this.speed = 2
        this.scared = false
    }

    draw() {
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        context.fillStyle = this.scared ? 'blue' : this.color
        context.fill()
        context.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
class Pellet {
    constructor({
        position
    }) {
        this.position = position
        this.radius = 3
    }

    draw() {
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        context.fillStyle = "white"
        context.fill()
        context.closePath()
    }

}

class PowerUp {
    constructor({
        position
    }) {
        this.position = position
        this.radius = 8
    }

    draw() {
        context.beginPath()
        context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        context.fillStyle = "white"
        context.fill()
        context.closePath()
    }

}

let pellets = []
let boundaries = []
let powerUps = []
let ghosts = [
    new Ghost({
        position: {
            x: Boundary.width * 6 + Boundary.width / 2,
            y: Boundary.height + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        }
    }),
    new Ghost({
        position: {
            x: Boundary.width * 6 + Boundary.width / 2,
            y: Boundary.height * 3 + Boundary.height / 2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: 'pink'
    })
]

let player = new Player({
    position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2
    },
    velocity: {
        x: 0,
        y: 0
    },
})
let keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
}

let lastKey = ""
let score = 0

let map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

//restart game
function init(){
    ghosts = [
        new Ghost({
            position: {
                x: Boundary.width * 6 + Boundary.width / 2,
                y: Boundary.height + Boundary.height / 2
            },
            velocity: {
                x: Ghost.speed,
                y: 0
            }
        }),
        new Ghost({
            position: {
                x: Boundary.width * 6 + Boundary.width / 2,
                y: Boundary.height * 3 + Boundary.height / 2
            },
            velocity: {
                x: Ghost.speed,
                y: 0
            },
            color: 'pink'
        })
    ]
    player = new Player({
        position: {
            x: Boundary.width + Boundary.width / 2,
            y: Boundary.height + Boundary.height / 2
        },
        velocity: {
            x: 0,
            y: 0
        },
    })
    keys = {
        w: {
            pressed: false
        },
        a: {
            pressed: false
        },
        s: {
            pressed: false
        },
        d: {
            pressed: false
        },
    }
    
    map = [
        ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
        ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
        ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
        ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
        ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
        ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
        ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
        ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
        ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
        ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
        ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
        ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
        ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
    ]
    lastKey = ""
    score = 0

    map.forEach((row, i) => {
        row.forEach((symbol, j) => {
            switch (symbol) {
                case '-':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('./img/pipeHorizontal.png')
                        })
                    )
                    break
                case '|':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('./img/pipeVertical.png')
                        })
                    )
                    break
                case '1':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('./img/pipeCorner1.png')
                        })
                    )
                    break
                case '2':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('./img/pipeCorner2.png')
                        })
                    )
                    break
                case '3':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('./img/pipeCorner3.png')
                        })
                    )
                    break
                case '4':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('./img/pipeCorner4.png')
                        })
                    )
                    break
                case 'b':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: Boundary.width * j,
                                y: Boundary.height * i
                            },
                            image: createImage('./img/block.png')
                        })
                    )
                    break
                case '[':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width,
                                y: i * Boundary.height
                            },
                            image: createImage('./img/capLeft.png')
                        })
                    )
                    break
                case ']':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width,
                                y: i * Boundary.height
                            },
                            image: createImage('./img/capRight.png')
                        })
                    )
                    break
                case '_':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width,
                                y: i * Boundary.height
                            },
                            image: createImage('./img/capBottom.png')
                        })
                    )
                    break
                case '^':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width,
                                y: i * Boundary.height
                            },
                            image: createImage('./img/capTop.png')
                        })
                    )
                    break
                case '+':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width,
                                y: i * Boundary.height
                            },
                            image: createImage('./img/pipeCross.png')
                        })
                    )
                    break
                case '5':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width,
                                y: i * Boundary.height
                            },
                            color: 'blue',
                            image: createImage('./img/pipeConnectorTop.png')
                        })
                    )
                    break
                case '6':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width,
                                y: i * Boundary.height
                            },
                            color: 'blue',
                            image: createImage('./img/pipeConnectorRight.png')
                        })
                    )
                    break
                case '7':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width,
                                y: i * Boundary.height
                            },
                            color: 'blue',
                            image: createImage('./img/pipeConnectorBottom.png')
                        })
                    )
                    break
                case '8':
                    boundaries.push(
                        new Boundary({
                            position: {
                                x: j * Boundary.width,
                                y: i * Boundary.height
                            },
                            image: createImage('./img/pipeConnectorLeft.png')
                        })
                    )
                    break
                case '.':
                    pellets.push(
                        new Pellet({
                            position: {
                                x: j * Boundary.width + Boundary.width / 2,
                                y: i * Boundary.height + Boundary.height / 2
                            }
                        })
                    )
                    break
                case 'p':
                    powerUps.push(
                        new PowerUp({
                            position: {
                                x: j * Boundary.width + Boundary.width / 2,
                                y: i * Boundary.height + Boundary.height / 2
                            }
                        })
                    )
                    break
            }
        })
    })
}


function createImage(src) {
    const image = new Image()
    image.src = src
    return image
}

function circleCollidesWithRectangle({
    circle,
    rectangle
}) {
    const padding = Boundary.width / 2 - circle.radius - 1
    return (circle.position.y - circle.radius + circle.velocity.y
        <= rectangle.position.y + rectangle.height + padding &&
        circle.position.x + circle.radius + circle.velocity.x
        >=
        rectangle.position.x - padding &&
        circle.position.y + circle.radius + circle.velocity.y
        >= rectangle.position.y - padding
        && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding)
}

let animationId
function animate() {
    animationId = requestAnimationFrame(animate)
    console.log(animationId)
    context.clearRect(0, 0, canvas.width, canvas.height)

    if (keys.w.pressed && lastKey === 'w') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 0,
                        y: -5
                    }
                }, rectangle: boundary
            })) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = -5
            }
        }
    } else if (keys.a.pressed && lastKey === 'a') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: -5,
                        y: 0
                    }
                }, rectangle: boundary
            })) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = -5
            }
        }
    } else if (keys.s.pressed && lastKey === 's') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 0,
                        y: 5
                    }
                }, rectangle: boundary
            })) {
                player.velocity.y = 0
                break
            } else {
                player.velocity.y = 5
            }
        }
    } else if (keys.d.pressed && lastKey === 'd') {
        for (let i = 0; i < boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleCollidesWithRectangle({
                circle: {
                    ...player, velocity: {
                        x: 5,
                        y: 0
                    }
                }, rectangle: boundary
            })) {
                player.velocity.x = 0
                break
            } else {
                player.velocity.x = 5
            }
        }
    }
    //detect collision between ghosts and player
    for (let i = ghosts.length - 1; 0 <= i; i--) {
        const ghost =ghosts[i]
        //ghost touches player
        if (Math.hypot(ghost.position.x - player.position.x, ghost.position.y - player.position.y) < ghost.radius + player.radius ) {
            if (ghost.scared){
                hit.play()
                ghosts.splice(i,1)
            }else{
            //You lose
            cancelAnimationFrame(animationId)
            modalEl.style.display='flex'
            resultEl.innerHTML="You Lose"
            bigScoreEl.innerHTML=score
            pointsEl.innerHTML="Points"
            arcade.pause()
            gameOver.play()
            }
        }
    }

    //win condition goes here
    if(pellets.length===0){
        cancelAnimationFrame(animationId)
        modalEl.style.display='flex'
        resultEl.innerHTML="You Win"
        bigScoreEl.innerHTML=score
        pointsEl.innerHTML="Points"
        arcade.pause()
        gameOver.play()
    }
    //power ups go
    for (let i = powerUps.length - 1; 0 <= i; i--) {
        const powerUp = powerUps[i]
        powerUp.draw()

        //if player collides with powerUp
        if (Math.hypot(powerUp.position.x - player.position.x, powerUp.position.y - player.position.y) < powerUp.radius + player.radius) {
            powerUps.splice(i, 1)
            hit.play()
            //make ghosts scared
            ghosts.forEach(ghost => {
                ghost.scared = true

                setTimeout(() => {
                    ghost.scared = false
                }, 5000 //5 seconds
                )
            })
        }
    }
    //touch pellets here
    for (let i = pellets.length - 1; 0 <= i; i--) {
        const pellet = pellets[i]
        pellet.draw()

        if (Math.hypot(pellet.position.x - player.position.x, pellet.position.y - player.position.y) < pellet.radius + player.radius) {
            pellets.splice(i, 1) //remove one pellet touched
            score += 10
            scoreEl.innerHTML = score
        }
    }

    boundaries.forEach((boundary) => {
        boundary.draw()

        //if player collides with the boundary
        //top,right,bottom,left
        if (circleCollidesWithRectangle({ circle: player, rectangle: boundary })) {
            player.velocity.x = 0
            player.velocity.y = 0
        }
    })
    player.update()
    ghosts.forEach(ghost => {
        ghost.update()


        const collisions = []
        boundaries.forEach(boundary => {
            //right
            if (
                !collisions.includes('right') &&
                circleCollidesWithRectangle({
                    circle: {
                        ...ghost, velocity: {
                            x: ghost.speed,
                            y: 0
                        }
                    }, rectangle: boundary
                })) {
                collisions.push('right')
            }
            //left
            if (
                !collisions.includes('left') && circleCollidesWithRectangle({
                    circle: {
                        ...ghost, velocity: {
                            x: -ghost.speed,
                            y: 0
                        }
                    }, rectangle: boundary
                })) {
                collisions.push('left')
            }

            //up
            if (
                !collisions.includes('up') && circleCollidesWithRectangle({
                    circle: {
                        ...ghost, velocity: {
                            x: 0,
                            y: -ghost.speed
                        }
                    }, rectangle: boundary
                })) {
                collisions.push('up')
            }

            //down
            if (
                !collisions.includes('down') && circleCollidesWithRectangle({
                    circle: {
                        ...ghost, velocity: {
                            x: 0,
                            y: ghost.speed
                        }
                    }, rectangle: boundary
                })) {
                collisions.push('down')
            }
        })//end of for each
        if (collisions.length > ghost.prevCollisions.length)
            ghost.prevCollisions = collisions
        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {

            if (ghost.velocity.x > 0) ghost.prevCollisions.push('right')
            else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left')
            else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up')
            else if (ghost.velocity.y > 0) ghost.prevCollisions.push('down')

            console.log(collisions)
            console.log(ghost.prevCollisions)

            const pathways = ghost.prevCollisions.filter(collision => {
                return !collisions.includes(collision)
            })
            console.log({ pathways })

            const direction = pathways[Math.floor(Math.random() * pathways.length)]

            console.log({ direction })
            switch (direction) {
                case 'down':
                    ghost.velocity.y = ghost.speed
                    ghost.velocity.x = 0
                    break
                case 'up':
                    ghost.velocity.y = -ghost.speed
                    ghost.velocity.x = 0
                    break
                case 'right':
                    ghost.velocity.y = 0
                    ghost.velocity.x = ghost.speed
                    break
                case 'left':
                    ghost.velocity.y = 0
                    ghost.velocity.x = -ghost.speed
                    break
            }
            ghost.prevCollisions = []
        }
    })

    //player rotation
    if(player.velocity.x>0)player.rotation=0
    else if(player.velocity.x<0)player.rotation= Math.PI
    else if(player.velocity.y>0)player.rotation= Math.PI/2
    else if(player.velocity.y<0)player.rotation= Math.PI*1.5
}//end of animate


addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKey = 'd'
            break
    }

})
addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }

})

startGameBtn.addEventListener('click',()=>{
    init()
    animate()
    arcade.play();
    modalEl.style.display='none'
})