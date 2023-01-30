const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1520;
canvas.height = 730;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;
let playerAtkNo;
let enemyAtkNo;
let atk2Enable = 1;
let atk3Enable = 1;
let specAtk = 0;
let shieldUp = -1;

const background = new Sprite
({
    position:
    {
        x: 0,
        y: 0
    },
    imageSrc: 'Background.png'
});

//Player feature variables
const player = new Fighter
({
    position:
    {
        x: 200, 
        y: 10
    },
    velocity:
    {
        x: 0,
        y: 0
    },
    offset:
    {
        x: 0,
        y: 0
    },
    imageSrc: 'Warrior.png',
    framesMax: 7,
    scale: 0.42,
    offset:
    {
        x: 0,
        y: 0
    },
    sprites:
    {
        idle:
        {
            imageSrc: 'Warrior.png',
            framesMax: 1,
            scale: 0.42,
            offset:
            {
                x: 0,
                y: 0
            }
        },
        walk:
        {
            imageSrc: 'WarriorWalk.png',
            framesMax: 7,
            scale: 0.9,
            offset:
            {
                x: 0,
                y: 420
            }
        },
        jump:
        {
            imageSrc: 'WarriorJump.png',
            framesMax: 2,
            scale: 0.9,
            offset:
            {
                x: 325,
                y: 420
            }
        },
        attack:
        {
            imageSrc: 'WarriorAttack.png',
            framesMax: 4,
            scale: 0.9,
            offset:
            {
                x: 130,
                y: 410
            }
        }
    }
});

player.draw();

//Player feature variables
const enemy = new Fighter
({
    position:
    {
        x: 900, 
        y: 100
    },
    velocity:
    {
        x: 0,
        y: 0
    },
    offset:
    {
        x: -50,
        y: 0
    },
    imageSrc: 'Demon2.png',
    framesMax: 7,
    scale: 0.55,
    offset:
    {
        x: 0,
        y: 186
    },
    sprites:
    {
        idle:
        {
            imageSrc: 'Demon2.png',
            framesMax: 1,
            scale: 0.26,
            offset:
            {
                x: -200,
                y: 155
            }
        },
        walk:
        {
            imageSrc: 'DemonWalk2.png',
            framesMax: 5,
            scale: 0.55,
            offset:
            {
                x: -220,
                y: 315
            }
        },
        attack:
        {
            imageSrc: 'Demon2.png',
            framesMax: 1,
            scale: 0.26,
            offset:
            {
                x: -200,
                y: 155
            }
        }
    }
});

enemy.draw();

//Movement key presses
const keys = 
{
    a:
    {
        pressed: false
    },
    d:
    {
        pressed: false
    },
    ArrowRight:
    {
        pressed: false
    },
    ArrowLeft:
    {
        pressed: false
    }
}

let lastKey;

decreaseTimer();

//Attacking and moving
function animate()
{
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update();
    c.fillStyle = 'rgba(255, 255, 255, 0.2)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    if(keys.a.pressed && player.lastKey === 'a')
    {
        player.velocity.x = -1;
        player.switchSprite('walk');
    }
    else if(keys.d.pressed && player.lastKey === 'd')
    {
        player.velocity.x = 2.5;
        player.switchSprite('walk');
    }
    else
    {
        player.switchSprite('idle');
    }

    if(player.velocity.y < 0)
    {
        player.switchSprite('jump');
    }

    enemy.switchSprite('idle');
    if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft')
    {
        enemy.velocity.x = -0.5;
        enemy.switchSprite('walk');
    }
    else if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight')
    {
        enemy.velocity.x = 0.5;
        enemy.switchSprite('walk');
    }

    //Player attacking
    if(playerCollision({rectangle1: player, rectangle2: enemy}) && player.isAttacking)
    {
        player.isAttacking = false;
        if(playerAtkNo === 1)
            enemy.health -= 5;
        else if(playerAtkNo === 2)
            enemy.health -= 10;
        gsap.to('#enemyHealth', {width: enemy.health + '%'});
        if(enemy.health <= 0)
        {
            document.querySelector('#enemyHealth').style.width = 0 + '%';
            determineWinner({player, enemy, timerId});
        }
    }

    //Enemy attacking
    if((enemyCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking) || (enemy.isAttacking && enemyAtkNo === 2))
    {
        enemy.isAttacking = false;
        if(enemyAtkNo === 1)
        {
            if(shieldUp === -1)
            {
                player.health -= 10;
            }
        }
        else if(enemyAtkNo === 2)
        {
            if(player.position.y > 397)
                player.health -= 15;
        }
        else if(enemyAtkNo === 3)
        {
            player.health -= 15;
        }
        setTimeout(() => 
        {
            atk2Enable = 1;
        }, 5000)
        setTimeout(() => 
        {
            atk3Enable = 1;
        }, 7000)
        gsap.to('#playerHealth', {width: player.health + '%'});
        if(player.health <= 0)
        {
            document.querySelector('#playerHealth').style.width = 0 + '%';
            determineWinner({player, enemy, timerId});
        }
    }
}

animate();

//Key press functions
window.addEventListener('keydown', (event) => 
{
    switch(event.key)
    {
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
        break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
        break;
        case 'w':
            if(player.velocity.y == 0)
                player.velocity.y = -20;
            shieldUp = -1;
        break;
        case ' ':
            player.playerAttack();
        break;
        case 'Control':
            console.log(enemy.position.y);
            if(player.position.y > 397)
                shieldUp = shieldUp * (-1);
        break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
        break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
        break;
        case 'ArrowUp':
            if(enemy.velocity.y == 0)
                enemy.velocity.y = -14;
        break;
        case 'ArrowDown':
            enemy.enemyAttack();
        break;
        case 'Enter':
            if(atk3Enable === 1)
            {
                specAtk = 1;
                enemy.enemyAttack();
            }
        break;

    }
})

window.addEventListener('keyup', (event) => 
{
    switch(event.key)
    {
        case 'd':
            keys.d.pressed = false;
        break;
        case 'a':
            keys.a.pressed = false;
        break;
    }
})

window.addEventListener('keyup', (event) => 
{
    switch(event.key)
    {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
        break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
        break;
    }
})