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
  document.getElementById('circularWeights').addEventListener('change', function() {
    circularweights = this.checked;
    const randomizeCheckbox = document.getElementById('randomize');
    const permuteCheckbox = document.getElementById('permuteWeights');
    const contrastCheckbox = document.getElementById('contrast_aware_weights');
    const contrastCheckbox2 = document.getElementById('contrast_aware_weights2');
    if (this.checked) {
        randomizeCheckbox.disabled = true;
        randomizeCheckbox.checked = false;
        randomize_weights = false;
        permuteCheckbox.disabled = true;
        permuteCheckbox.checked = false;
        permuteweights = false;
        contrastCheckbox.disabled = true;
        contrastCheckbox.checked = false;
        contrast_aware_weights = false;
        contrastCheckbox2.disabled = true;
        contrastCheckbox2.checked = false;
        contrast_aware_weights2 = false;
    } else {
        randomizeCheckbox.disabled = false;
        permuteCheckbox.disabled = false;
        contrastCheckbox.disabled = false;
        contrastCheckbox2.disabled = false;
    }
    dither();
  });
  document.getElementById('permuteWeights').addEventListener('change', function() {
    permuteweights = this.checked;
    const randomizeCheckbox = document.getElementById('randomize');
    const circularCheckbox = document.getElementById('circularWeights');
    const contrastCheckbox = document.getElementById('contrast_aware_weights');
    const contrastCheckbox2 = document.getElementById('contrast_aware_weights2');
    if (this.checked) {
        randomizeCheckbox.disabled = true;
        randomizeCheckbox.checked = false;
        randomize_weights = false;
        circularCheckbox.disabled = true;
        circularCheckbox.checked = false;
        circularweights = false;
        contrastCheckbox.disabled = true;
        contrastCheckbox.checked = false;
        contrast_aware_weights = false;
        contrastCheckbox2.disabled = true;
        contrastCheckbox2.checked = false;
        contrast_aware_weights2 = false;
    } else {
        randomizeCheckbox.disabled = false;
        circularCheckbox.disabled = false;
        contrastCheckbox.disabled = false;
        contrastCheckbox2.disabled = false;
    }
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
  document.getElementById('random_weight_factor').addEventListener('change', function() {
      random_weight_factor = this.checked;
      if (this.checked) {
	 document.getElementById('weight_factor_slider').disabled = true;
      } else {
	 document.getElementById('weight_factor_slider').disabled = false;
	 weight_factor = parseFloat(document.getElementById('weight_factor_value').innerHTML);
      }
      dither();
  });
  document.getElementById('weight_factor_slider').addEventListener('input', function() {
    document.getElementById('weight_factor_value').innerHTML = this.value;
    weight_factor = +this.value;
    dither(); 
  });
  document.getElementById('contrast_aware_weights').addEventListener('change', function() {
    contrast_aware_weights = this.checked;

    const contrastCheckbox2 = document.getElementById('contrast_aware_weights2');
    if (this.checked) {
        document.getElementById('a').disabled = true;
        document.getElementById('b').disabled = true;
        document.getElementById('c').disabled = true;
        document.getElementById('d').disabled = true;
        contrastCheckbox2.disabled = true;
    } else {
        document.getElementById('a').disabled = false;
        document.getElementById('b').disabled = false;
        document.getElementById('c').disabled = false;
        document.getElementById('d').disabled = false;
        contrastCheckbox2.disabled = false;
    }

    dither();
  });
  document.getElementById('contrast_aware_weights2').addEventListener('change', function() {
    contrast_aware_weights2 = this.checked;

    const contrastCheckbox = document.getElementById('contrast_aware_weights');
    if (this.checked) {
        document.getElementById('a').disabled = true;
        document.getElementById('b').disabled = true;
        document.getElementById('c').disabled = true;
        document.getElementById('d').disabled = true;
        contrastCheckbox.disabled = true;
    } else {
        document.getElementById('a').disabled = false;
        document.getElementById('b').disabled = false;
        document.getElementById('c').disabled = false;
        document.getElementById('d').disabled = false;
        contrastCheckbox.disabled = false;
    }

    dither();
  });

  document.getElementById('block_processing').addEventListener('change', function() {
      block_processing = this.checked;
      const blksize = document.getElementById('block_size');
      if (this.checked) {
          blksize.style.display = 'block';
      } else {
          blksize.style.display = 'none';
      }
      dither();
  });

  // block size slider handle updates
  document.getElementById('block_size_slider').addEventListener('input', function() {
    document.getElementById('block_size_value').innerHTML = this.value;
    block_size = parseInt(this.value);
    dither();
  });

  document.getElementById('quantize_error_checkbox').addEventListener('change', function() {
    const quantOption = document.getElementById('error-quant-option');
    quantize_error = document.getElementById('quantize_error_checkbox').checked;
    if (this.checked) {
        quantOption.style.display = 'block';
    } else {
        quantOption.style.display = 'none';
    }
    dither();
  });

  document.getElementById('error_bits_slider').addEventListener('input', function() {
      document.getElementById('error_bits_value').textContent = this.value;
      error_bits = parseInt(document.getElementById('error_bits_slider').value);
      dither();
    });
  
  document.getElementById('edge_switch_checkbox').addEventListener('change', function() {
      const thresholdOption = document.getElementById('edge-threshold-option');
      edge_switch = this.checked;
      if (this.checked) {
          thresholdOption.style.display = 'block';
      } else {
          thresholdOption.style.display = 'none';
      }
      dither();
  });
  
  document.getElementById('edge_threshold_slider').addEventListener('input', function() {
      document.getElementById('edge_threshold_value').textContent = this.value;
      edge_threshold = parseFloat(this.value);
      dither();
  });


  document.getElementById('filter_blur_checkbox').addEventListener('change', function() {
      const blurOption = document.getElementById('filter-blur-option');
      use_filter_blur = this.checked;
      if (this.checked) {
          blurOption.style.display = 'block';
      } else {
          blurOption.style.display = 'none';
      }
      dither();
  });
  
  document.getElementById('filter_size_slider').addEventListener('input', function() {
      document.getElementById('filter_size_value').textContent = this.value;
      filter_size = parseInt(document.getElementById('filter_size_slider').value);
      dither();
  });


  document.getElementById('blur_threshold_slider').addEventListener('input', function() {
      document.getElementById('blur_threshold_value').textContent = this.value;
      blur_threshold = parseFloat(this.value);
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
  document.getElementById('circularWeights').checked = false;
  document.getElementById('circularWeights').checked = false;
  document.getElementById('randomize').checked = false;
  document.getElementById('weight_factor_slider').value = 1;
  document.getElementById('weight_factor_value').innerHTML = 1;
  document.getElementById('ordered_weights').checked = false;
  document.getElementById('contrast_aware_weights').checked = false;
  document.getElementById('contrast_aware_weights2').checked = false;
  serpentine = false;
  circularweights = false;
  permuteweigts = false;
  randomize_weights = false;
  random_weight_factor = false;
  block_processing = false;
  block_size = 32;
  quantize_error = false;
  error_bits = 8;
  ordered_weights = false;
  edge_switch = false;
  edge_threshold = 0.1;
  blur_threshold = 0.1;
  use_filter_blur = false;
  filter_size = 1;
  weights = [7, 3, 5, 1];
  weight_factor = 1.0;
  contrast_aware_weights = false;
  contrast_aware_weights2 = false;
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
  //let dithered_data = new Uint8ClampedArray(grayscale_data);
  let dithered_data = grayscale_data.slice();
 
  if(block_processing){
    dithered_data = process_blocks(dithered_data, screenctx.canvas.width, screenctx.canvas.height, weights, serpentine, circularweights, permuteweights, randomize_weights, random_weight_factor, ordered_weights, weight_factor, contrast_aware_weights, contrast_aware_weights2, block_size, quantize_error, error_bits, edge_switch, edge_threshold, use_filter_blur, filter_size, blur_threshold);
  }
  else {
    // Apply Floyd-Steinberg dithering to the dithered_data
    dithered_data = floyd_steinberg(dithered_data, screenctx.canvas.width, screenctx.canvas.height, weights, serpentine, circularweights, permuteweights, randomize_weights, random_weight_factor, ordered_weights, weight_factor, contrast_aware_weights, contrast_aware_weights2, block_size, quantize_error, error_bits, edge_switch, edge_threshold, use_filter_blur, filter_size, blur_threshold);
  }
  
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
var circularweights = false;
var permuteweights = false;
var randomize_weights = false;
var random_weight_factor = false;
var block_processing = false;
var block_size = 32;
var quantize_error = false;
var error_bits = 8;
var ordered_weights = false;
var weight_factor = 1.0;
var contrast_aware_weights = false;
var contrast_aware_weights2 = false;
var edge_switch = false;
var use_filter_blur = false;
var filter_size = 1;
var edge_threshold = 0.1;
var blur_threshold = 0.1;

const BLUR_MATRICES = {
    // Size 1: (1+1)x(2*1+1) = 2x3 matrix. Current pixel is at M[1][1].
    // Let's adjust the size based on your example: 4x2 is unusual for a filter,
    // so we'll assume a standard 3x3 to 5x5 filter shape for demonstration,
    // but the logic below adheres to the (s+1) x (2s+1) concept.

    1: [ // 2x3 matrix (s+1)x(2s+1)
        [0.211, 0.197, 0.211],
        [0.197, 0.184, 0.000] // M[1][1] = 0.128 is the current pixel
    ],

    2: [ // 3x5 matrix (3x5)
        // ... Fill in your actual values ...
        [0.086, 0.080, 0.075, 0.080, 0.086],
        [0.080, 0.075, 0.070, 0.075, 0.0800], // M[2][2] is current pixel
        [0.075, 0.070, 0.065, 0    , 0     ]
    ],

    3: [ // 4x7 matrix (3x5)
	[0.048, 0.045, 0.042, 0.039, 0.042, 0.045, 0.048],
	[0.045, 0.042, 0.039, 0.036, 0.039, 0.042, 0.045],
	[0.042, 0.039, 0.036, 0.034, 0.036, 0.039, 0.042],
	[0.039, 0.036, 0.034, 0.031, 0.000, 0.000, 0.000]
    ],

    4: [
	[0.031, 0.029, 0.027, 0.025, 0.024, 0.025, 0.027, 0.029, 0.031],
	[0.029, 0.027, 0.025, 0.024, 0.022, 0.024, 0.025, 0.027, 0.029],
	[0.027, 0.025, 0.023, 0.022, 0.020, 0.022, 0.023, 0.025, 0.027],
	[0.025, 0.024, 0.022, 0.020, 0.019, 0.020, 0.022, 0.024, 0.025],
	[0.024, 0.022, 0.020, 0.019, 0.018, 0.000, 0.000, 0.000, 0.000]
    ],

    5: [
	[0.022, 0.021, 0.019, 0.018, 0.017, 0.016, 0.017, 0.018, 0.019, 0.021, 0.022],
	[0.021, 0.019, 0.018, 0.017, 0.016, 0.015, 0.016, 0.017, 0.018, 0.019, 0.021],
	[0.019, 0.018, 0.017, 0.016, 0.015, 0.014, 0.015, 0.016, 0.017, 0.018, 0.019],
        [0.018, 0.017, 0.016, 0.015, 0.014, 0.013, 0.014, 0.015, 0.016, 0.017, 0.018],
	[0.017, 0.016, 0.015, 0.014, 0.013, 0.012, 0.013, 0.014, 0.015, 0.016, 0.017],
	[0.016, 0.015, 0.014, 0.013, 0.012, 0.011, 0.000, 0.000, 0.000, 0.000, 0.000],
    ],

    6: [
	[0.017, 0.016, 0.015, 0.014, 0.013, 0.012, 0.011, 0.012, 0.013, 0.014, 0.015, 0.016, 0.017],
	[0.016, 0.015, 0.014, 0.013, 0.012, 0.011, 0.011, 0.011, 0.012, 0.013, 0.014, 0.015, 0.016],
	[0.015, 0.014, 0.013, 0.012, 0.011, 0.010, 0.010, 0.010, 0.011, 0.012, 0.013, 0.014, 0.015],
	[0.014, 0.013, 0.012, 0.011, 0.010, 0.010, 0.009, 0.010, 0.010, 0.011, 0.012, 0.013, 0.014],
	[0.013, 0.012, 0.011, 0.010, 0.010, 0.009, 0.008, 0.009, 0.010, 0.010, 0.011, 0.012, 0.013],
	[0.012, 0.011, 0.010, 0.010, 0.009, 0.008, 0.008, 0.008, 0.009, 0.010, 0.010, 0.011, 0.012],
	[0.011, 0.011, 0.010, 0.009, 0.008, 0.008, 0.007, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000],
    ],

    7: [
	[0.014, 0.013, 0.012, 0.011, 0.010, 0.010, 0.009, 0.009, 0.009, 0.010, 0.010, 0.011, 0.012, 0.013, 0.014],
	[0.013, 0.012, 0.011, 0.010, 0.010, 0.009, 0.008, 0.008, 0.008, 0.009, 0.010, 0.010, 0.011, 0.012, 0.013],
	[0.012, 0.011, 0.010, 0.010, 0.009, 0.008, 0.008, 0.007, 0.008, 0.008, 0.009, 0.010, 0.010, 0.011, 0.012],
	[0.011, 0.010, 0.010, 0.009, 0.008, 0.008, 0.007, 0.007, 0.007, 0.008, 0.008, 0.009, 0.010, 0.010, 0.011],
	[0.010, 0.009, 0.008, 0.008, 0.007, 0.007, 0.006, 0.006, 0.006, 0.007, 0.007, 0.008, 0.008, 0.009, 0.010],
	[0.010, 0.009, 0.008, 0.008, 0.007, 0.007, 0.006, 0.006, 0.006, 0.007, 0.007, 0.008, 0.008, 0.009, 0.010],
	[0.009, 0.008, 0.008, 0.007, 0.007, 0.006, 0.006, 0.006, 0.006, 0.006, 0.007, 0.007, 0.008, 0.008, 0.009],
	[0.009, 0.008, 0.007, 0.007, 0.006, 0.006, 0.006, 0.005, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000, 0.000],
    ],
};

// Function to perform a circular shift
const circularShift = (arr) => {
  if (arr.length <= 1) return arr;
  const firstElement = arr.shift();
  arr.push(firstElement);
  return arr;
};

// Function to permute the elements of an array using the Fisher-Yates shuffle
const permuteArray = (arr) => {
  let arrayToPermute = [...arr]; // Create a copy to avoid modifying the original array
  let currentIndex = arrayToPermute.length;
  let randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [arrayToPermute[currentIndex], arrayToPermute[randomIndex]] = [
      arrayToPermute[randomIndex], arrayToPermute[currentIndex]];
  }

  return arrayToPermute;
};

// original pixel data
let original_img_data; 

function floyd_steinberg(data, width, height, weights, serpentine, circularweights, permuteweights, randomize_weights, random_weight_factor, ordered_weights, weight_factor, contrast_aware_weights, contrast_aware_weights2, block_size, quantize_error, error_bits, edge_switch, edge_threshold, use_filter_blur, filter_size, blur_threshold) {
    // Make a safe, local copy of the original weights
    var original_weights = [...weights];

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
	    //console.log(`OV: ${original_val}`);
            
            // Determine effective weights based on the selected options
            let eff_weights = [];
        
	    if (random_weight_factor) {
                //weight_factor = 0.9 + 0.1*Math.random();
		weight_factor = Math.random();
		//weight_factor = getNormalRandom(0.8,0.5);
	    }
 
            if (contrast_aware_weights) {
                // 1. Calculate weights based on local contrast
                let diff = [0, 0, 0, 0];
                let sum_diff = 0;
            
                // Neighbor 0: Right
                if ((x + x_step >= 0) && (x + x_step < width)) {
                    diff[0] = Math.abs(float_data[i + x_step * 4] - original_val);
                    sum_diff += diff[0];
                }
                // Neighbor 1: Bottom-left
                if ((y + 1 < height) && (x - x_step >= 0) && (x - x_step < width)) {
                    const index = i + width * 4 - x_step * 4;
                    diff[1] = Math.abs(float_data[index] - original_val);
                    sum_diff += diff[1];
                }
                // Neighbor 2: Bottom
                if (y + 1 < height) {
                    const index = i + width * 4;
                    diff[2] = Math.abs(float_data[index] - original_val);
                    sum_diff += diff[2];
                }
                // Neighbor 3: Bottom-right
                if ((y + 1 < height) && (x + x_step >= 0) && (x + x_step < width)) {
                    const index = i + width * 4 + x_step * 4;
                    diff[3] = Math.abs(float_data[index] - original_val);
                    sum_diff += diff[3];
                }
        
                // 2. Normalize differences to get the contrast-aware weights
                let base_weights = [0, 0, 0, 0];
                if (sum_diff > 0) {
                    for (let k = 0; k < diff.length; k++) {
                        base_weights[k] = diff[k] / sum_diff;
                    }
                } else {
                    base_weights = [0.25, 0.25, 0.25, 0.25];
                }
        
                // 3. Apply randomization if requested
                if (randomize_weights) {
                    for (let k = 0; k < base_weights.length; k++) {
                        // Use the calculated base_weights as the maximum value
                        eff_weights.push(Math.random() * base_weights[k]);
                    }
                    if (ordered_weights) {
                        // 1. Sort the weights in standard descending order
                        eff_weights.sort((a, b) => b - a);
                
                        // 2. Create a temporary array to hold the new order
                        const temp_weights = [];
                
                        // 3. Manually re-assign to get the desired order
                        // Largest at position 0
                        temp_weights[0] = eff_weights[0];
                
                        // Third largest at position 1
                        temp_weights[1] = eff_weights[2];
                
                        // Second largest at position 2
                        temp_weights[2] = eff_weights[1];
                
                        // Smallest at position 3
                        temp_weights[3] = eff_weights[3];
                
                        // 4. Assign the correctly ordered array back to eff_weights
                        eff_weights = temp_weights;
                    }
                } else {
                // Just use the contrast-aware weights directly
                eff_weights = base_weights;
            }
            } else if (randomize_weights) {
                // Existing logic for random weights based on the original_weights
                for (let k = 0; k < original_weights.length; k++) {
                    eff_weights.push(Math.floor(Math.random() * (original_weights[k] + 1)));
                }
                if (ordered_weights) {
                    // 1. Sort the weights in standard descending order
                    eff_weights.sort((a, b) => b - a);
            
                    // 2. Create a temporary array to hold the new order
                    const temp_weights = [];
            
                    // 3. Manually re-assign to get the desired order
                    // Largest at position 0
                    temp_weights[0] = eff_weights[0];
            
                    // Third largest at position 1
                    temp_weights[1] = eff_weights[2];
            
                    // Second largest at position 2
                    temp_weights[2] = eff_weights[1];
            
                    // Smallest at position 3
                    temp_weights[3] = eff_weights[3];
            
                    // 4. Assign the correctly ordered array back to eff_weights
                    eff_weights = temp_weights;
                }
            } else if (circularweights) { 
                  original_weights = circularShift(original_weights);
                  eff_weights = original_weights;
            } else if (permuteweights) {
                  eff_weights = permuteArray(original_weights);
            } else if (contrast_aware_weights2) {
                  let w = [0, 0, 0, 0]
                  let sum_w = 0;
                  // Neighbor 0: Right
                  if ((x + x_step >= 0) && (x + x_step < width)) {
                      w[0] = float_data[i + x_step * 4];
                      sum_w += w[0];
                  }
                  // Neighbor 1: Bottom-left
                  if ((y + 1 < height) && (x - x_step >= 0) && (x - x_step < width)) {
                      const index = i + width * 4 - x_step * 4;
                      w[1] = float_data[index];
                      sum_w += w[1];
                  }
                  // Neighbor 2: Bottom
                  if (y + 1 < height) {
                      const index = i + width * 4;
                      w[2] = float_data[index];
                      sum_w += w[2];
                  }
                  // Neighbor 3: Bottom-right
                  if ((y + 1 < height) && (x + x_step >= 0) && (x + x_step < width)) {
                      const index = i + width * 4 + x_step * 4;
                      w[3] = float_data[index];
                      sum_w += w[3];
                  }
             
                  // 2. Normalize differences to get the contrast-aware weights
                  if (sum_w > 0) {
                      for (let k = 0; k < w.length; k++) {
                          w[k] = w[k] / sum_w;
                      }
                  } else {
                      w = [0.25, 0.25, 0.25, 0.25];
                  }

                  // 3. Apply randomization if requested
                  if (randomize_weights) {
                      for (let k = 0; k < w.length; k++) {
                          // Use the calculated base_weights as the maximum value
                          eff_weights.push(Math.random() * w[k]);
                      }
                      if (ordered_weights) {
                          // 1. Sort the weights in standard descending order
                          eff_weights.sort((a, b) => b - a);
                          // 2. Create a temporary array to hold the new order
                          const temp_weights = [];
                          // 3. Manually re-assign to get the desired order
                          // Largest at position 0
                          temp_weights[0] = eff_weights[0];
                
                          // Third largest at position 1
                          temp_weights[1] = eff_weights[2];
                
                          // Second largest at position 2
                          temp_weights[2] = eff_weights[1];
                
                          // Smallest at position 3
                          temp_weights[3] = eff_weights[3];
                
                          // 4. Assign the correctly ordered array back to eff_weights
                          eff_weights = temp_weights;
                      }
                  } else {
                      eff_weights = w;
                  }
            } else {
                  // Default weights
                  eff_weights = original_weights;
            }

            const quantized_val = original_val < 128 ? 0 : 255;
            var err = original_val - quantized_val;

	    // Now, apply the dithered value to the current pixel
            float_data[i] = quantized_val;
            float_data[i + 1] = quantized_val;
            float_data[i + 2] = quantized_val;
            float_data[i + 3] = 255; 

	    // FILTER BLUR LOGIC
            if (use_filter_blur) {
		// --- Step 1: Detect Edge (Same logic as Edge Switch) ---
                let neighbor_b = 0; // Neighbor behind (I(i,j-1))
                let neighbor_a = 0; // Neighbor above (I(i-1,j))

                // Get neighbor behind (j-1, which is x - x_step)
                const behind_x = x - x_step;
                if (behind_x >= 0 && behind_x < width) {
                    neighbor_b = float_data[i - x_step * 4];
                }

                // Get neighbor above (i-1, which is y - 1)
                const above_y = y - 1;
                if (above_y >= 0 && above_y < height) {
                    neighbor_a = float_data[i - width * 4];
                }

                // Calculate the average of the two processed neighbors
                const neighbors_avg = (neighbor_b + neighbor_a) / 2.0;

		// Check the condition: Edge detected for blur?
                if (Math.abs(original_val - neighbors_avg) > blur_threshold*255) {
                    const filter = BLUR_MATRICES[filter_size];
                    const rows = filter.length;     // s+1
                    const cols = filter[0].length;  // 2s+1
                    const s = filter_size;
                    let blur_estimate = 0.0;

                    // Convolution loop to calculate blur estimate (b)
                    // The current pixel is at M[s][s]. We loop through the filter matrix.
                    for (let fy = 0; fy < rows; fy++) {
                        for (let fx = 0; fx < cols; fx++) {
                            // Calculate image coordinates (ix, iy) relative to current pixel (x, y)
                            // fy-s and fx-s give the offset from the center of the filter (the current pixel).
                            const iy = y + (fy - s); 
                            const ix = x + (fx - s); 

                            // Check bounds: only apply to already processed area
                            // We check for ix, iy within image bounds AND iy < y (above rows) OR (iy == y AND ix < x) (previous pixels on current row)
                            // Since the pre-computed matrix should already have 0s for future pixels, 
                            // we primarily need to ensure we don't read beyond the image boundaries.
                            
                            if (iy >= 0 && iy < height && ix >= 0 && ix < width) {
                                const pixel_index = (iy * width + ix) * 4;
                                
                                // Get the already processed (quantized) value
                                const pixel_value = float_data[pixel_index]; 
                                
                                // Accumulate the weighted value
                                blur_estimate += pixel_value * filter[fy][fx];
                            }
                        }
                    }
                    
                    // Use the blur estimate to compute the error to be diffused
		    err = original_val - blur_estimate;
		    //console.log(`Original value: ${original_val}, Blur Estimate: ${blur_estimate}, Err: ${original_val - quantized_val}, Blur-Err: ${err}`);
		}
	    }

	    // EDGE SWITCH LOGIC
	    if (edge_switch) {
	       // Get the quantized values of the two key neighbors
                let neighbor_b = 0; // Neighbor behind (I(i,j-1))
                let neighbor_a = 0; // Neighbor above (I(i-1,j))

                // Get neighbor behind (j-1, which is x - x_step)
                const behind_x = x - x_step;
                if (behind_x >= 0 && behind_x < width) {
                    neighbor_b = float_data[i - x_step * 4];
                }

		// Get neighbor above (i-1, which is y - 1)
                const above_y = y - 1;
                if (above_y >= 0 && above_y < height) {
                    // index of the pixel directly above (i - width) * 4
                    neighbor_a = float_data[i - width * 4];
                }

		// Calculate the average of the two processed neighbors
                const neighbors_avg = (neighbor_b + neighbor_a) / 2.0;

                // Check the edge condition: | I(i,j) - avg | > threshold
                if (Math.abs(original_val - neighbors_avg) > edge_threshold*255) {
                    // Edge detected: set error to zero to prevent diffusion across the boundary
                    err = 0;
                }
	    }

            // ERROR QUANTIZATION
            if (quantize_error) {
                // The number of discrete steps is 2^Qe
                const steps = Math.pow(2, error_bits); 
                
                // Calculate the size of each step. The full range is 256 (0-255).
                const step_size = 256.0 / steps;
                
                // Quantize the error: round(error / step_size) * step_size
                err = Math.round(err / step_size) * step_size;
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
    
    for (let i = 0; i < data.length; i++) {
        data[i] = float_data[i];
    }
    
    return data;
}

function process_blocks(data, width, height, weights, serpentine, circularweights, permuteweights, randomize_weights, random_weight_factor, ordered_weights, weight_factor, contrast_aware_weights, contrast_aware_weights2, block_size, quantize_error, error_bits, edge_switch, edge_threshold, use_filter_blur, filter_size, blur_threshold) {
    const output_data = new Uint8ClampedArray(data.length);
    
    // Loop through the image in block-sized steps
    for (let y_start = 0; y_start < height; y_start += block_size) {
        for (let x_start = 0; x_start < width; x_start += block_size) {
	    //console.log(`Starting Block at: (${x_start}, ${y_start})`);
            
            // Define the block's dimensions
            const block_width = Math.min(block_size, width - x_start);
            const block_height = Math.min(block_size, height - y_start);
            const block_data_size = block_width * block_height * 4;
            
            // Create a new array for the block's data
            const block_data = new Uint8ClampedArray(block_data_size);
            
            // Extract the data for the current block
            for (let y = 0; y < block_height; y++) {
                for (let x = 0; x < block_width; x++) {
                    const original_index = ((y_start + y) * width + (x_start + x)) * 4;
                    const block_index = (y * block_width + x) * 4;
                    
                    block_data[block_index] = data[original_index];
                    block_data[block_index + 1] = data[original_index + 1];
                    block_data[block_index + 2] = data[original_index + 2];
                    block_data[block_index + 3] = data[original_index + 3];
                }
            }
            
            // Dither the current block
            const dithered_block_data = floyd_steinberg(block_data, block_width, block_height, weights, serpentine, circularweights, permuteweights, randomize_weights, random_weight_factor, ordered_weights, weight_factor, contrast_aware_weights, contrast_aware_weights2, block_size, quantize_error, error_bits, edge_switch, edge_threshold, use_filter_blur, filter_size, blur_threshold);
            
            // Copy the dithered block back to the main output array
            for (let y = 0; y < block_height; y++) {
                for (let x = 0; x < block_width; x++) {
                    const original_index = ((y_start + y) * width + (x_start + x)) * 4;
                    const block_index = (y * block_width + x) * 4;
                    
                    output_data[original_index] = dithered_block_data[block_index];
                    output_data[original_index + 1] = dithered_block_data[block_index + 1];
                    output_data[original_index + 2] = dithered_block_data[block_index + 2];
                    output_data[original_index + 3] = dithered_block_data[block_index + 3];
                }
            }
        }
    }
    
    return output_data;
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

function getNormalRandom(mean = 0, stdDev = 1) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); //Ensures u is not zero
    while (v === 0) v = Math.random(); //Ensures v is not zero

    const z0 = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    // const z1 = Math.sqrt(-2.0 * Math.log(u)) * Math.sin(2.0 * Math.PI * v); // If you need a second independent normal variable

    // Scale and shift to desired mean and standard deviation
    return z0 * stdDev + mean;
}

