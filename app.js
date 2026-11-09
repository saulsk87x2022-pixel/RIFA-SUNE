function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);
  
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Obtener o crear la pestaña "Ventas"
    var sheet = ss.getSheetByName("Ventas");
    if (!sheet) {
      sheet = ss.insertSheet("Ventas");
      sheet.appendRow([
        "Fecha/Hora", "Nombre y Apellido", "Cédula", "Teléfono", "Estado", 
        "Boletos", "Método de Pago", "Banco Emisor", "Referencia", 
        "Números Asignados", "Estatus", "Comprobante"
      ]);
    }
    
    // Obtener o crear la pestaña "Stock"
    var stockSheet = ss.getSheetByName("Stock");
    if (!stockSheet) {
      stockSheet = ss.insertSheet("Stock");
      stockSheet.getRange("B13").setValue(9949);
    }
    
    var data = JSON.parse(e.postData.contents);
    
    var fullName = data.fullName;
    var userCedula = data.userCedula;
    var userPhone = data.userPhone;
    var userState = data.userState;
    var qty = parseInt(data.ticketQuantity);
    var sourceBank = data.sourceBank;
    var paymentRef = data.paymentRef;
    var receiptName = data.receiptName;
    
    // Registro limpio del comprobante basado en el nombre y referencia
    var fileUrl = receiptName ? "Comprobante: " + receiptName + " (Ref: " + paymentRef + ")" : "Comprobante Recibido (Ref: " + paymentRef + ")";
    
    // Lógica para asignar números de boletos únicos
    var totalBoletos = 9999;
    var lastRow = sheet.getLastRow();
    var soldNumbersSet = {};
    
    if (lastRow > 1) {
      var existingData = sheet.getRange(2, 10, lastRow - 1, 1).getValues();
      for (var i = 0; i < existingData.length; i++) {
        var rowNums = String(existingData[i][0]).split(",");
        for (var j = 0; j < rowNums.length; j++) {
          var numTrim = rowNums[j].trim();
          if (numTrim) soldNumbersSet[numTrim] = true;
        }
      }
    }
    
    var assignedNumbers = [];
    var attempts = 0;
    while (assignedNumbers.length < qty && attempts < 50000) {
      var randomNum = Math.floor(Math.random() * totalBoletos);
      var formattedNum = ("0000" + randomNum).slice(-4);
      if (!soldNumbersSet[formattedNum]) {
        soldNumbersSet[formattedNum] = true;
        assignedNumbers.push(formattedNum);
      }
      attempts++;
    }
    
    var assignedStr = assignedNumbers.join(", ");
    var fechaHora = Utilities.formatDate(new Date(), "America/Caracas", "dd/MM/yyyy HH:mm:ss");
    
    // Registrar la compra en la pestaña "Ventas"
    sheet.appendRow([
      fechaHora,
      fullName,
      userCedula,
      userPhone,
      userState,
      qty,
      "Pago Móvil",
      sourceBank,
      paymentRef,
      assignedStr,
      "Pendiente de Verificación",
      fileUrl
    ]);

    var resultado = {
      status: "success",
      assignedNumbers: assignedStr
    };

    return ContentService.createTextOutput(JSON.stringify(resultado))
                         .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var stockSheet = ss.getSheetByName("Stock");
    if (!stockSheet) {
      stockSheet = ss.insertSheet("Stock");
      stockSheet.getRange("B13").setValue(9949);
    }
    
    var rawStock = stockSheet.getRange("B13").getValue();
    var stockVal = parseInt(rawStock) || 9949;

    return ContentService.createTextOutput(JSON.stringify({ stock: stockVal }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ stock: 9949 }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
