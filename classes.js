class Sprite
{
    constructor({position, imageSrc, scale = 1, framesMax = 1, offset = {x: 0, y: 0}})
    {
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 10;
        this.offset = offset;
    }

    //Canvas drawing
    draw()
    {
        c.drawImage
        (
            this.image, 
            this.framesCurrent * (this.image.width/this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width/this.framesMax)*this.scale, 
            this.image.height*this.scale
        );
    }

    animateFrames()
    {
        this.framesElapsed++;
        if(this.framesElapsed % this.framesHold == 0)
        {
            if(this.framesCurrent < this.framesMax - 1)
            {
                this.framesCurrent++;
            }
            else
            {
                this.framesCurrent = 0;
            }
        }
    }

    //Position update
    update()
    {
        this.draw();
        this.animateFrames();
    }
}

class Fighter extends Sprite
{
    constructor
    ({
        position, 
        velocity, 
        color = 'red', 
        imageSrc, 
        scale = 1, 
        framesMax = 1,
        offset = {x: 0, y: 0},
        sprites
    })
    {
        super
        ({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        });
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.attackBox = 
        {
            position: 
            {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        }
        this.color = color;
        this.isAttacking;
        this.health = 100;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.sprites = sprites;
        for(const sprite in this.sprites)
        {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }

    //Position update
    update()
    {
        this.draw();
        this.animateFrames();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 183)
        {
            this.velocity.y = 0;
        }
        else
        {
            this.velocity.y += gravity;
        }
    }

    //Player attacks
    playerAttack()
    {
        this.switchSprite('attack');
        this.isAttacking = true;
        playerAtkNo = 1;
        if(player.position.y <= 112)
        {
            player.velocity.y += 30;
            playerAtkNo = 2;
        }

        setTimeout(() => 
        {
            this.isAttacking = false;
        }, 100)
    }

    //Enemy attacks
    enemyAttack()
    {
        this.switchSprite('attack');
        this.isAttacking = true;
        enemyAtkNo = 1;
        if(enemy.position.y < 255)
        {
            if(atk2Enable && specAtk != 1)
            {
                enemy.velocity.y += 30;
                enemyAtkNo = 2;
                atk2Enable = 0;
            }
        }
        if(enemy.position.y > 397 && specAtk === 1 && atk3Enable != 0)
        {
            atk3Enable = 0;
            specAtk = 0;
            enemyAtkNo = 3;
        }
        setTimeout(() => 
        {
            this.isAttacking = false;
        }, 100)
    }

    switchSprite(sprite)
    {
        if(this.image === this.sprites.attack.image && this.framesCurrent < this.sprites.attack.framesMax - 1)
            return;
        switch(sprite)
        {
            case 'idle':
                if(this.image !== this.sprites.idle.image)
                {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.scale = this.sprites.idle.scale;
                    this.offset.y = this.sprites.idle.offset.y;
                    this.offset.x = this.sprites.idle.offset.x;
                    //this.framesCurrent = 0;
                }
            break;
            case 'walk':
                if(this.image !== this.sprites.walk.image)
                {
                    this.image = this.sprites.walk.image;
                    this.framesMax = this.sprites.walk.framesMax;
                    this.scale = this.sprites.walk.scale;
                    this.offset.y = this.sprites.walk.offset.y;
                    this.offset.x = this.sprites.walk.offset.x;
                    //this.framesCurrent = 0;
                }
            break;
            case 'jump':
                if(this.image === this.sprites.idle.image)
                {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.scale = this.sprites.jump.scale;
                    this.offset.y = this.sprites.jump.offset.y;
                    this.offset.x = this.sprites.jump.offset.x;
                    this.framesCurrent = 0;
                }
            break;
            case 'attack':
                if(this.image === this.sprites.idle.image || this.image === this.sprites.walk.image)
                {
                    this.image = this.sprites.attack.image;
                    this.framesMax = this.sprites.attack.framesMax;
                    this.scale = this.sprites.attack.scale;
                    this.offset.y = this.sprites.attack.offset.y;
                    this.offset.x = this.sprites.attack.offset.x;
                    this.framesCurrent = 0;
                }
            break;
        }
    }
}