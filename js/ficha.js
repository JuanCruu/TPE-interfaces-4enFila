class Ficha {
    constructor(posX, posY, radius, color, ctx, team) {
        this.posX = posX;
        this.posY = posY;
        this.radius = radius;
        this.color = color;
        this.ctx = ctx;
        this.team = team;
        this.modoBloqueado = false;
        this.setImage(color);
    }
    setImage(color) {
        this.color = color;
        this.draw();
    }
    getPosX() {
        return this.posX
    }
    getPosY() {
        return this.posY;
    }

    draw() {

        if (this.color != null) {
            this.ctx.drawImage(this.color, this.posX - this.radius, this.posY - this.radius, 2 * this.radius, 2 * this.radius);
        }


    }
    hit(posX, posY) {
        let radio = Math.sqrt((posX - this.posX) ** 2 + (posY - this.posY) ** 2);
        return radio < this.radius;
    }
    move(posX, posY) {
        if (!this.modoBloqueado) {
            this.posX = posX;
            this.posY = posY;
        }

    }
}