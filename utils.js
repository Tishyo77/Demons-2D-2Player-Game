//Collision detection
function playerCollision({rectangle1, rectangle2})
{

    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width - 250 >= rectangle2.position.x && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width + 250 && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
}

function enemyCollision({rectangle1, rectangle2})
{

    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width + 320 >= rectangle2.position.x && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width - 320 && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
}

//Winner determination
function determineWinner({player, enemy, timerId})
{
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex';
    if(player.health === enemy.health)
    {
        document.querySelector('#displayText').innerHTML = 'Tie';
    }
    else if(player.health > enemy.health)
    {
        document.querySelector('#displayText').innerHTML = 'Warrior Wins';
    }
    else if(player.health < enemy.health)
    {
        document.querySelector('#displayText').innerHTML = 'Demon Wins';
    }
}

let timer = 121;
let timerId;

//Game timer
function decreaseTimer()
{
    if(timer > 0)
    { 
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }
    if(timer === 0)
    {
        determineWinner({player, enemy, timerId});
    }
}