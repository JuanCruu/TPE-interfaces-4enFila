document.addEventListener("DOMContentLoaded", () => {
    let canvas = document.getElementById("canvasGame");
    let botonReset = document.getElementById("reset");
    canvas.width = 1200;
    canvas.height = 900;
    let ctx = canvas.getContext("2d");
    ////////////////////////////////////////////tomo los elementos del html
    let newGame = new Juego(ctx, canvas.width, canvas.height); // creo una instancia de juego
    newGame.draw(); //dibujo el juego(tablero,fichas,imagene)

    canvas.addEventListener("mousedown", (evento) => { //escucha el evento "click abajo"y si clikeo en una ficha 
        if (newGame.checkHit(evento.offsetX, evento.offsetY)) { //ejecuta el evento mover o arrastrar(hacia la posiscion en la que se mueve el puntero)
            canvas.addEventListener("mousemove", (evento) => {
                newGame.ArrastrarFicha(evento.offsetX, evento.offsetY);
            });
        }
    });
    canvas.addEventListener("mouseup", (e) => { //escucha el evento "mouse arriva",remueve el evento de arrastrar ficha y ejecuta todos los procesos de soltar la ficha
        canvas.removeEventListener("mousemove", newGame.ArrastrarFicha);
        newGame.soltarFicha();
    });
    botonReset.addEventListener('click', () => { //al cliquearse toma la instancia newGame,y la re-establece con los valores por defecto
        newGame = new Juego(ctx, canvas.width, canvas.height);
        newGame.draw(); //redibuja el tablero
    });
});