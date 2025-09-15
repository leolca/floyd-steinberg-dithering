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
  //document.getElementById('randomize').addEventListener('change', function() {
  //  randomize_weights = this.checked;
  //  dither();
  //});
  document.getElementById('randomize').addEventListener('change', function() {
      randomize_weights = this.checked;
      const orderedOption = document.getElementById('ordered-option');
      if (this.checked) {
          orderedOption.style.display = 'block';
      } else {
          orderedOption.style.display = 'none';
      }
      dither();
  });
  document.getElementById('ordered_weights').addEventListener('change', function() {
    ordered_weights = this.checked;
    dither();
  });
  document.getElementById('weight_factor_slider').addEventListener('input', function() {
    document.getElementById('weight_factor_value').innerHTML = this.value;
    weight_factor = +this.value;
    dither(); 
  });

  // Listen for a change on the dropdown
  image_selector.addEventListener('change', function() {
    const selected_value = this.value;
  
    if (selected_value === 'file_input_trigger') {
      // If the "Choose your own image" option is selected, trigger the hidden file input
      file_input.click();
    } else {
      // Otherwise, load the predefined image
      load_img(selected_value);
    }
  });
  
  // Listen for a change on the hidden file input
  file_input.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        load_img(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Optional: Reset the dropdown to a default state or the first option
      // to prevent it from showing "Choose your own image..." permanently.
      // For example: image_selector.value = 'image/vanitas.png';
    }
  });

  // Load the initial image from the default selected option
  load_img(image_selector.value);

  // Add this new event listener to your JavaScript file
  document.getElementById('save-button').addEventListener('click', function() {
      // Get the canvas element
      const canvas = document.getElementById('screen');
      
      // Check if a dithered image is available on the canvas
      if (!canvas || !canvas.getContext) {
          console.error("Canvas not found or not supported.");
          return;
      }
      
      // Create a data URL from the canvas content
      const image_data_url = canvas.toDataURL('image/png');
  
      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = image_data_url;
      link.download = 'dithered_image.png'; // Set the default filename
  
      // Append the link to the body (required for Firefox)
      document.body.appendChild(link);
      
      // Programmatically click the link to trigger the download
      link.click();
      
      // Clean up by removing the temporary link
      document.body.removeChild(link);
  });

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
  document.getElementById('weight_factor_slider').value = 1;
  document.getElementById('weight_factor_value').innerHTML = 1;
  document.getElementById('ordered_weights').checked = false;
  serpentine = false;
  randomize_weights = false;
  ordered_weights = false;
  weights = [7, 3, 5, 1];
  weight_factor = 1.0;
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

//function load_img(url) {
//  img.crossOrigin = "Anonymous"; // Required for loading cross-domain images
//  img.src = url;
//
//  img.onload = function() {
//    // Create a temporary canvas to get the pixel data
//    const temp_canvas = document.createElement('canvas');
//    const temp_ctx = temp_canvas.getContext('2d');
//    
//    // Set canvas dimensions to match the image
//    temp_canvas.width = img.width;
//    temp_canvas.height = img.height;
//
//    // Draw the image onto the temporary canvas
//    temp_ctx.drawImage(img, 0, 0);
//
//    // Get the pixel data from the temporary canvas
//    const imageData = temp_ctx.getImageData(0, 0, temp_canvas.width, temp_canvas.height);
//    
//    // Store the original pixel data in the global variable
//    original_img_data = new Uint8ClampedArray(imageData.data);
//
//    // Now, call dither() to process the image
//    dither();
//  };
//
//  img.onerror = function(e) {
//    console.error("Failed to load image:", e);
//  };
//}

function load_img(url) {
  // Assuming a global `img` object is declared elsewhere
  img.crossOrigin = "Anonymous";
  img.src = url;

  img.onload = function() {
    // Set screen canvas dimensions to match the image
    screenctx.canvas.width = img.width;
    screenctx.canvas.height = img.height;

    // Draw the original image to the screen canvas
    screenctx.drawImage(img, 0, 0, img.width, img.height);
    
    // Get the pixel data from the canvas and store it globally
    const imageData = screenctx.getImageData(0, 0, img.width, img.height);
    original_img_data = new Uint8ClampedArray(imageData.data);

    // Now, call dither() to process the image
    dither();
  };

  img.onerror = function(e) {
    console.error("Failed to load image:", e);
  };
}

