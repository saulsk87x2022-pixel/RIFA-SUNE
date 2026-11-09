// URL de tu Google Apps Script actualizada y lista
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw-LaRYkjPs9OUiRU8a3YINeQb7hZlszij4X-QSiwor1Oxl00SyUGZZWPTnGChycAiVGA/exec";

// Cargar stock inicial
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(WEB_APP_URL + "?action=getStock");
        const data = await response.json();
        const stockElement = document.getElementById("stockCount");
        if (stockElement) stockElement.innerText = data.stock || 9949;
    } catch (e) {
        console.log("Stock por defecto cargado");
    }

    // Selector de precios
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

// Enviar formulario sin bloqueos CORS
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
            btn.innerText = "Procesando...";
            btn.disabled = true;

            const formData = { fullName, userCedula, userPhone, userState, ticketQuantity, sourceBank, paymentRef };

            try {
                await fetch(WEB_APP_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams(formData).toString(),
                    keepalive: true
                });

                // Generar boletos locales para el modal de éxito de inmediato
                const mockNumbers = generateRandomTickets(parseInt(ticketQuantity));
                setTimeout(() => {
                    showSuccessPopup(formData, mockNumbers);
                }, 600);

            } catch (error) {
                alert("Error al procesar la solicitud.");
                btn.innerText = "Comprar Boletos";
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
    document.getElementById('modalName').innerText = formData.fullName;
    document.getElementById('modalCedula').innerText = formData.userCedula;
    document.getElementById('modalQty').innerText = formData.ticketQuantity;
    document.getElementById('modalNumbers').innerText = assignedNumbers;
    document.getElementById('successModal').style.display = 'flex';
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
    location.reload();
}
