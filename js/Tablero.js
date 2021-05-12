class Tablero {
    constructor(ctx, size, gameover) {
        this.ctx = ctx;
        this.fichasTeam1 = [];
        this.fichasTeam2 = [];
        this.espacios = [
            []
        ];
        this.columna = [];
        this.size = size;
        this.loadImageTeam1();
        this.loadImageTeam2();
        this.turnoActivo = true;
        this.createHitBox();
        this.gameover = gameover;
        this.showTurn();
        this.primerTurno = 1;
        // this.loadFondo();
        // this.fondo = this.loadFondo();

    }
    showTurn() {

        var fichaTurno = new Image();
        fichaTurno.src = '../images/TurnoFicha.png';
        if (this.primerTurno == 1) {
            fichaTurno.onload = () => {
                this.primerTurno = 2;
                if (this.turnoActivo == true) {
                    this.ctx.drawImage(fichaTurno, 890, 600, 424, 300);
                } else {
                    this.ctx.drawImage(fichaTurno, -80, 600, 424, 300);

                }
            }
        }
        if (this.turnoActivo == true) {
            this.ctx.drawImage(fichaTurno, 890, 600, 424, 300);
        } else {
            this.ctx.drawImage(fichaTurno, -80, 600, 424, 300);

        }



    }
    showWinner(numero) {
        var michiVictory, pajaroVictory;
        if (numero == 2) {
            michiVictory = new Image();
            michiVictory.src = '../images/evilVictory.jpg'
            michiVictory.onload = () => {
                this.ctx.drawImage(michiVictory, 350, 200);
            }
        } else {
            pajaroVictory = new Image();
            pajaroVictory.src = '../images/suprime victory (2).jpg'
            pajaroVictory.onload = () => {
                this.ctx.drawImage(pajaroVictory, 340, 200, 500, 400);
            }

        }
    }

    loadImageTeam1() {
        var bird = new Image();
        bird.src = '../images/michi.png';
        bird.onload = () => {
            for (let i = 0; i < 16; i++) {
                this.fichasTeam1.push(new Ficha(1150, 140 + 30 * i, 46, bird, this.ctx));
                this.fichasTeam1.push(new Ficha(1065, 140 + 30 * i, 46, bird, this.ctx));

            }
        }
    }
    loadImageTeam2() {
        var michi = new Image();
        michi.src = '../images/bird.png';
        michi.onload = () => {
            for (let i = 0; i < 16; i++) {
                this.fichasTeam2.push(new Ficha(60, 140 + 30 * i, 46, michi, this.ctx));
                this.fichasTeam2.push(new Ficha(145, 140 + 30 * i, 46, michi, this.ctx));

            }
        }
    }
    draw() {
        this.ctx.fillStyle = "#00341A";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = "#28774F";
        this.ctx.fillRect(235, 110, 720, 720);

        this.espacios.forEach(espacio => {
            espacio.forEach(grilla => {
                this.ctx.beginPath();

                // this.ctx.strokeStyle = "white";
                // this.ctx.rect(espaci.posX, espaci.posY, espaci.width, espaci.height);

                let posX = grilla.posX + (grilla.width / 2)

                let posY = grilla.posY + (grilla.height / 2)
                this.ctx.fillStyle = "#6FBD95";

                this.ctx.strokeStyle = "#6FBD95";

                this.ctx.arc(posX, posY, 40, 0, 2 * Math.PI)
                this.ctx.fill();
                this.ctx.stroke();

            })
        })
        this.fichasTeam1.forEach(ficha => {
            ficha.draw()
        });
        this.fichasTeam2.forEach(ficha => {
            ficha.draw()
        })
        this.showTurn();

    }
    getSelectedChip(posX, posY) {
        if (this.turnoActivo) {
            for (let i = 0; i < this.fichasTeam1.length; i++) {
                if (this.fichasTeam1[i].hit(posX, posY)) {
                    return this.fichasTeam1[i];
                }
            }
        } else {
            for (let i = 0; i < this.fichasTeam2.length; i++) {
                if (this.fichasTeam2[i].hit(posX, posY)) {
                    return this.fichasTeam2[i];
                }
            }
        }
        return null;
    }
    checkMove(ficha) {
        if (!ficha.modoBloqueado && ficha.posX > 240 && ficha.posX < 960) {
            let fichaX = ficha.getPosX();
            let fichaY = ficha.getPosY();
            let x = this.getColSelected(fichaX);
            let y = this.getRowAvailable(x);
            // console.log(x, y)
            this.moveChip(x, y, ficha)
            ficha.modoBloqueado = true;
            if (this.checkWin(y, x).resultado) {
                this.bloquearFichas();
                this.showWinner(this.checkWin(y, x).ganador)

            } //ehto no va k
            this.turnoActivo = !this.turnoActivo;
            // this.showTurn();

            return {
                x,
                y,
                resultado: true,
            };
        }
    }
    bloquearFichas() {
        this.fichasTeam1.forEach(ficha => {
            ficha.modoBloqueado = true
        });
        this.fichasTeam2.forEach(ficha => {
            ficha.modoBloqueado = true
        })
    }
    moveChip(columna, fila, ficha) {
        this.espacios[fila][columna].estado = "ocupado";
        if (this.turnoActivo) {
            this.espacios[fila][columna].jugador = 1;
        } else {
            this.espacios[fila][columna].jugador = 2;
        }
        let posX = this.espacios[fila][columna].posX + (this.espacios[fila][columna].width / 2)
        let posY = this.espacios[fila][columna].posY + (this.espacios[fila][columna].height / 2)
        ficha.move(posX, posY);
    }
    getRowAvailable(index) {
        let contador = this.espacios.length - 1
        let retorned;
        let retornedStatus = false
        for (let i = contador; i >= 0; i--) {
            if (retornedStatus == false && this.espacios[i][index].estado == "disponible") {
                retornedStatus = true;
                retorned = i;
                return retorned;
            }
        }
    }
    getColSelected(posX) {
        for (let i = 0; i < this.espacios.length; i++) {
            if (posX >= this.espacios[0][i].posX && posX <= this.espacios[0][i].posX + this.espacios[0][i].width) {
                return i
            }
        }
    }
    createHitBox() {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                let blankSpace = {
                    posX: 235 + (x * 90),
                    posY: 110 + (y * 90),
                    width: 90,
                    height: 90,
                    estado: "disponible",
                    jugador: 0
                };
                if (x == 0) {
                    this.espacios[y] = new Array(this.size);
                }
                this.espacios[y][x] = blankSpace;
            }
        }
    }
    checkWin(fila, columna) {
        if (this.gameover == false) {
            let horizontal = []
            let vertical = []
            let diagonalDerecha = []
            let diagonalIzquierda = []
            for (let i = 0; i < this.size; i++) {
                for (let j = 0; j < this.size; j++) {
                    if (i == fila) {
                        horizontal.push(this.espacios[i][j]); //seteo la fila
                    }
                    if (j == columna) {
                        vertical.push(this.espacios[i][j]); //seteo columna
                    }
                    if (i - j == fila - columna) {
                        diagonalIzquierda.push(this.espacios[i][j]); //seteo diagonal iz
                    }
                    if (i + j == fila + columna) {
                        diagonalDerecha.push(this.espacios[i][j]); //seteo diagonalDerecha
                    }
                }
            }
            return this.cuatroEnLinea(diagonalIzquierda) || this.cuatroEnLinea(diagonalDerecha) || this.cuatroEnLinea(horizontal) || this.cuatroEnLinea(vertical);
        }
    }
    cuatroEnLinea(celda = []) {
        let count = 0;
        let jugadorActivo;
        if (this.turnoActivo) {
            jugadorActivo = 1;
        } else {
            jugadorActivo = 2;
        }
        let winningCells = [];
        for (let i = 0; i < celda.length; i++) {
            if (celda[i].jugador == 0 && celda[i].estado == "disponible") {
                count = 0;
                winningCells = [];
            } else if (celda[i].jugador == jugadorActivo && celda[i].estado == "ocupado") {
                count++;
                winningCells.push(celda[i]);
            } else {
                count = 1;
                winningCells = [];
                winningCells.push(celda[i]);
            }
            jugadorActivo = celda[i].jugador;
            if (count == 4) {
                // alert("ganador jugador" + jugadorActivo)
                // this.gameover = true;
                // return true;
                return {
                    resultado: true,
                    ganador: jugadorActivo
                }
            }
        }
        return false;
    }
}