function dither() {
  if (!original_img_data) {
    // Wait for the image to load
    return;
  }

  // Use a fresh copy of the original image data for all processing
  const working_data = new Uint8ClampedArray(original_img_data);

  // Apply grayscale to the working copy. Make sure your grayscale function returns a new array
  // instead of modifying in-place.
  const grayscale_data = grayscale(working_data);

  // Make a COPY of the grayscale data to dither, preserving the original grayscale data
  let dithered_data = new Uint8ClampedArray(grayscale_data);
  
  // Apply Floyd-Steinberg dithering to the dithered_data
  dithered_data = floyd_steinberg(dithered_data, screenctx.canvas.width, screenctx.canvas.height, weights, serpentine, randomize_weights, ordered_weights, weight_factor);
  
  // Update the visible canvas with the final dithered image
  screenctx.putImageData(new ImageData(dithered_data, screenctx.canvas.width, screenctx.canvas.height), 0, 0);

  // Calculate quality metrics
  update_quality_metrics(grayscale_data, dithered_data);

  screenctx.showing_original = false;
}

//function dither() {
//  screenctx.fillStyle = '#888888ff';
//  screenctx.fillRect(0,0,512,512);
//  // scale image so it fills width
//  var scale = 512/img.width;
//  screenctx.drawImage(img, 0, 0, Math.floor(img.width*scale), Math.floor(img.height*scale));
//  
//  var imagedata = screenctx.getImageData(0, 0, 512, 512);
//  var data = imagedata.data;
//
//  // Store the original grayscale data
//  var original_grayscale_data = grayscale(data);
//  
//  // Make a COPY of the original grayscale data for dithering
//  var dithered_data = new Uint8ClampedArray(original_grayscale_data);
//  
//  // Apply dithering to the COPY
//  floyd_steinberg(dithered_data, 512, 512, weights, serpentine, randomize_weights);
//  
//  // Update the canvas with the dithered image
//  screenctx.putImageData(new ImageData(dithered_data, 512, 512), 0, 0);
//  screenctx.showing_original = false;
//  
//  // Pass both the original and dithered data to the metrics function
//  update_quality_metrics(original_grayscale_data, dithered_data);
//}

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

// Get the dropdown and the hidden file input elements
const image_selector = document.getElementById('image_selector');
const file_input = document.getElementById('file_input');

var weights = [7, 3, 5, 1];
var serpentine = false;
var randomize_weights = false;
var ordered_weights = false;
var weight_factor = 1.0;

// original pixel data
let original_img_data; 

