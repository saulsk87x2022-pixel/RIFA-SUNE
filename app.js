// ⚠️ PEGA TU URL REAL DE GOOGLE APPS SCRIPT AQUÍ ABAJO (Entre las comillas)
const WEB_APP_URL = "https://script.google.com/macros/s/TU_URL_REAL_DE_GOOGLE_APPS_SCRIPT/exec";

// 1. Cargar el stock disponible al abrir la página web y configurar precios dinámicos
window.addEventListener('DOMContentLoaded', async () => {
    // Cargar stock inicial
    try {
        const response = await fetch(WEB_APP_URL + "?action=getStock");
        const data = await response.json();
        
        if (data.availableStock !== undefined) {
            const stockElement = document.getElementById("stockCount");
            if (stockElement) {
                stockElement.innerText = data.availableStock;
            }
        }
    } catch (e) {
        console.log("Error cargando stock inicial:", e);
    }

    // Actualizar precio total dinámicamente según la cantidad seleccionada
    const quantitySelect = document.getElementById("ticketQuantity");
    const totalPriceElement = document.getElementById("totalPrice");

    if (quantitySelect && totalPriceElement) {
        const updatePrice = () => {
            const qty = parseInt(quantitySelect.value);
            let price = 300; // Precio base por 10 boletos
            
            if (qty === 20) price = 600;
            else if (qty === 30) price = 900;
            else if (qty === 50) price = 1500;
            else if (qty === 100) price = 3000;
            else price = (qty / 10) * 300; // Cálculo proporcional por si acaso

            totalPriceElement.innerText = price.toLocaleString() + " Bs.f";
        };

        quantitySelect.addEventListener("change", updatePrice);
        updatePrice(); // Ejecutar al cargar
    }
});

// 2. Evento del botón de compra y envío de datos
document.getElementById("buyButton").addEventListener("click", async function(event) {
    event.preventDefault(); // Evita recargas extrañas

    // Recogemos los valores de los inputs del HTML
    const fullNameInput = document.getElementById("fullName");
    const cedulaInput = document.getElementById("userCedula");
    const phoneInput = document.getElementById("userPhone");
    const stateInput = document.getElementById("userState");
    const quantityInput = document.getElementById("ticketQuantity");
    const sourceBankInput = document.getElementById("sourceBank");
    const refInput = document.getElementById("paymentRef");

    // Validamos campos obligatorios
    if (!fullNameInput || !fullNameInput.value.trim() || 
        !cedulaInput || !cedulaInput.value.trim() || 
        !refInput || !refInput.value.trim()) {
        alert("Por favor completa tu Nombre, Cédula y la Referencia de Pago.");
        return;
    }

    const formData = {
        fullName: fullNameInput.value.trim(),
        userCedula: cedulaInput.value.trim(),
        userPhone: phoneInput ? phoneInput.value.trim() : "",
        userState: stateInput ? stateInput.value : "",
        ticketQuantity: quantityInput ? quantityInput.value : "10",
        sourceBank: sourceBankInput ? sourceBankInput.value : "",
        paymentRef: refInput.value.trim()
    };

    const btn = document.getElementById("buyButton");
    const originalText = btn.innerText;
    btn.innerText = "Procesando pago y asignando números...";
    btn.disabled = true;

    try {
        const response = await fetch(WEB_APP_URL, {
            method: "POST",
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();

        if (result.status === "success") {
            showSuccessPopup(formData, result);
        } else {
            alert("Error del servidor: " + (result.message || "No se pudo procesar la solicitud"));
            btn.innerText = originalText;
            btn.disabled = false;
        }

    } catch (error) {
        console.error("Error en la petición:", error);
        alert("Ocurrió un error de conexión con el servidor. Revisa la consola (F12) para más detalles.");
        btn.innerText = originalText;
        btn.disabled = false;
    }
});

// 3. Función para inyectar datos en el Modal HTML
function showSuccessPopup(formData, result) {
    document.getElementById('modalName').innerText = formData.fullName;
    document.getElementById('modalCedula').innerText = formData.userCedula;
    document.getElementById('modalQty').innerText = formData.ticketQuantity;
    document.getElementById('modalNumbers').innerText = result.assignedNumbers || "Números asignados correctamente.";
    
    document.getElementById('successModal').style.display = 'flex';
}

// 4. Botón de cerrar el modal y refrescar la página
function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    location.reload();
}
