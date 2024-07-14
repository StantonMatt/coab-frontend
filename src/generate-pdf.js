import util from './util.js';
import elements from './elements.js';
import axios from 'axios';
import * as XLSX from 'xlsx';

document.addEventListener('DOMContentLoaded', function () {
  const {
    pdfReturnToMainMenuBtn,
    fileInput,
    fileInputBtn,
    sheetList,
    processDataBtn,
    generateBarCodesBtn,
    generateBoletasBtn,
    pdfIframe,
    fechaEmision,
    fechaVencimiento,
    fechaLecturaAnterior,
    fechaLecturaActual,
    fechaProximaLectura,
  } = elements.getGeneratePdfElements();

  const homeChoices = document.querySelector('.home-choices');
  const pdfChoices = document.querySelector('.pdf-choices');

  console.log(fechaEmision.value);

  window.onload = function () {
    // var date =
    //   today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
    fechaVencimiento.value = util.getExpiryDate();
    fechaEmision.value = util.getIssueDate();
    fechaLecturaAnterior.value = util.getLecturaAnteriorDate();
    fechaLecturaActual.value = util.getLecturaActualDate();
    fechaProximaLectura.value = util.getProximaLecturaDate();
  };

  let dataObject = {};
  let workbook;

  pdfReturnToMainMenuBtn.addEventListener('click', () => {
    homeChoices.classList.toggle('hidden');
    pdfChoices.classList.toggle('hidden');
  });

  const readExcel = function (e) {
    const excelFile = e.target.files[0];

    if (excelFile === undefined || excelFile.length === 0) {
      return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
      const data = new Uint8Array(e.target.result);

      workbook = XLSX.read(data, { type: 'array' });

      while (sheetList.firstChild) {
        sheetList.removeChild(sheetList.firstChild);
      }

      workbook.SheetNames.forEach(sheet => {
        const option = document.createElement('option');
        option.style.color = 'black';
        option.text = sheet;
        sheetList.add(option);
      });
    };
    reader.readAsArrayBuffer(excelFile);
  };

  sheetList.addEventListener('change', () => {});

  fileInputBtn.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', readExcel);
  fileInput.addEventListener('cancel', readExcel);

  processDataBtn.addEventListener('click', async () => {
    dataObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheetList.value]);
    const rutEmpresa = dataObject[0]['RUT Empresa'];
    const fechaVigenciaTarifas = dataObject[0]['Fecha Vigencia Tarifas'];
    console.log(fechaVigenciaTarifas);

    for (const client of dataObject) {
      if (client['N#'] === 242 && !client['Recibe Factura']) {
        client['RUT Empresa'] = rutEmpresa;
        client['Fecha Vigencia Tarifas'] = fechaVigenciaTarifas;
        client['Fecha Emision'] = fechaEmision.value;
        client['Fecha Vencimiento'] = fechaVencimiento.value;
        client['Fecha Lectura Actual'] = fechaLecturaActual.value;
        client['Fecha Lectura Anterior'] = fechaLecturaAnterior.value;
        client['Fecha Proxima Lectura'] = fechaProximaLectura.value;
        const response = await axios.post('http://127.0.0.1:5000/api/process-data', client);
        console.log(response.data);
      }
    }
  });
  generateBarCodesBtn.addEventListener('click', async () => {
    dataObject = XLSX.utils.sheet_to_json(workbook.Sheets[sheetList.value]);
    const rutEmpresa = dataObject[0]['RUT Empresa'];
    const fechaVigenciaTarifas = dataObject[0]['Fecha Vigencia Tarifas'];
    console.log(fechaVigenciaTarifas);

    for (const client of dataObject) {
      if (client['N#'] === 242 && !client['Recibe Factura']) {
        client['RUT Empresa'] = rutEmpresa;
        client['Fecha Vigencia Tarifas'] = fechaVigenciaTarifas;
        client['Fecha Emision'] = fechaEmision.value;
        client['Fecha Vencimiento'] = fechaVencimiento.value;
        client['Fecha Lectura Actual'] = fechaLecturaActual.value;
        client['Fecha Lectura Anterior'] = fechaLecturaAnterior.value;
        client['Fecha Proxima Lectura'] = fechaProximaLectura.value;
        const response = await axios.post('http://127.0.0.1:5000/api/process-data', client);
        console.log(response.data);
      }
    }
  });
});
