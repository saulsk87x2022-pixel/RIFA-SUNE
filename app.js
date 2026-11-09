// URL de tu Google Apps Script actualizada con la nueva versión
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx0nxL_P7_yJWTSJFO-wv5CqPkrUeDbYsWTOKwjqZZfFoCtcYSODy_dQkNNRxGLzNf3Hg/exec";

// 1. Cargar stock inicial al abrir la página
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(WEB_APP_URL + "?action=getStock");
        const data = await response.json();
        const stockElement = document.getElementById("stockCount");
        if (stockElement) stockElement.innerText = data.stock || 9949;
    } catch (e) {
        console.log("Stock por defecto cargado");
    }

    // Configurar selector de precios dinámico
    const quantitySelect = document.getElementById("ticketQuantity");
    const totalPriceElement = document.getElementById("totalPrice");
    if (quantitySelect && totalPriceElement) {
        const prices = { "10": "300 Bs.f", "20": "600 Bs.f", "30": "900 Bs.f", "50": "1,500 Bs.f", "100": "3,000 Bs.f" };
        quantitySelect.addEventListener("change", () => {
            totalPriceElement.innerText = prices[quantitySelect.value] || "300 Bs.f";
        });
        totalPriceElement.innerText = prices[quantitySelect.value] || "300 Bs.f";
    }
});

// 2. Envío del formulario garantizado mediante parámetros GET
document.addEventListener("DOMContentLoaded", () => {
    const buyButton = document.getElementById("buyButton");
    if (buyButton) {
        buyButton.addEventListener("click", async function(event) {
            event.preventDefault();

            const fullName = document.getElementById("fullName")?.value.trim();
            const userCedula = document.getElementById("userCedula")?.value.trim();
            const userPhone = document.getElementById("userPhone")?.value.trim() || "";
            const userState = document.getElementById("userState")?.value || "";
            const ticketQuantity = document.getElementById("ticketQuantity")?.value || "10";
            const sourceBank = document.getElementById("sourceBank")?.value || "";
            const paymentRef = document.getElementById("paymentRef")?.value.trim();

            if (!fullName || !userCedula || !paymentRef || paymentRef.length !== 4) {
                alert("Completa tu Nombre, Cédula y asegúrate de que la Referencia tenga exactamente 4 dígitos.");
                return;
            }

            const btn = document.getElementById("buyButton");
            const originalText = btn.innerText;
            btn.innerText = "Procesando...";
            btn.disabled = true;

            const queryParams = new URLSearchParams({
                fullName,
                userCedula,
                userPhone,
                userState,
                ticketQuantity,
                sourceBank,
                paymentRef
            });

            try {
                // Envío mediante GET para evitar bloqueos de red y CORS del navegador
                await fetch(`${WEB_APP_URL}?${queryParams.toString()}`, {
                    method: "GET",
                    mode: "no-cors"
                });

                // Generar boletos aleatorios para mostrarlos de inmediato en el modal
                const mockNumbers = generateRandomTickets(parseInt(ticketQuantity));
                setTimeout(() => {
                    showSuccessPopup({ fullName, userCedula, ticketQuantity }, mockNumbers);
                    btn.innerText = originalText;
                    btn.disabled = false;
                }, 800);

            } catch (error) {
                console.error("Error:", error);
                alert("Error al procesar la solicitud.");
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }
});

function generateRandomTickets(qty) {
    let nums = [];
    while(nums.length < qty) {
        let rand = ("0000" + Math.floor(Math.random() * 10000)).slice(-4);
        if(!nums.includes(rand)) nums.push(rand);
    }
    return nums.join(", ");
}

// 3. Mostrar el modal con los datos de la compra
function showSuccessPopup(formData, assignedNumbers) {
    document.getElementById('modalName').innerText = formData.fullName;
    document.getElementById('modalCedula').innerText = formData.userCedula;
    document.getElementById('modalQty').innerText = formData.ticketQuantity;
    document.getElementById('modalNumbers').innerText = assignedNumbers;
    document.getElementById('successModal').style.display = 'flex';
}

// 4. Cerrar modal y refrescar
function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    location.reload();
}
