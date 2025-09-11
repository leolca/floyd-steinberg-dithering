'use strict';

document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
  // fix Chrome device pixel ratio
  document.querySelector('body').style.zoom = `${1 / window.devicePixelRatio * 100}%`;
  
  // handle slider updates
  document.getElementById('a').addEventListener('input', function() {
    document.getElementById('a-label').innerHTML = this.value;
    weights[0] = +this.value;
    dither();
  });
  document.getElementById('b').addEventListener('input', function() {
    document.getElementById('b-label').innerHTML = this.value;
    weights[1] = +this.value;
    dither();
  });
  document.getElementById('c').addEventListener('input', function() {
    document.getElementById('c-label').innerHTML = this.value;
    weights[2] = +this.value;
    dither();
  });
  document.getElementById('d').addEventListener('input', function() {
    document.getElementById('d-label').innerHTML = this.value;
    weights[3] = +this.value;
    dither();
  });
  document.getElementById('contrast').addEventListener('input', function() {
    document.getElementById('contrast-label').innerHTML = +this.value;
    dither();
  });
  document.getElementById('serpentine').addEventListener('change', function() {
    serpentine = this.checked;
    dither();
  });
  document.getElementById('randomize').addEventListener('change', function() {
    randomize_weights = this.checked;
    dither();
  });

  // handle url change
  document.getElementById('url').addEventListener('input', function() {
    load_img(this.value);
  });

  load_img(document.getElementById('url').value);
  return;

};

function randomize() {
  // randomize all the values, but set contrast to 0
  var params = 'a b c d'.split(' ');
  for (var i=0; i<params.length; i++) {
    var p = params[i];
    var input = document.getElementById(p);
    // randomize only within the middle half of the range
    var v = randInt(input.min/2, input.max/2);
    input.value = v;
    document.getElementById(p + '-label').innerHTML = v;
    weights[i] = v;
  }
  //var c = randInt(-50,100)/100;
  var c = 0;
  document.getElementById('contrast').value = c;
  document.getElementById('contrast-label').innerHTML = c;
  dither();
}

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function reset() {
  //reset to default values
  document.getElementById('a').value = 7;
  document.getElementById('a-label').innerHTML = 7;
  document.getElementById('b').value = 3;
  document.getElementById('b-label').innerHTML = 3;
  document.getElementById('c').value = 5;
  document.getElementById('c-label').innerHTML = 5;
  document.getElementById('d').value = 1;
  document.getElementById('d-label').innerHTML = 1;
  document.getElementById('contrast').value = 0;
  document.getElementById('contrast-label').innerHTML = 0;
  document.getElementById('serpentine').checked = false;
  document.getElementById('randomize').checked = false;
  serpentine = false;
  randomize_weights = false;
  weights = [7, 3, 5, 1];
  dither();
}

function toggleOriginal() {
  if (! screenctx.showing_original) {
    // store current dither
    screenctx.toggle = screenctx.getImageData(0, 0, 512, 512);

    // display original image
    var scale = 512/img.width;
    if (img.height*scale < 512) {
      scale = 512/img.height;
    }
    screenctx.drawImage(img, 0, 0, Math.floor(img.width*scale), Math.floor(img.height*scale));
    screenctx.showing_original = true;
  }
  else {
    screenctx.putImageData(screenctx.toggle, 0, 0);
    screenctx.showing_original = false;
  }
}

function dragOver(e) {
  e.preventDefault();
}

function dropFile(e) {
  e.preventDefault();
  console.log(e);
  if (e.dataTransfer.files) {
    // assume it is only file
    var file = e.dataTransfer.files[0];
    img = new Image();
    img.file = file;
    var reader = new FileReader();
    reader.onload=(function(f) {
      return function(e) {
        f.onload=function() {
          var scale = 512/f.width;
          console.log(f.width, f.height);
          if (f.height*scale < 512) {
            scale = 512/f.height;
          }
          screenctx.drawImage(f, 0, 0, Math.floor(f.width*scale), Math.floor(f.height*scale));
          dither();
        }
        f.src = e.target.result;
      };
    })(img);
    reader.readAsDataURL(file);
  }
}


var img = new Image();
var screenctx = document.getElementById('screen').getContext('2d');

function load_img(url) {
  img.src = url;
  img.crossOrigin = "Anonymous";
  img.onload = function() {
    dither();
  }
  img.onerror = function(e) {
    //
  }

}

function dither() {
  screenctx.fillStyle = '#888888ff';
  screenctx.fillRect(0,0,512,512);
  // scale image so it fills width
  var scale = 512/img.width;
  screenctx.drawImage(img, 0, 0, Math.floor(img.width*scale), Math.floor(img.height*scale));

  var imagedata = screenctx.getImageData(0, 0, 512, 512);
  var data = imagedata.data;
  data = grayscale(data);
  data = floyd_steinberg(data, 512, 512, weights, serpentine, randomize_weights);
  screenctx.putImageData(imagedata, 0, 0);
  screenctx.showing_original = false;
}