function floyd_steinberg(data, width, height, weights, serpentine, randomize_weights, ordered_weights, weight_factor) {
    // 1. Convert the input Uint8ClampedArray to a Float32Array for accurate calculations
    const float_data = new Float32Array(data.length);
    for (let i = 0; i < data.length; i++) {
        float_data[i] = data[i];
    }
    
    // 2. Perform all calculations using the floating-point array
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
            const original_val = float_data[i];
            
            const quantized_val = original_val < 128 ? 0 : 255;
            const err = original_val - quantized_val;
            
            float_data[i] = quantized_val;
            float_data[i + 1] = quantized_val;
            float_data[i + 2] = quantized_val;
            float_data[i + 3] = 255; // Ensure alpha is fully opaque

            // Get effective weights
            let eff_weights = [];
            if (randomize_weights) {
                for (let k = 0; k < weights.length; k++) {
                    eff_weights.push(Math.floor(Math.random() * (weights[k] + 1)));
                }
                if (ordered_weights) {
                    eff_weights.sort((a, b) => b - a); // Sort in descending order
                }
            } else {
                eff_weights = weights;
            }

            let available_weights_sum = 0;
            const ahead_x = x + x_step;
            const bottom_y = y + 1;
            
            if (ahead_x >= 0 && ahead_x < width) {
                available_weights_sum += eff_weights[0];
            }
            if (bottom_y < height) {
                if ((x - x_step) >= 0 && (x - x_step) < width) {
                    available_weights_sum += eff_weights[1];
                }
                available_weights_sum += eff_weights[2];
                if ((x + x_step) >= 0 && (x + x_step) < width) {
                    available_weights_sum += eff_weights[3];
                }
            }

            if (available_weights_sum === 0) continue;

            // Apply error diffusion using the floating-point array
            if (ahead_x >= 0 && ahead_x < width) {
                const weight = (eff_weights[0] / available_weights_sum) * weight_factor;
                float_data[i + x_step * 4] += err * weight;
                float_data[i + x_step * 4 + 1] += err * weight;
                float_data[i + x_step * 4 + 2] += err * weight;
            }
            if (bottom_y < height) {
                if ((x - x_step) >= 0 && (x - x_step) < width) {
                    const weight = (eff_weights[1] / available_weights_sum) * weight_factor;
                    const index = i + width * 4 - x_step * 4;
                    float_data[index] += err * weight;
                    float_data[index + 1] += err * weight;
                    float_data[index + 2] += err * weight;
                }
                const weight = (eff_weights[2] / available_weights_sum) * weight_factor;
                const index = i + width * 4;
                float_data[index] += err * weight;
                float_data[index + 1] += err * weight;
                float_data[index + 2] += err * weight;

                if ((x + x_step) >= 0 && (x + x_step) < width) {
                    const weight = (eff_weights[3] / available_weights_sum) * weight_factor;
                    const index = i + width * 4 + x_step * 4;
                    float_data[index] += err * weight;
                    float_data[index + 1] += err * weight;
                    float_data[index + 2] += err * weight;
                }
            }
        }
    }
    
    // 3. Copy the processed data back to the original Uint8ClampedArray
    for (let i = 0; i < data.length; i++) {
        data[i] = float_data[i];
    }
    
    return data;
}

//function floyd_steinberg(data, width, height, weights, serpentine, randomize_weights) {
//    for (var y = 0; y < height; y++) {
//        let x_start = 0;
//        let x_end = width;
//        let x_step = 1;
//
//        if (serpentine && y % 2 !== 0) {
//            x_start = width - 1;
//            x_end = -1;
//            x_step = -1;
//        }
//
//        for (var x = x_start; x !== x_end; x += x_step) {
//            const i = (y * width + x) * 4;
//            var v = data[i];
//            var b = v < 128 ? 0 : 255;
//            var err = v - b;
//            data[i] = b ? 255 : 0;
//            data[i + 1] = b ? 255 : 0;
//            data[i + 2] = b ? 255 : 0;
//            data[i + 3] = 255; // Ensure alpha is fully opaque
//            
//            // Determine effective weights for the current pixel
//            let eff_weights = [];
//            if (randomize_weights) {
//                for (let k = 0; k < weights.length; k++) {
//                    eff_weights.push(Math.floor(Math.random() * (weights[k] + 1)));
//                }
//            } else {
//                eff_weights = weights;
//            }
//
//            // Determine which neighbors are available
//            const neighbor_exists = {
//                ahead: (x + x_step >= 0 && x + x_step < width),
//                bottom_backwards: ((x - x_step >= 0 && x - x_step < width) && (y + 1 < height)),
//                bottom: (y + 1 < height),
//                bottom_ahead: ((x + x_step >= 0 && x + x_step < width) && (y + 1 < height))
//            };
//
//            // Calculate the sum of effective weights for available neighbors
//            let current_weights = [];
//            let weights_sum = 0;
//
//            const ahead_weight_idx = 0;
//            const bottom_backwards_weight_idx = (x_step === 1) ? 1 : 3;
//            const bottom_weight_idx = 2;
//            const bottom_ahead_weight_idx = (x_step === 1) ? 3 : 1;
//
//            if (neighbor_exists.ahead) {
//                weights_sum += eff_weights[ahead_weight_idx];
//                current_weights.push(eff_weights[ahead_weight_idx]);
//            } else {
//                current_weights.push(0);
//            }
//
//            if (neighbor_exists.bottom_backwards) {
//                weights_sum += eff_weights[bottom_backwards_weight_idx];
//                current_weights.push(eff_weights[bottom_backwards_weight_idx]);
//            } else {
//                current_weights.push(0);
//            }
//
//            if (neighbor_exists.bottom) {
//                weights_sum += eff_weights[bottom_weight_idx];
//                current_weights.push(eff_weights[bottom_weight_idx]);
//            } else {
//                current_weights.push(0);
//            }
//
//            if (neighbor_exists.bottom_ahead) {
//                weights_sum += eff_weights[bottom_ahead_weight_idx];
//                current_weights.push(eff_weights[bottom_ahead_weight_idx]);
//            } else {
//                current_weights.push(0);
//            }
//            
//            if (weights_sum === 0) continue;
//
//            // Apply error diffusion
//            if (current_weights[0] > 0) { // Ahead neighbor
//                const index = i + x_step * 4;
//                data[index] += err * current_weights[0] / weights_sum;
//                data[index + 1] += err * current_weights[0] / weights_sum;
//                data[index + 2] += err * current_weights[0] / weights_sum;
//            }
//
//            if (current_weights[1] > 0) { // Bottom-backwards neighbor
//                const index = i + width * 4 - x_step * 4;
//                data[index] += err * current_weights[1] / weights_sum;
//                data[index + 1] += err * current_weights[1] / weights_sum;
//                data[index + 2] += err * current_weights[1] / weights_sum;
//            }
//
//            if (current_weights[2] > 0) { // Bottom neighbor
//                const index = i + width * 4;
//                data[index] += err * current_weights[2] / weights_sum;
//                data[index + 1] += err * current_weights[2] / weights_sum;
//                data[index + 2] += err * current_weights[2] / weights_sum;
//            }
//            
//            if (current_weights[3] > 0) { // Bottom-ahead neighbor
//                const index = i + width * 4 + x_step * 4;
//                data[index] += err * current_weights[3] / weights_sum;
//                data[index + 1] += err * current_weights[3] / weights_sum;
//                data[index + 2] += err * current_weights[3] / weights_sum;
//            }
//        }
//    }
//    return data;
//}


