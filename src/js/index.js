

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 1

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    }
})

const enemy = new Fighter({
    position: {
        x: 500,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

function rectangularCollision({ rect1, rect2 }) {
    return (
        rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
        rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
        rect1.attackBox.position.y <= rect2.position.y + rect2.height &&
        rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y &&
        rect1.isAttacking
    )
}

function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId)
    let displayText = null
    if (player.health === enemy.health) {
        displayText = 'Tie'
    }
    else if (player.health > enemy.health) {
        displayText = 'Player 1 Wins' 
    }
    else if (player.health < enemy.health) {
        displayText = 'Player 2 Wins'
    }
    document.querySelector('#displayText').innerHTML = displayText
    document.querySelector('#displayText').style.display = 'flex'
}

let timer = 60
let timerId
function decreaseTimer() {
    timerId = setTimeout(decreaseTimer, 1000)
    if (timer > 0) {
        timer -= 1
        document.querySelector('#timer').innerHTML = timer
    }

    if (timer === 0) {
        determineWinner({player, enemy, timerId})
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    const speed = 10
    const demage = 20

    // player movement
    player.velocity.x = 0
    if (keys.d.pressed && keys.a.pressed) {
        player.velocity.x = player.lastKey == 'd' ? speed : speed * -1
    }
    else if (keys.d.pressed) {
        player.velocity.x = speed
    }
    else if (keys.a.pressed) {
        player.velocity.x = speed * -1
    }

    // enemy movement
    enemy.velocity.x = 0
    if (keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight') {
        enemy.velocity.x = speed
    }
    else if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft') {
        enemy.velocity.x = speed * -1
    }

    // detect for collision
    if (rectangularCollision({ rect1: player, rect2: enemy })) {
        console.log('ENEMY GOT HIT')
        enemy.health -= demage
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
        player.isAttacking = false
    }

    if (rectangularCollision({ rect1: enemy, rect2: player })) {
        console.log('PLAYER GOT HIT')
        player.health -= demage
        document.querySelector('#playerHealth').style.width = player.health + '%'
        enemy.isAttacking = false
    }

    // end the game based on health
    if (enemy.health <= 0 || player.attack <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'w':
            player.velocity.y = -20
            break
        case ' ':
            player.attack()
            break
    }

    // enemy keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -20
            break
        case 'ű':
            enemy.attack()
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'w':
            keys.w.pressed = false
            break
    }

    //enemy  keys
    switch (event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break
    }
})