function grayscale(data) {
  var contrast = document.getElementById('contrast').value;
  for (var i=0; i<data.length; i+=4) {
    var r = data[i];
    var g = data[i+1];
    var b = data[i+2];
    var a = data[i+3];
    // calculate greyscale following Rec 601 luma
    var v = (0.3*r + 0.58*g + 0.11*b) * a/255;
    //stretch to increase contrast
    v = v + (v-128)*contrast;
    data[i] = v;
    data[i+1] = v;
    data[i+2] = v;
    data[i+3] = 255;
  }
  return data;
}

var weights = [7, 3, 5, 1];
var serpentine = false;
var randomize_weights = false; 

function floyd_steinberg(data, width, height, weights, serpentine, randomize_weights) {
    for (var y = 0; y < height; y++) {
        let x_start = 0;
        let x_end = width;
        let x_step = 1;

        if (serpentine && y % 2 !== 0) {
            x_start = width - 1;
            x_end = -1;
            x_step = -1;
        }

        for (var x = x_start; x !== x_end; x += x_step) {
            const i = (y * width + x) * 4;
            var v = data[i];
            var b = v < 128 ? 0 : 255;
            var err = v - b;
            data[i] = b ? 255 : 0;
            data[i + 1] = b ? 255 : 0;
            data[i + 2] = b ? 255 : 0;
            data[i + 3] = b ? 255 : 0;
            
            // Determine effective weights for the current pixel
            let eff_weights = [];
            if (randomize_weights) {
                for (let k = 0; k < weights.length; k++) {
                    eff_weights.push(Math.floor(Math.random() * (weights[k] + 1)));
                }
            } else {
                eff_weights = weights;
            }

            // Determine which neighbors are available
            const neighbor_exists = {
                ahead: (x + x_step >= 0 && x + x_step < width),
                bottom_backwards: ((x - x_step >= 0 && x - x_step < width) && (y + 1 < height)),
                bottom: (y + 1 < height),
                bottom_ahead: ((x + x_step >= 0 && x + x_step < width) && (y + 1 < height))
            };

            // Calculate the sum of effective weights for available neighbors
            let current_weights = [];
            let weights_sum = 0;

            const ahead_weight_idx = 0;
            const bottom_backwards_weight_idx = (x_step === 1) ? 1 : 3;
            const bottom_weight_idx = 2;
            const bottom_ahead_weight_idx = (x_step === 1) ? 3 : 1;

            if (neighbor_exists.ahead) {
                weights_sum += eff_weights[ahead_weight_idx];
                current_weights.push(eff_weights[ahead_weight_idx]);
            } else {
                current_weights.push(0);
            }

            if (neighbor_exists.bottom_backwards) {
                weights_sum += eff_weights[bottom_backwards_weight_idx];
                current_weights.push(eff_weights[bottom_backwards_weight_idx]);
            } else {
                current_weights.push(0);
            }

            if (neighbor_exists.bottom) {
                weights_sum += eff_weights[bottom_weight_idx];
                current_weights.push(eff_weights[bottom_weight_idx]);
            } else {
                current_weights.push(0);
            }

            if (neighbor_exists.bottom_ahead) {
                weights_sum += eff_weights[bottom_ahead_weight_idx];
                current_weights.push(eff_weights[bottom_ahead_weight_idx]);
            } else {
                current_weights.push(0);
            }
            
            if (weights_sum === 0) continue;

            // Apply error diffusion
            if (current_weights[0] > 0) { // Ahead neighbor
                const index = i + x_step * 4;
                data[index] += err * current_weights[0] / weights_sum;
                data[index + 1] += err * current_weights[0] / weights_sum;
                data[index + 2] += err * current_weights[0] / weights_sum;
            }

            if (current_weights[1] > 0) { // Bottom-backwards neighbor
                const index = i + width * 4 - x_step * 4;
                data[index] += err * current_weights[1] / weights_sum;
                data[index + 1] += err * current_weights[1] / weights_sum;
                data[index + 2] += err * current_weights[1] / weights_sum;
            }

            if (current_weights[2] > 0) { // Bottom neighbor
                const index = i + width * 4;
                data[index] += err * current_weights[2] / weights_sum;
                data[index + 1] += err * current_weights[2] / weights_sum;
                data[index + 2] += err * current_weights[2] / weights_sum;
            }
            
            if (current_weights[3] > 0) { // Bottom-ahead neighbor
                const index = i + width * 4 + x_step * 4;
                data[index] += err * current_weights[3] / weights_sum;
                data[index + 1] += err * current_weights[3] / weights_sum;
                data[index + 2] += err * current_weights[3] / weights_sum;
            }
        }
    }
    return data;
}
