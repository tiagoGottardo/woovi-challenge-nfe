import axios from 'axios';

async function sendSoapRequest() {
  const url = 'http://localhost:3000/soap';

  const xml = `
    <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Header/>
      <soap:Body>
        <consStatServ xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
          <tpAmb>1</tpAmb>
          <cUF>35</cUF>
          <xServ>STATUS</xServ>
        </consStatServ>
      </soap:Body>
    </soap:Envelope>
  `
  try {
    const response = await axios.post(url, xml, {
      headers: { 'Content-Type': 'text/xml' }
    });

    console.log('SOAP Response Status:', response.status);
    console.log('SOAP Response Headers:', response.headers);
    console.log('SOAP Response Data (XML):', response.data);

  } catch (error: any) {
    if (error.response) {
      console.error('SOAP Request Error Status:', error.response.status);
      console.error('SOAP Request Error Headers:', error.response.headers);
      console.error('SOAP Request Error Data (XML):', error.response.data);
    } else if (error.request) {
      console.error('SOAP Request Error: No response received from server.');
      console.error(error.request);
    } else {
      console.error('Error sending SOAP request:', error.message);
    }
  }
}

sendSoapRequest();
