// ⚠️ PEGA TU URL REAL DE GOOGLE APPS SCRIPT AQUÍ ABAJO (Entre las comillas)
const WEB_APP_URL = "https://script.google.com/macros/s/TU_URL_REAL_DE_GOOGLE_APPS_SCRIPT/exec";

// Función auxiliar para convertir la imagen del capture a Base64
const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

// 1. Cargar el stock disponible al abrir la página web y configurar precios dinámicos
window.addEventListener('DOMContentLoaded', async () => {
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
            else price = (qty / 10) * 300;

            totalPriceElement.innerText = price.toLocaleString() + " Bs.f";
        };

        quantitySelect.addEventListener("change", updatePrice);
        updatePrice();
    }
});

// 2. Evento del botón de compra y envío de datos
document.getElementById("buyButton").addEventListener("click", async function(event) {
    event.preventDefault();

    // Recogemos los valores de los inputs
    const fullNameInput = document.getElementById("fullName");
    const cedulaInput = document.getElementById("userCedula");
    const phoneInput = document.getElementById("userPhone");
    const stateInput = document.getElementById("userState");
    const quantityInput = document.getElementById("ticketQuantity");
    const sourceBankInput = document.getElementById("sourceBank");
    const refInput = document.getElementById("paymentRef");
    const receiptInput = document.getElementById("paymentReceipt");

    // Validamos campos obligatorios y que la referencia tenga exactamente 4 dígitos
    if (!fullNameInput || !fullNameInput.value.trim() || 
        !cedulaInput || !cedulaInput.value.trim() || 
        !refInput || refInput.value.trim().length !== 4) {
        alert("Por favor completa tu Nombre, Cédula y asegúrate de que la Referencia tenga exactamente 4 dígitos.");
        return;
    }

    const btn = document.getElementById("buyButton");
    const originalText = btn.innerText;
    btn.innerText = "Procesando pago y asignando números...";
    btn.disabled = true;

    try {
        let imageBase64 = "";
        let imageName = "";

        // Si adjuntó un capture, lo convertimos a Base64 para enviarlo a Google Sheets
        if (receiptInput && receiptInput.files && receiptInput.files[0]) {
            const file = receiptInput.files[0];
            imageName = file.name;
            imageBase64 = await convertFileToBase64(file);
        }

        const formData = {
            fullName: fullNameInput.value.trim(),
            userCedula: cedulaInput.value.trim(),
            userPhone: phoneInput ? phoneInput.value.trim() : "",
            userState: stateInput ? stateInput.value : "",
            ticketQuantity: quantityInput ? quantityInput.value : "10",
            sourceBank: sourceBankInput ? sourceBankInput.value : "",
            paymentRef: refInput.value.trim(),
            receiptImage: imageBase64,
            receiptName: imageName
        };

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
        alert("Ocurrió un error de conexión con el servidor. Verifica tu conexión.");
        btn.innerText = originalText;
        btn.disabled = false;
    }
});

// 3. Función para mostrar el modal corporativo
function showSuccessPopup(formData, result) {
    document.getElementById('modalName').innerText = formData.fullName;
    document.getElementById('modalCedula').innerText = formData.userCedula;
    document.getElementById('modalQty').innerText = formData.ticketQuantity;
    document.getElementById('modalNumbers').innerText = result.assignedNumbers || "Números asignados correctamente.";
    
    document.getElementById('successModal').style.display = 'flex';
}

// 4. Botón de cerrar el modal y refrescar
function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    location.reload();
}
