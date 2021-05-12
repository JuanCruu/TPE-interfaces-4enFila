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
    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.tablero.draw();
    }
    checkHit(posX, posY) {
        let selectedChip = this.tablero.getSelectedChip(posX, posY);
        if (selectedChip) {
            this.mode = 'dragging';
            this.selectedChip = selectedChip;
            return true;
        }
        return false;
    }
    handleDrag(posX, posY) {
        if (this.mode === 'dragging' && this.selectedChip && this.gameover == false) {
            this.selectedChip.move(posX, posY);
            // console.log(this.)
            this.draw();
        }
    }
    stopDragging() {
        if (this.mode === 'dragging') {
            this.checkMove();
        }
        this.mode = 'standBy';
        // this.showTurn()
    }
    checkMove() {
        if (this.tablero.checkMove(this.selectedChip)) {
            this.draw();
        }
    }
    showTurn() {
        this.tablero.showTurn();

    }

}