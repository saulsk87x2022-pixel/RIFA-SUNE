const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx0nxL_P7_yJWTSJFO-wv5CqPkrUeDbYsWTOKwjqZZfFoCtcYSODy_dQkNNRxGLzNf3Hg/exec";

const prices = { 
    "10": 300, 
    "20": 600, 
    "30": 900, 
    "50": 1500, 
    "100": 3000 
};

// 1. Cargar el stock real y configurar precios al abrir la página
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(WEB_APP_URL + "?action=getStock");
        const data = await response.json();
        const stockElement = document.getElementById("stockCount");
        if (stockElement && data.stock !== undefined) {
            stockElement.innerText = data.stock.toLocaleString('es-VE');
        }
    } catch (e) {
        console.log("No se pudo cargar el stock en tiempo real.");
    }

    const quantitySelect = document.getElementById("ticketQuantity");
    const totalPriceElement = document.getElementById("totalPrice");
    
    if (quantitySelect && totalPriceElement) {
        const updatePrice = () => {
            const selectedVal = quantitySelect.value;
            const price = prices[selectedVal] || 300;
            totalPriceElement.innerText = price.toLocaleString('es-VE') + " Bs.f";
        };

        quantitySelect.addEventListener("change", updatePrice);
        updatePrice();
    }
});

// 2. Manejo del botón de compra
document.addEventListener("DOMContentLoaded", () => {
    const buyButton = document.getElementById("buyButton");
    
    if (buyButton) {
        buyButton.addEventListener("click", async function(event) {
            event.preventDefault();

            const fullName = document.getElementById("fullName").value.trim();
            const userCedula = document.getElementById("userCedula").value.trim();
            const userPhone = document.getElementById("userPhone").value.trim();
            const userState = document.getElementById("userState").value;
            const ticketQuantity = document.getElementById("ticketQuantity").value;
            
            const sourceBankSelect = document.getElementById("sourceBank");
            const sourceBank = sourceBankSelect.options[sourceBankSelect.selectedIndex].text;
            
            const paymentRef = document.getElementById("paymentRef").value.trim();
            const paymentReceipt = document.getElementById("paymentReceipt");

            // Validaciones
            if (!fullName) { alert("Por favor ingresa tu Nombre y Apellido."); return document.getElementById("fullName").focus(); }
            if (!userCedula) { alert("Por favor ingresa tu Cédula de Identidad."); return document.getElementById("userCedula").focus(); }
            if (!userPhone) { alert("Por favor ingresa tu Teléfono o WhatsApp."); return document.getElementById("userPhone").focus(); }
            if (!userState) { alert("Por favor selecciona tu Estado de procedencia."); return document.getElementById("userState").focus(); }
            if (!paymentRef || paymentRef.length !== 4) { alert("La referencia debe tener los últimos 4 dígitos."); return document.getElementById("paymentRef").focus(); }
            if (!paymentReceipt.files || paymentReceipt.files.length === 0) { alert("Por favor adjunta el capture del comprobante."); return paymentReceipt.focus(); }

            const btn = buyButton;
            const originalText = btn.innerText;
            btn.innerText = "Procesando...";
            btn.disabled = true;

            // Generar los boletos para el cliente y para el Sheet
            const mockNumbers = generateRandomTickets(parseInt(ticketQuantity));
            const montoPagar = prices[ticketQuantity] || 300;

            const queryParams = new URLSearchParams({
                fullName: fullName,
                userCedula: userCedula,
                userPhone: userPhone,
                userState: userState,
                ticketQuantity: ticketQuantity,
                monto: montoPagar,
                sourceBank: sourceBank,
                paymentRef: paymentRef,
                boletos: mockNumbers
            });

            try {
                await fetch(`${WEB_APP_URL}?${queryParams.toString()}`, {
                    method: "GET",
                    mode: "no-cors"
                });

                setTimeout(() => {
                    showSuccessPopup({ fullName, userCedula, ticketQuantity }, mockNumbers);
                    btn.innerText = originalText;
                    btn.disabled = false;
                }, 1000);

            } catch (error) {
                console.error("Error al enviar los datos:", error);
                alert("Hubo un error al procesar la solicitud con el servidor.");
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
