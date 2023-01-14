const { Client, LocalAuth   } = require('whatsapp-web.js');
//const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json';


// const https = require("https");
const http = require("http");
const querystring = require("querystring");

// const url_servidor_chatbot = "http://127.0.0.1:5000";
const hostname_chatbot = "127.0.0.1";
const port_chatbot = "5000";
const path_chatbot = "/";

// La función que enviará el mensaje
function sendMessage(to, text) {
    client.sendMessage(to, text);
  // Tu código para enviar el mensaje aquí
  console.log(`Enviando mensaje a ${to}: ${text}`);
}

// function getCookie(name) {
//      var cookieValue = null;
//      if (document.cookie && document.cookie != '') {
//          var cookies = document.cookie.split(';');
//          for (var i = 0; i < cookies.length; i++) {
//              var cookie = jQuery.trim(cookies[i]);
//              // Does this cookie string begin with the name we want?
//              if (cookie.substring(0, name.length + 1) == (name + '=')) {
//                  cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                  break;
//              }
//          }
//      }
//      if(!cookieValue && csrftoken_inner){
//          cookieValue = csrftoken_inner;
//      }
//
//      return cookieValue;
//  }

// La función que hace la petición POST
function sendRequest(message) {
    console.log("Inicia función sendRequest()");
    // var token = getCookie('csrftoken');
    var query = querystring.stringify(message);
  // Crea el objeto de opciones para la petición
  const options = {
    hostname: hostname_chatbot,
    port: port_chatbot,
    path: path_chatbot+ "?" + query,
    // method: "POST",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
        // "X-CSRFToken": token
    }//,
    // qs: query
  };


    console.log("Inicio el xhr.send()");
  // Crea la petición HTTPS
  // const req = https.request(options, res => {
  const req = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);

    // Al recibir la respuesta, ejecuta la función de envío de mensajes
    res.on("data", d => {
        try{
          const response = JSON.parse(d);
          sendMessage(response.to, response.text);
        }
        catch (e) {
            console.log('No se logro finalizar la comunicación. ' + e);
        }
    });
  });

  // Si hay un error en la petición, muestra un mensaje en consola
  req.on("error", error => {
    console.error(error);
  });

  // // Envía los datos de la petición
  // req.write(JSON.stringify(message));    // Esto solo es necesario para peticiones POST
  req.end();
}



// // La función que enviará el mensaje
// function sendMessage(to, text) {
//     client.sendMessage(to, text);
//   // Tu código para enviar el mensaje aquí
//     console.log(`Enviando mensaje to ${to}: ${text}`);
// }
//
// // La función que hace la petición POST
// function sendRequest(message) {
//   // Crea el objeto XMLHttpRequest
//   const xhr = new XMLHttpRequest();
//
//     console.log("Inicia función sendRequest()");
//
//     var url_servidor_chatbot = "http://127.0.0.1:5000/";
//
//   // Define la URL y el método de la petición
//     console.log("url de comunicación: " + url_servidor_chatbot);
//   xhr.open("POST", url_servidor_chatbot, true);
//
//   // Establece los encabezados para enviar datos en formato JSON
//   xhr.setRequestHeader("Content-Type", "application/json");
//
//   // Envía la petición con los parámetros del mensaje como data
//     console.log("Inicio el xhr.send()");
//   xhr.send(JSON.stringify(message));
//
//   // Define la función que se ejecutará al recibir la respuesta
//   xhr.onload = function() {
//     if (xhr.status === 200) {
//       // Si la petición tiene éxito, obtiene la respuesta y ejecuta la función de envío de mensajes
//       const response = JSON.parse(xhr.responseText);
//       sendMessage(response.to, response.text);
//     } else {
//       // Si la petición falla, muestra un error en consola
//       console.error(xhr.statusText);
//     }
//   };
// }

// // Ejemplo de uso de la función
// const message = {
//   id: "12345",
//   author: "67890",
//   timestamp: "2022-01-01T12:00:00",
//   body: "Hola mundo",
//   type: "text",
//   quotedMessage: {
//     id: "67890",
//     author: "12345",
//     timestamp: "2022-01-01T11:00:00",
//     body: "¿Qué tal?",
//     type: "text"
//   }
// };



// Load the session data if it has been previously saved
let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values
const client = new Client(
//     {
//     authStrategy: new LocalAuth ({ session: sessionData }
//     )
// }
);

// // Save session values to the file upon successful auth
// client.on('authenticated', (session) => {
//     if(session !== undefined) {
//         sessionData = session;
//         let sessiopn_data_str = JSON.stringify(session);
//         console.log(sessiopn_data_str);
//         fs.writeFile(SESSION_FILE_PATH, sessiopn_data_str, (err) => {
//             if (err) {
//                 console.error(err);
//             }
//         });
//     }
// });



// const client = new Client(
// //     {
// //     authStrategy: new LocalAuth({ clientId: "client-one" })
// // }
// );
//
client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    // console.log('QR RECEIVED', qr);

    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    console.log(msg.from);
    // if(msg.from.startsWith('5491137719084'))
    // // if (msg.body == '!ping')
    // {
    //     msg.reply('inicio comunicación'); // Responde a un mensaje
        sendRequest(msg);
        // client.sendMessage(msg.from, 'pong'); // Envía un mensaje como respuesta.
    // }
});




client.initialize();