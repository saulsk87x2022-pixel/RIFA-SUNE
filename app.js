let cantidadSeleccionada = 10;
const precioPorBoleto = 30; // 10 boletos por 300 Bs -> 30 Bs c/u
let boletosDisponiblesTotales = 9999; 

function cambiarCantidad(num) {
    cantidadSeleccionada = num;
    document.getElementById('cantBoletos').innerText = num;
    document.getElementById('montoTotal').innerText = num * precioPorBoleto;
}

function enviarFormulario() {
    const nombre = document.getElementById('nombre').value.trim();
    const cedula = document.getElementById('cedula').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const referencia = document.getElementById('referencia').value.trim();

    if (!nombre || !cedula || !telefono || !referencia) {
        alert("⚠️ Por favor completa todos los campos obligatorios y la referencia de pago.");
        return;
    }

    if (referencia.length < 8) {
        alert("⚠️ La referencia de pago debe tener 8 dígitos.");
        return;
    }

    if (boletosDisponiblesTotales >= cantidadSeleccionada) {
        boletosDisponiblesTotales -= cantidadSeleccionada;
        document.getElementById('boletosDisponibles').innerText = boletosDisponiblesTotales;
    }

    alert(`¡Excelente, ${nombre}! Tu registro ha sido procesado con éxito.\nHemos recibido tu solicitud por ${cantidadSeleccionada} boleto(s).\n\nPronto validaremos tu pago móvil y te enviaremos tus números.`);
    
    document.getElementById('rifaForm').reset();
    cambiarCantidad(10);
}