import axios from 'axios';
import { Builder } from 'xml2js';

async function sendSoapRequest() {
  const url = 'http://localhost:3000/soap';

  const builder = new Builder({ headless: true });
  const soapRequestEnvelope = {
    'soap:Envelope': {
      '$': {
        'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
        'xmlns:tns': 'http://example.com/myservice'
      },
      'soap:Body': {
        'tns:something': {}
      }
    }
  }

  const xmlRequestBody = builder.buildObject(soapRequestEnvelope);

  try {
    const response = await axios.post(url, xmlRequestBody, {
      headers: {
        'Content-Type': 'text/xml',
        'SOAPAction': 'http://example.com/myservice/addNumbers'
      }
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
