// src : https://stackoverflow.com/questions/18299806/how-to-check-file-mime-type-with-javascript-before-upload
/**
 * Load the mime type based on the signature of the first bytes of the file
 * @param  {File}   file        A instance of File
 * @param  {Function} callback  Callback with the result
 * @author Victor www.vitim.us
 * @date   2017-03-23
 */
export default function loadMime(file, callback) {
    
  //List of known mimes
  const mimes = [
      {
          mime: 'image/jpeg',
          pattern: [0xFF, 0xD8, 0xFF],
          mask: [0xFF, 0xFF, 0xFF],
      },
      {
          mime: 'image/png',
          pattern: [0x89, 0x50, 0x4E, 0x47],
          mask: [0xFF, 0xFF, 0xFF, 0xFF],
      }
      // you can expand this list @see https://mimesniff.spec.whatwg.org/#matching-an-image-type-pattern
  ];

  function check(bytes, mime) {
      for (let i = 0, l = mime.mask.length; i < l; ++i) {
          if ((bytes[i] & mime.mask[i]) - mime.pattern[i] !== 0) {
              return false;
          }
      }
      return true;
  }

  const blob = file.slice(0, 4); //read the first 4 bytes of the file

  const reader = new FileReader();
  reader.onloadend = function(e) {
      if (e.target.readyState === FileReader.DONE) {
          const bytes = new Uint8Array(e.target.result);

          for (let i=0, l = mimes.length; i<l; ++i) {
              if (check(bytes, mimes[i])) return callback("Mime: " + mimes[i].mime + " <br> Browser:" + file.type);
          }

          return callback("Mime: unknown <br> Browser:" + file.type);
      }
  };
  reader.readAsArrayBuffer(blob);
}