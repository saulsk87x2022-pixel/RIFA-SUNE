// 1. Cargar el stock disponible al abrir la página web
window.addEventListener('DOMContentLoaded', async () => {
    try {
        // 👇 REEMPLAZA ESTA URL CON TU ENLACE REAL DE GOOGLE APPS SCRIPT 👇
        const WEB_APP_URL = "https://script.google.com/macros/s/TU_URL_REAL_DE_GOOGLE_APPS_SCRIPT/exec"; 

        const response = await fetch(WEB_APP_URL + "?action=getStock");
        const data = await response.json();
        
        if (data.availableStock !== undefined) {
            const stockElement = document.getElementById("stockCount");
            if (stockElement) {
                stockElement.innerText = data.availableStock; // Actualiza el contador de arriba en vivo
            }
        }
    } catch (e) {
        console.log("Cargando stock inicial por defecto.");
    }
});

// 2. Evento del botón de compra y envío de datos
document.getElementById("buyButton").addEventListener("click", async function(event) {
    event.preventDefault(); // Evita recargas extrañas del formulario

    // Recogemos los valores de los inputs del HTML
    const fullNameInput = document.getElementById("fullName");
    const cedulaInput = document.getElementById("userCedula");
    const phoneInput = document.getElementById("userPhone");
    const stateInput = document.getElementById("userState");
    const quantityInput = document.getElementById("ticketQuantity");
    const sourceBankInput = document.getElementById("sourceBank");
    const refInput = document.getElementById("paymentRef");

    // Validamos que los campos obligatorios no estén vacíos
    if (!fullNameInput.value || !cedulaInput.value || !refInput.value) {
        alert("Por favor completa tu Nombre, Cédula y la Referencia de Pago.");
        return;
    }

    const formData = {
        fullName: fullNameInput.value,
        userCedula: cedulaInput.value,
        userPhone: phoneInput ? phoneInput.value : "",
        userState: stateInput ? stateInput.value : "",
        ticketQuantity: quantityInput ? quantityInput.value : "10",
        sourceBank: sourceBankInput ? sourceBankInput.value : "",
        paymentRef: refInput.value
    };

    const btn = document.getElementById("buyButton");
    btn.innerText = "Procesando pago y asignando números...";
    btn.disabled = true;

    try {
        // 👇 REEMPLAZA ESTA URL CON TU ENLACE REAL DE GOOGLE APPS SCRIPT NUEVAMENTE 👇
        const WEB_APP_URL = "https://script.google.com/macros/s/TU_URL_REAL_DE_GOOGLE_APPS_SCRIPT/exec";

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

// 4. Botón de cerrar el modal y refrescar la página
function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    location.reload(); // Recarga para actualizar el stock restado arriba
}
