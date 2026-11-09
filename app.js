// Función para enviar la compra a Google Sheets al confirmar el formulario
async function enviarCompraAGoogleSheet(datosFormulario) {
  try {
    const response = await fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors", // Requerido para evitar problemas CORS con Apps Script
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datosFormulario)
    });

    alert("¡Pago enviado con éxito! Su registro ha sido guardado.");
  } catch (error) {
    console.error("Error al enviar los datos a Google Sheets:", error);
    alert("Hubo un error al registrar el pago.");
  }
}
