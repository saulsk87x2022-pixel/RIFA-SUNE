// --- EVENTO PARA EL BOTÓN DE CONFIRMAR Y ENVIAR PAGO ---
document.addEventListener("DOMContentLoaded", () => {
    // Buscamos el botón de pago por su texto en la página
    const botones = document.querySelectorAll("button");
    let btnConfirmar = null;
    
    botones.forEach(btn => {
        if (btn.textContent.includes("Confirmar y Enviar Pago")) {
            btnConfirmar = btn;
        }
    });

    if (btnConfirmar) {
        btnConfirmar.addEventListener("click", async (e) => {
            e.preventDefault(); // Evita recargas si está dentro de un formulario
            
            // Capturamos los datos del formulario en pantalla
            const selectBanco = document.querySelector("select");
            const inputReferencia = document.querySelector("input[type='text'], input[type='number']");
            
            const banco = selectBanco ? selectBanco.value : "Banco de Venezuela";
            const referencia = inputReferencia ? inputReferencia.value : "";
            const monto = "300 Bs.f"; // O el valor correspondiente de tu lógica

            // Validación simple
            if (!referencia || referencia.trim() === "") {
                alert("Por favor ingresa los datos de la referencia de pago.");
                return;
            }

            const datosCompra = {
                banco: banco,
                referencia: referencia,
                monto: monto
            };

            try {
                // Enviamos los datos a tu Google Apps Script
                await fetch(WEB_APP_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(datosCompra)
                });

                alert("¡Pago enviado con éxito! Los datos se guardaron en Google Sheet.");
                
                // Limpiar el campo de referencia opcionalmente
                if (inputReferencia) inputReferencia.value = "";

            } catch (error) {
                console.error("Error al registrar el pago:", error);
                alert("Hubo un error al conectar con el servidor.");
            }
        });
    }
});