// Quality Measurement Functions 

/**
 * Calculates and updates the quality metrics displayed in the UI.
 * @param {Uint8ClampedArray} originalData - The pixel data of the original image.
 * @param {Uint8ClampedArray} ditheredData - The pixel data of the dithered image.
 */
function update_quality_metrics(originalData, ditheredData) {
    const mse = calculateMSE(originalData, ditheredData);
    const snr = calculateSNR(originalData, mse);
    const psnr = calculatePSNR(mse);
    const ssim = calculateSSIM(originalData, ditheredData, 512, 512);

    document.getElementById('mse-label').innerHTML = mse.toFixed(2);
    document.getElementById('snr-label').innerHTML = `${snr.toFixed(2)} dB`;
    document.getElementById('psnr-label').innerHTML = `${psnr.toFixed(2)} dB`;
    document.getElementById('ssim-label').innerHTML = ssim.toFixed(3);
}

/**
 * Calculates the Mean Squared Error (MSE) between two image data arrays.
 * @param {Uint8ClampedArray} originalData - The pixel data of the original image.
 * @param {Uint8ClampedArray} ditheredData - The pixel data of the dithered image.
 * @returns {number} The calculated MSE value.
 */
function calculateMSE(originalData, ditheredData) {
    let sum_squared_error = 0;
    // Iterate over the RGB channels only (steps of 4 for RGBA)
    for (let i = 0; i < originalData.length; i += 4) {
        // Calculate squared error for each color channel
        sum_squared_error += Math.pow((originalData[i] - ditheredData[i])/255, 2);
        sum_squared_error += Math.pow((originalData[i + 1] - ditheredData[i + 1])/255, 2);
        sum_squared_error += Math.pow((originalData[i + 2] - ditheredData[i + 2])/255, 2);
    }
    // Divide by the total number of color channels (excluding alpha)
    const num_pixels = originalData.length / 4;
    return sum_squared_error / (num_pixels * 3);
}

