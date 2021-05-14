class Tablero {
    constructor(ctx, size, gameover) {
        this.ctx = ctx;
        this.fichasTeam1 = []; //arreglo que contendra las fichas
        this.fichasTeam2 = [];
        this.espacios = [
            []
        ]; //contiene la ubicacion en la que las fichas se posiscionaran

        this.size = size;
        this.loadImageTeam1(); //carga las imagenes de las fichas
        this.loadImageTeam2();
        this.turnoActivo = true;
        this.createHitBox();
        this.gameover = gameover;
        this.showTurn();
        this.primerTurno = 1; //variable usada para evitar que la funcion showTurn() cargue la imagen de la ficha turno cada vez que se hace un movimiento valido

    }
    showTurn() { //se encarga de mostrar de que lado del tablero se dibujara la ficha turno

        var fichaTurno = new Image();
        fichaTurno.src = './images/TurnoFicha.png';
        if (this.primerTurno == 1) {
            fichaTurno.onload = () => { //la primera vez que se ejecuta el juego carga la imagen. el resto de las veces no es necesario por esa razon
                this.primerTurno = 2; //solo se ejecuta drawImage sin utilizar el .onload()que de por si demora unos segundos,dando la idea de que hay un bug
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
    showWinner(numero) { //al finalizarse el juego muestra una imagen y un texto enseñando quien fue el jugador que gano
        var michiVictory, pajaroVictory;
        if (numero == 2) {
            michiVictory = new Image();
            michiVictory.src = './images/evilVictory.jpg'
            michiVictory.onload = () => {
                this.ctx.drawImage(michiVictory, 350, 200);
                this.ctx.font = '50px serif';
                this.ctx.fillText('Ganan Fichas Negras', 360, 90);
            }
        } else {
            pajaroVictory = new Image();
            pajaroVictory.src = './images/suprime victory (2).jpg'
            pajaroVictory.onload = () => {
                this.ctx.drawImage(pajaroVictory, 340, 200, 500, 400);
                this.ctx.font = '50px serif';
                this.ctx.fillText('Ganan Fichas Naranjas', 360, 90);
            }
        }
    }

    loadImageTeam1() { //carga y crea las fichas con sus respectivas imagenes
        var bird = new Image();
        bird.src = './images/michi.png';
        bird.onload = () => {
            for (let i = 0; i < 16; i++) {
                this.fichasTeam1.push(new Ficha(1150, 140 + 30 * i, 46, bird, this.ctx));
                this.fichasTeam1.push(new Ficha(1065, 140 + 30 * i, 46, bird, this.ctx));
                //se ejecuta dos veces solo para que se reposicionen mas a la derecha, no tiene mas finalidad
            }
        }
    }
    loadImageTeam2() {
        var michi = new Image();
        michi.src = './images/bird.png';
        michi.onload = () => {
            for (let i = 0; i < 16; i++) {
                this.fichasTeam2.push(new Ficha(60, 140 + 30 * i, 46, michi, this.ctx));
                this.fichasTeam2.push(new Ficha(145, 140 + 30 * i, 46, michi, this.ctx));

            }
        }
    }
    draw() {
        this.ctx.fillStyle = "#00341A"; //se dibuja el fondo y por cada espacio del arreglo...  
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillStyle = "#28774F";
        this.ctx.fillRect(235, 110, 720, 720);

        this.espacios.forEach(espacio => { //...dibuja un circulo con sus respectivas posiciones en las que se depositaran sus fichas
            espacio.forEach(grilla => {
                this.ctx.beginPath();
                let posX = grilla.posX + (grilla.width / 2)
                let posY = grilla.posY + (grilla.height / 2)
                this.ctx.fillStyle = "#6FBD95";
                this.ctx.strokeStyle = "#6FBD95";
                this.ctx.arc(posX, posY, 40, 0, 2 * Math.PI)
                this.ctx.fill();
                this.ctx.stroke();

            })
        })
        this.fichasTeam1.forEach(ficha => { //dibuja todas las fichas de los jugadores
            ficha.draw()

        });
        this.fichasTeam2.forEach(ficha => { //dibuja todas las fichas de los jugadores
            ficha.draw()
        })
        this.showTurn();

    }
    getSelectedChip(posX, posY) { //verifica y devuelve si cliqueaste en una ficha, dependiendo de si el booleano turno esta activo
        // preguntara en un arreglo u otro 
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
        //si la ficha no esta bloqueada(osea que no ah sido ubicada en el tablero y siempre y cuando la ficha este dentro del tablero(zona verde claro) )
        //localiza en que posicion x del tablero se solto la ficha
        if (!ficha.modoBloqueado && ficha.posX > 240 && ficha.posX < 960) {
            let fichaX = ficha.getPosX();
            let fichaY = ficha.getPosY();
            let x = this.getColSelected(fichaX); //busca la columna correspondiente
            let y = this.getRowAvailable(x); //busca una posicion disponible en el eje y
            this.moveChip(x, y, ficha) //mueve la ficha a una posicion valida
            ficha.modoBloqueado = true; //bloquea la ficha en el tablero
            if (this.cargarFilas(y, x).resultado) { //chequea por un ganador
                this.bloquearFichas(); //si lo hay, bloquea todas las fichas
                this.showWinner(this.cargarFilas(y, x).ganador) //muestra al ganador con el jugador que se retorno
            }
            this.turnoActivo = !this.turnoActivo; //sino hay ganador,cambia el turno y el juego sigue
            return {
                // x,
                // y,
                resultado: true,
            };
        }
    }
    bloquearFichas() { //al finalizar el juego no se deberian poder seguir moviendo las fichas
        // por lo que se recorren los arreglos y se bloquean todas
        this.fichasTeam1.forEach(ficha => {
            ficha.modoBloqueado = true
        });
        this.fichasTeam2.forEach(ficha => {
            ficha.modoBloqueado = true
        })
    }
    moveChip(columna, fila, ficha) { //pone la ficha en el tablero,la posiciona correctamente y la bloquea.
        //setea en la matriz de espacios que jugador la ocupo
        this.espacios[fila][columna].estado = "ocupado";
        if (this.turnoActivo) {
            this.espacios[fila][columna].jugador = 1;
        } else {
            this.espacios[fila][columna].jugador = 2;
        }
        //crea variables con las posicion correcta en la que se depositaria la ficha y le dice al objeto ficha que se desplaze a esa direccion
        let posX = this.espacios[fila][columna].posX + (this.espacios[fila][columna].width / 2)
        let posY = this.espacios[fila][columna].posY + (this.espacios[fila][columna].height / 2)
        ficha.move(posX, posY);
    }
    getRowAvailable(index) { //se posiciona sobre el eje y de una "columna" y la recorre devolviendo la primera posicion de la hitbox(espacio) que este disponible
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
    getColSelected(posX) { //mira en cada una de las columnas del tablero (representados en rangos sobre la posicion horizontal) y devuelve un indice
        for (let i = 0; i < this.espacios.length; i++) {
            if (posX >= this.espacios[0][i].posX && posX <= this.espacios[0][i].posX + this.espacios[0][i].width) {
                return i
            }
        }
    }
    createHitBox() { //crea celdas de espacios en blanco donde luego se repocicionaran las fichas del Tablero
        //entre las propiedades de los espacios estan la posicio x,y ancho, alto ,un estado de ocupacion y que ficha lo estara ocupando
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                let hitbox = {
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
                this.espacios[y][x] = hitbox;
            }
        }
    }
    cargarFilas(fila, columna) { //crea arrays que contendran los valores de las fichas en los ejes diagonales,verticales, y horizontales, partiendo
        //de la ultima ficha que se solto
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
            } //retorna  todos los arreglos a otro metodo que se encargara de ver cual cumpla las condiciones para ganar. 
            //el condicional || permite ejecutar el mismo metodo con distintos parametros esperando que uno de ellos cumpla las condiciones de vitoria retornando true
            return this.cuatroEnLinea(diagonalIzquierda) ||
                this.cuatroEnLinea(diagonalDerecha) ||
                this.cuatroEnLinea(horizontal) ||
                this.cuatroEnLinea(vertical);
        }
    }
    cuatroEnLinea(celda = []) { //contiene las reglas del juego,mirandolo desde la programacion orientada a objetos, esta tarea
        //deberia ser realizada desde la clase juego, pero debido a problemas con parametros y objetos undefined que no pude resolver
        //decidi ponerlo en la clase tablero el cual tiene acceso a los datos requeridos

        let contador = 0;
        let jugadorActivo;
        if (this.turnoActivo) {
            jugadorActivo = 1;
        } else {
            jugadorActivo = 2;
        }
        for (let i = 0; i < celda.length; i++) {
            if (celda[i].jugador == 0 && celda[i].estado == "disponible") { //si la celda esta disponible contador=0
                contador = 0;
            } else if (celda[i].jugador == jugadorActivo && celda[i].estado == "ocupado") { //verifica si la ficha ocupada pertenece al jugador que posiciono la ultima ficha
                contador++;
            } else {
                contador = 1;
            }
            jugadorActivo = celda[i].jugador;
            if (contador == 4) { //si en algun momento el contador llega a 4 
                //es que encontro cuatro fichas consecutivas de un mismo jugador en al alguna de las filas(horizontales,verticales o diagonales)
                return {
                    resultado: true, //retorno un objeto que tiene un boleano diciendo que el juego fue ganado y quien fue el jugador que salio victorioso
                    ganador: jugadorActivo
                }
            }
        }
        return false;
    }
}