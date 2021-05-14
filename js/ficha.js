class Ficha {
    constructor(posX, posY, radius, imagen, ctx, team) {
        this.posX = posX;
        this.posY = posY;
        this.radius = radius;
        this.imagen = imagen;
        this.ctx = ctx;
        this.team = team;
        this.modoBloqueado = false;
        this.setImage(imagen); //se ejecuta en el constructor para que cargue las imagenes, de otra manera la primera vez que se ejecuta el juego no las muestra
    }
    setImage(imagen) {
        this.imagen = imagen;
        this.draw();
    }
    getPosX() { //devuelve las posisciones X de la instancia ficha
        return this.posX
    }
    getPosY() { //devuelve la posiscion Y de la instancia ficha
        return this.posY;
    }

    draw() { //pinta las ficha con una imagen pasada por parametro
        if (this.imagen != null) {
            this.ctx.drawImage(this.imagen, this.posX - this.radius, this.posY - this.radius, 2 * this.radius, 2 * this.radius);
        }
    }
    hit(posX, posY) { //si clickearon en la ubicacion de la ficha retorna true
        let radio = Math.sqrt((posX - this.posX) ** 2 + (posY - this.posY) ** 2);
        return radio < this.radius;
    }
    move(posX, posY) { //setea la posicion de la ficha
        if (!this.modoBloqueado) {
            this.posX = posX;
            this.posY = posY;
        }

    }
}