try {
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            alert(`✅ ¡Registro y Solicitud Enviados con Éxito!\n\nParticipante: ${name}\nCédula: ${cedula}\nEstado: ${state}\nBoletos Solicitados: ${qty}\nMétodo: ${method}\nReferencia: ${ref}\n\n⏳ Tus números han sido apartados temporalmente y están PENDIENTES DE VERIFICACIÓN DE PAGO por nuestro equipo. ¡Pronto te contactaremos!`);
            
            // Limpiar formulario
            fullNameInput.value = '';
            userCedulaInput.value = '';
            userPhoneInput.value = '';
            paymentRefInput.value = '';
            paymentReceiptInput.value = '';
            
            // Actualizar stock en pantalla
            setTimeout(loadStock, 2000);

        } catch (error) {
            console.error('Error al enviar los datos:', error);
            alert('Hubo un error al conectar con el servidor. Por favor intenta de nuevo.');
        }
