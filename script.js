const Formulario = document.getElementById("form-opciones");
const InputOpcion = document.getElementById("input-opcion");
const ListaOpciones = document.getElementById("lista-opciones");
const Modal = document.getElementById("modal-resultado");
const BtnGirar = document.getElementById("btn-girar");

const opciones = [];

function renderizar() {
    ListaOpciones.innerHTML = '';
    if (opciones.length == 0) {
        ListaOpciones.innerHTML = `<li class="text-stone-400">Aún no hay opciones.</li>`
    } else {
        opciones.forEach((opcion, index) => {
            ListaOpciones.insertAdjacentHTML('beforeend', `<li class="flex items-center justify-between rounded-lg bg-background px-3 py-2">
                    ${opcion}
                    <button type="button" class="boton-eliminar text-stone-400 hover:text-red-600" data-index=${index}>&times;</button>
                </li>`);
        })
    }
}
Formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const valorInput = InputOpcion.value;
    if (valorInput.trim().length === 0) {
        alert("Ingrese una opcion valida");
    }else { 
        opciones.push(valorInput);
        renderizar();
    };
    
    InputOpcion.value = "";
});

ListaOpciones.addEventListener("click", (e) => {
    const clases = e.target.classList;
    if (clases.contains('boton-eliminar')) {
        opciones.splice(Number(e.target.dataset.index), 1);
    }
    renderizar();
})

BtnGirar.addEventListener("click", () => {
    Modal.showModal();
})

renderizar();