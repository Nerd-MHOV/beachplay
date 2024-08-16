const onvif = require('node-onvif');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

// Função para encontrar e conectar-se à câmera
async function findAndRecordCamera() {
  try {
      // Conectar-se ao primeiro dispositivo encontrado
      const cam = new onvif.OnvifDevice({
        xaddr: 'http://192.168.25.52/onvif/device_service',
        user: 'admin',
        pass: '123456'
      });

      // Inicializa a câmera
      await cam.init().then( () => {
        console.log(cam.getUdpStreamUrl())
         recordStream(cam.getUdpStreamUrl());
      })
      // Grava o stream usando FFmpeg
      
  } catch (error) {
    console.error('Erro ao conectar-se à câmera:', error);
  }
}

// Função para gravar o stream
function recordStream(rtspUri) {
  const command = ffmpeg('rtsp://admin:123456@192.168.25.52:554/cam/realmonitor?channel=2&subtype=1') 
    .format('image2') 
    .frames(0) 
    .updateOutput(true); 
   
  command.save('output_frames_%04d.jpg'); 
}

// Inicia a busca e gravação
findAndRecordCamera();
