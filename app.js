// 1. Cargar el stock disponible al abrir la página web
window.addEventListener('DOMContentLoaded', async () => {
    try {
        // REEMPLAZA AQUÍ CON TU URL DE GOOGLE APPS SCRIPT
        const WEB_APP_URL = "AQUI_TU_URL_REAL_DE_GOOGLE_APPS_SCRIPT"; 

        const response = await fetch(WEB_APP_URL + "?action=getStock");
        const data = await response.json();
        
        if (data.availableStock !== undefined) {
            // Busca el elemento del stock en tu HTML y lo actualiza en vivo
            const stockElement = document.getElementById("availableStock"); // Asegúrate de que tu contador arriba tenga id="availableStock"
            if (stockElement) {
                stockElement.innerText = data.availableStock;
            }
        }
    } catch (e) {
        console.log("Stock inicial cargando por defecto.");
    }
});

// 2. Evento del botón de compra
document.getElementById("buyButton").addEventListener("click", async function(event) {
    event.preventDefault(); // Evita comportamientos extraños del formulario

    // Recogemos los valores de tus inputs (Asegúrate de que estos IDs existan en tu index.html)
    const fullNameInput = document.getElementById("fullName");
    const cedulaInput = document.getElementById("cedula");
    const cantidadInput = document.getElementById("cantidad");

    const formData = {
        fullName: fullNameInput ? fullNameInput.value : "",
        userCedula: cedulaInput ? cedulaInput.value : "",
        ticketQuantity: cantidadInput ? cantidadInput.value : "1"
    };

    // Validamos que no estén vacíos
    if (!formData.fullName || !formData.userCedula || !formData.ticketQuantity) {
        alert("Por favor completa los campos requeridos.");
        return;
    }

    const btn = document.getElementById("buyButton");
    btn.innerText = "Procesando pago y asignando números...";
    btn.disabled = true;

    try {
        const WEB_APP_URL = "AQUI_TU_URL_REAL_DE_GOOGLE_APPS_SCRIPT"; // REEMPLAZA AQUÍ TAMBIÉN

        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();

        if (result.status === "success") {
            // ¡Llamamos a nuestro modal corporativo con los números asignados!
            showSuccessPopup(formData, result);
        } else {
            alert("Error: " + (result.message || "No se pudo procesar la solicitud"));
            btn.innerText = "Confirmar y Enviar Pago";
            btn.disabled = false;
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Ocurrió un error de conexión con el servidor.");
        btn.innerText = "Confirmar y Enviar Pago";
        btn.disabled = false;
    }
});

// 3. Función para inyectar datos en el Modal HTML
function showSuccessPopup(formData, result) {
    document.getElementById('modalName').innerText = formData.fullName;
    document.getElementById('modalCedula').innerText = formData.userCedula;
    document.getElementById('modalQty').innerText = formData.ticketQuantity;
    
    // Aquí se pintan los números exactos que devuelve Google Sheets
    document.getElementById('modalNumbers').innerText = result.assignedNumbers;
    
    // Muestra el modal en pantalla
    document.getElementById('successModal').style.display = 'flex';
}

// 4. Botón de cerrar el modal y refrescar
function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    location.reload(); // Recarga para actualizar el stock restado en pantalla
}
