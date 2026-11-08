// --- EJEMPLO DE CÓMO DEBERÍA SER TU FUNCIÓN DE ENVÍO EN app.js ---

document.getElementById("buyButton").addEventListener("click", async function() {
    // 1. Recoger los datos del formulario de la web
    const formData = {
        fullName: document.getElementById("fullName").value, // (Asegúrate que coincida con el ID de tu input de nombre)
        userCedula: document.getElementById("cedula").value,
        ticketQuantity: document.getElementById("cantidad").value,
        // ... los demás campos que ya tengas (teléfono, referencia, etc.)
    };

    // 2. Mostrar un mensaje de carga en el botón
    const btn = document.getElementById("buyButton");
    btn.innerText = "Procesando pago y asignando números...";
    btn.disabled = true;

    try {
        // 3. Enviar a tu URL de Google Apps Script (tu Web App)
        const response = await fetch("TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI", {
            method: "POST",
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();

        if (result.status === "success") {
            // 4. ¡AQUÍ ESTÁ LA MAGIA! Llamamos al modal para mostrar los números
            showSuccessPopup(formData, result);
        } else {
            alert("Error: " + (result.message || "No se pudo procesar la solicitud"));
            btn.innerText = "Confirmar y Enviar Pago";
            btn.disabled = false;
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Ocurrió un error de conexión.");
        btn.innerText = "Confirmar y Enviar Pago";
        btn.disabled = false;
    }
});

// 5. Esta función es la que inyecta los datos en el Modal HTML que acabamos de crear
function showSuccessPopup(formData, result) {
    document.getElementById('modalName').innerText = formData.fullName;
    document.getElementById('modalCedula').innerText = formData.userCedula;
    document.getElementById('modalQty').innerText = formData.ticketQuantity;
    
    // Aquí es donde se colocan los números exactos devueltos por Google Sheets
    document.getElementById('modalNumbers').innerText = result.assignedNumbers;
    
    // Mostramos el modal
    document.getElementById('successModal').style.display = 'flex';
}

// 6. Botón de cerrar el modal y recargar la página
function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    location.reload(); // Refresca la página para que el stock baje en pantalla
}