/**
 * Calculates the Signal-to-Noise Ratio (SNR) in decibels (dB).
 * @param {Uint8ClampedArray} originalData - The pixel data of the original image.
 * @param {number} mse - The pre-calculated Mean Squared Error.
 * @returns {number} The calculated SNR value in dB.
 */
function calculateSNR(originalData, mse) {
    if (mse === 0) return Infinity; // Avoid division by zero
    let signal_power = 0;
    for (let i = 0; i < originalData.length; i += 4) {
        signal_power += Math.pow(originalData[i]/255, 2);
        signal_power += Math.pow(originalData[i + 1]/255, 2);
        signal_power += Math.pow(originalData[i + 2]/255, 2);
    }
    const num_pixels = originalData.length / 4;
    const signal_avg_power = signal_power / (num_pixels * 3);
    const snr = signal_avg_power / mse;
    // Return in decibels
    return 10 * Math.log10(snr);
}

/**
 * Calculates the Peak Signal-to-Noise Ratio (PSNR) in decibels (dB).
 * @param {number} mse - The pre-calculated Mean Squared Error.
 * @returns {number} The calculated PSNR value in dB.
 */
function calculatePSNR(mse) {
    if (mse === 0) return Infinity; // Avoid division by zero
    const max_pixel_value = 1;
    const psnr = Math.pow(max_pixel_value, 2) / mse;
    // Return in decibels
    return 10 * Math.log10(psnr);
}

/**
 * Calculates the Structural Similarity Index (SSIM) between two grayscale images.
 * @param {Uint8ClampedArray} originalData - The pixel data of the original grayscale image.
 * @param {Uint8ClampedArray} ditheredData - The pixel data of the dithered grayscale image.
 * @param {number} width - The width of the image.
 * @param {number} height - The height of the image.
 * @returns {number} The calculated SSIM score (0-1).
 */
function calculateSSIM(originalData, ditheredData, width, height) {
    const K1 = 0.01, K2 = 0.03;
    const L = 255; // Max pixel value
    const C1 = Math.pow(K1 * L, 2);
    const C2 = Math.pow(K2 * L, 2);
    const window_size = 8;
    
    let ssim_total = 0;
    let num_windows = 0;
    
    // Iterate through the image with a sliding window
    for (let y = 0; y <= height - window_size; y++) {
        for (let x = 0; x <= width - window_size; x++) {
            let mean_x = 0, mean_y = 0;
            let sigma_x_sq = 0, sigma_y_sq = 0, sigma_xy = 0;
            
            // Calculate statistics for the current window
            for (let wy = 0; wy < window_size; wy++) {
                for (let wx = 0; wx < window_size; wx++) {
                    const i = ((y + wy) * width + (x + wx)) * 4;
                    const val_x = originalData[i];
                    const val_y = ditheredData[i];
                    
                    mean_x += val_x;
                    mean_y += val_y;
                }
            }
            
            const num_pixels_in_window = window_size * window_size;
            mean_x /= num_pixels_in_window;
            mean_y /= num_pixels_in_window;
            
            // Calculate variance and covariance
            for (let wy = 0; wy < window_size; wy++) {
                for (let wx = 0; wx < window_size; wx++) {
                    const i = ((y + wy) * width + (x + wx)) * 4;
                    const val_x = originalData[i];
                    const val_y = ditheredData[i];
                    
                    sigma_x_sq += Math.pow(val_x - mean_x, 2);
                    sigma_y_sq += Math.pow(val_y - mean_y, 2);
                    sigma_xy += (val_x - mean_x) * (val_y - mean_y);
                }
            }
            
            sigma_x_sq /= (num_pixels_in_window - 1);
            sigma_y_sq /= (num_pixels_in_window - 1);
            sigma_xy /= (num_pixels_in_window - 1);
            
            // Apply the SSIM formula for the current window
            const numerator = (2 * mean_x * mean_y + C1) * (2 * sigma_xy + C2);
            const denominator = (sigma_x_sq + sigma_y_sq + C1) * (sigma_x_sq + sigma_y_sq + C2);
            const ssim_window = numerator / denominator;
            
            ssim_total += ssim_window;
            num_windows++;
        }
    }
    
    // Return the average SSIM score for the whole image
    return ssim_total / num_windows;
}
