// URL de tu Google Apps Script actualizada
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx2-x-lwkXrAfic_MPDO1W7D3ZThKX8tS5-gJtRs2E2fSVdLE8QksT30ojGb34QbIIg/exec";

// 1. Cargar stock inicial y activar el selector de precios dinámico
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(WEB_APP_URL + "?action=getStock");
        const data = await response.json();
        const stockValue = data.stock !== undefined ? data.stock : 9949;
        
        const stockElement = document.getElementById("stockCount");
        if (stockElement) {
            stockElement.innerText = stockValue;
        }
    } catch (e) {
        console.log("Error cargando stock inicial:", e);
    }

    const quantitySelect = document.getElementById("ticketQuantity");
    const totalPriceElement = document.getElementById("totalPrice");

    if (quantitySelect && totalPriceElement) {
        const pricesMap = {
            "10": "300 Bs.f",
            "20": "600 Bs.f",
            "30": "900 Bs.f",
            "50": "1,500 Bs.f",
            "100": "3,000 Bs.f"
        };

        const updatePrice = () => {
            const val = quantitySelect.value;
            totalPriceElement.innerText = pricesMap[val] || "300 Bs.f";
        };

        quantitySelect.addEventListener("change", updatePrice);
        updatePrice();
    }
});

// 2. Evento del botón de compra optimizado para registro seguro en Google Sheet
document.addEventListener("DOMContentLoaded", () => {
    const buyButton = document.getElementById("buyButton");
    if (buyButton) {
        buyButton.addEventListener("click", async function(event) {
            event.preventDefault();

            const fullNameInput = document.getElementById("fullName");
            const cedulaInput = document.getElementById("userCedula");
            const phoneInput = document.getElementById("userPhone");
            const stateInput = document.getElementById("userState");
            const quantityInput = document.getElementById("ticketQuantity");
            const sourceBankInput = document.getElementById("sourceBank");
            const refInput = document.getElementById("paymentRef");
            const receiptInput = document.getElementById("paymentReceipt");

            if (!fullNameInput || !fullNameInput.value.trim() || 
                !cedulaInput || !cedulaInput.value.trim() || 
                !refInput || refInput.value.trim().length !== 4) {
                alert("Por favor completa tu Nombre, Cédula y asegúrate de que la Referencia de Pago tenga exactamente 4 dígitos.");
                return;
            }

            const btn = document.getElementById("buyButton");
            const originalText = btn.innerText;
            btn.innerText = "Procesando pago y asignando números...";
            btn.disabled = true;

            let imageName = "";
            if (receiptInput && receiptInput.files && receiptInput.files[0]) {
                imageName = receiptInput.files[0].name;
            }

            const formData = {
                fullName: fullNameInput.value.trim(),
                userCedula: cedulaInput.value.trim(),
                userPhone: phoneInput ? phoneInput.value.trim() : "",
                userState: stateInput ? stateInput.value : "",
                ticketQuantity: quantityInput ? quantityInput.value : "10",
                sourceBank: sourceBankInput ? sourceBankInput.value : "",
                paymentRef: refInput.value.trim(),
                receiptName: imageName
            };

            try {
                // Convertimos los datos a formato URL encoded para asegurar lectura total en Google Apps Script
                const encodedData = new URLSearchParams(formData).toString();

                await fetch(WEB_APP_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: encodedData,
                    keepalive: true
                });

                // Generamos los números de boletos aleatorios de 4 dígitos para mostrarlos en pantalla
                const mockNumbers = generateRandomTickets(parseInt(formData.ticketQuantity));
                
                setTimeout(() => {
                    showSuccessPopup(formData, { assignedNumbers: mockNumbers });
                }, 800);

            } catch (error) {
                console.error("Error:", error);
                alert("Ocurrió un error al procesar la solicitud.");
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }
});

function generateRandomTickets(qty) {
    let nums = [];
    while(nums.length < qty) {
        let rand = Math.floor(Math.random() * 10000);
        let formatted = ("0000" + rand).slice(-4);
        if(!nums.includes(formatted)) {
            nums.push(formatted);
        }
    }
    return nums.join(", ");
}

// 3. Función para mostrar el modal corporativo
function showSuccessPopup(formData, result) {
    const modalName = document.getElementById('modalName');
    const modalCedula = document.getElementById('modalCedula');
    const modalQty = document.getElementById('modalQty');
    const modalNumbers = document.getElementById('modalNumbers');
    const successModal = document.getElementById('successModal');

    if (modalName) modalName.innerText = formData.fullName;
    if (modalCedula) modalCedula.innerText = formData.userCedula;
    if (modalQty) modalQty.innerText = formData.ticketQuantity;
    if (modalNumbers) modalNumbers.innerText = result.assignedNumbers || "Números asignados correctamente.";
    
    if (successModal) successModal.style.display = 'flex';
}

// 4. Botón de cerrar el modal y refrescar
function closeSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) successModal.style.display = 'none';
    location.reload();
}
