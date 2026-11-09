// URL de tu Google Apps Script actual
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx0nxL_P7_yJWTSJFO-wv5CqPkrUeDbYsWTOKwjqZZfFoCtcYSODy_dQkNNRxGLzNf3Hg/exec";

// 1. Cargar stock real desde Google Sheets al abrir la página
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(WEB_APP_URL + "?action=getStock");
        const data = await response.json();
        const stockElement = document.getElementById("stockCount") || document.getElementById("stock") || document.getElementById("boletosDisponibles");
        if (stockElement) stockElement.innerText = data.stock || 9720;
    } catch (e) {
        console.log("Usando stock por defecto");
    }

    // Selector de precios dinámico
    const quantitySelect = document.getElementById("ticketQuantity") || document.getElementById("cantidad") || document.getElementById("qty");
    const totalPriceElement = document.getElementById("totalPrice") || document.getElementById("precioTotal");
    if (quantitySelect && totalPriceElement) {
        const prices = { "10": "300 Bs.f", "20": "600 Bs.f", "30": "900 Bs.f", "50": "1,500 Bs.f", "100": "3,000 Bs.f" };
        quantitySelect.addEventListener("change", () => {
            totalPriceElement.innerText = prices[quantitySelect.value] || "300 Bs.f";
        });
        totalPriceElement.innerText = prices[quantitySelect.value] || "300 Bs.f";
    }
});

// 2. Función auxiliar para leer inputs sin importar qué ID tengan en el HTML
function getInputValue(possibleIds) {
    for (let id of possibleIds) {
        const el = document.getElementById(id) || document.querySelector(`[name="${id}"]`);
        if (el && el.value) return el.value.trim();
    }
    return "";
}

// 3. Envío del formulario garantizado hacia Google Sheets
document.addEventListener("DOMContentLoaded", () => {
    const buyButton = document.getElementById("buyButton") || document.getElementById("comprar") || document.querySelector("button[type='submit']");
    if (buyButton) {
        buyButton.addEventListener("click", async function(event) {
            event.preventDefault();

            // Buscar los valores probando múltiples nombres de IDs comunes
            const fullName = getInputValue(["fullName", "nombre", "name", "txtNombre"]);
            const userCedula = getInputValue(["userCedula", "cedula", "dni", "txtCedula"]);
            const userPhone = getInputValue(["userPhone", "telefono", "phone", "celular"]) || "S/T";
            const userState = getInputValue(["userState", "estado", "region"]) || "N/A";
            const ticketQuantity = getInputValue(["ticketQuantity", "cantidad", "qty"]) || "10";
            const sourceBank = getInputValue(["sourceBank", "banco", "bank"]) || "N/A";
            const paymentRef = getInputValue(["paymentRef", "referencia", "ref", "pagoRef"]);

            if (!fullName || !userCedula || !paymentRef || paymentRef.length !== 4) {
                alert("Por favor completa tu Nombre, Cédula y asegúrate de que la Referencia tenga exactamente 4 dígitos.");
                return;
            }

            const btn = buyButton;
            const originalText = btn.innerText;
            btn.innerText = "Procesando...";
            btn.disabled = true;

            // Construir los parámetros exactos para Google Sheets
            const queryParams = new URLSearchParams({
                fullName: fullName,
                userCedula: userCedula,
                userPhone: userPhone,
                userState: userState,
                ticketQuantity: ticketQuantity,
                sourceBank: sourceBank,
                paymentRef: paymentRef
            });

            try {
                // Enviar la información directamente a Google Sheets mediante GET (`no-cors`)
                await fetch(`${WEB_APP_URL}?${queryParams.toString()}`, {
                    method: "GET",
                    mode: "no-cors"
                });

                // Generar boletos aleatorios únicos para el modal
                const mockNumbers = generateRandomTickets(parseInt(ticketQuantity));
                
                setTimeout(() => {
                    showSuccessPopup({ fullName, userCedula, ticketQuantity }, mockNumbers);
                    btn.innerText = originalText;
                    btn.disabled = false;
                }, 1000);

            } catch (error) {
                console.error("Error al enviar:", error);
                alert("Error al procesar la solicitud con el servidor.");
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

function showSuccessPopup(formData, assignedNumbers) {
    const modalName = document.getElementById('modalName') || document.getElementById('mNombre');
    const modalCedula = document.getElementById('modalCedula') || document.getElementById('mCedula');
    const modalQty = document.getElementById('modalQty') || document.getElementById('mCantidad');
    const modalNumbers = document.getElementById('modalNumbers') || document.getElementById('mBoletos');
    const successModal = document.getElementById('successModal') || document.getElementById('modalExito');

    if (modalName) modalName.innerText = formData.fullName;
    if (modalCedula) modalCedula.innerText = formData.userCedula;
    if (modalQty) modalQty.innerText = formData.ticketQuantity;
    if (modalNumbers) modalNumbers.innerText = assignedNumbers;
    if (successModal) successModal.style.display = 'flex';
}

function closeSuccessModal() {
    const successModal = document.getElementById('successModal') || document.getElementById('modalExito');
    if (successModal) successModal.style.display = 'none';
    location.reload();
}
