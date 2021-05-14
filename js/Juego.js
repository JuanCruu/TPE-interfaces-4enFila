class Juego {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.gameover = false;
        this.tablero = new Tablero(ctx, 8, this.gameover);
        this.mode = '';
        this.width = width;
        this.height = height;
        this.selectedChip = null;
    }
    draw() { //vacia el canvas y le dice al tablero que se redibuje
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.tablero.draw();
    }
    checkHit(posX, posY) {
        let selectedChip = this.tablero.getSelectedChip(posX, posY); //busca si se encontro alguna ficha en la ubicacion que uno clikeo
        if (selectedChip) {
            this.mode = 'agarrando'; //cambia el modo de juego, y setea la this.selectedChip con la varible seleccionada
            this.selectedChip = selectedChip;
            return true;
        }
        return false;
    }
    ArrastrarFicha(posX, posY) { //hace verificaciones con respecto al modo de juego,ficha valida y si el juego se ah finalizado
        if (this.mode === 'agarrando' && this.selectedChip && this.gameover == false) { //
            this.selectedChip.move(posX, posY); //setea la ubicacion de la ficha seleccionada con las posiciones del cursor que se pasan por parametros
            this.draw();
        }
    }
    soltarFicha() {
        if (this.mode === 'agarrando') { //cambia el modo del  juego
            this.checkMove();
        }
        this.mode = 'en espera';
    }
    checkMove() {
        if (this.tablero.checkMove(this.selectedChip)) { //si la ficha se posiciono correctamente la ficha en el tablero
            this.draw(); //redibuja
        }
    }
    showTurn() {
        this.tablero.showTurn();

    }

}