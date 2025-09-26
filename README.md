# Radomize-Floyd: An Interactive Floyd-Steinberg Dithering

Based on [Dither-dream](https://kgjenkins.github.io/dither-dream/), this is a new tool extending the possibilities to explore variations on the Floyd-Steinberg dithering algorithm.


This project provides an interactive visualization and implementation of the Floyd-Steinberg error diffusion dithering algorithm in JavaScript. Beyond the standard implementation, it offers a suite of advanced controls to experiment with different error distribution strategies, including randomization, ordering, contrast-awareness, and block-based processing.

## 🚀 Live Demo

You can explore the live interface and all its controls [here](https://leolca.github.io/floyd-steinberg-dithering/).

---

# Dithering

Dithering is a technique used in digital imaging to create the illusion of color depth in images with a limited color palette by strategically placing pixels of different colors next to each other.


# What is the Floyd-Steinberg algorithm?

The [Floyd-Steinberg algorithm](https://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering) disperses quantization error to neighboring pixels, minimizing perceptual changes and creating halftone compositions that provide smoother gradients in images with limited colors.

Dithering is particulary useful when converting to a bitonal image that only has two colors (like black and white).  For example, consider this original full-color image (well, the real original was a 17th-century painting, "Vanitas with the Spinario" by the Dutch artist [Pieter Claesz](https://en.wikipedia.org/wiki/Pieter_Claesz)):

![original color image](image/ex1.original.png)

If we convert it to a bitonal black and white based on a threshold luminosity of 50%, we get a result that loses much of the original detail:

![bitonal image using 50% threshold](image/ex1.bitonal.png)

But using Floyd-Steinberg dithering, we can preserve more information about the brightness of the original image.  It's not nearly as detailed as the original, but it does preserve the general brightness for different regions of the image.

![dithered image](image/ex1.dither.7.3.5.1.png)


# How does it work?

The Floyd-Steinberg algorithm is relatively simple.  It scans the image one pixel at a time, scanning the top line from left to right, then the next line, etc. until it reaches the bottom.  For a bitonal dither, it's easier if we first convert the whole image to grayscale, so that each pixel has a luminosity (perceived brightness) value of 0 to 255.

The algorithm examines each pixel in sequence and modifies the pixel value so that darker pixels with values 0-127 (<50%) become 0 (black) and lighter pixels with values 128-255 (>50%) become 255 (white).  For example, a very dark pixel with a value of 16 would become black 0.  Then the "error" is calculated as the difference between the old and new values, which would be 16 in this case.  This error is then distributed across the neighboring pixels that have not yet been scanned, according to the following weights as specified by Floyd and Steinberg:

| x | x | x |
|:-:|:-:|:-:|
| **x** | **@** | 7 |
| 3 | 5 | 1 |

As the scan progresses, in a region of dark (but not completely black) pixels, this error will eventually accumulate enough to have an occasional white pixel.  Part of the beauty of the result is the way that these occasional points are spaced out, sometimes appearing to be random and sometimes with a discernable pattern.

![dithering detail](image/detail.png)


# Results

I was curious why or how the weighting matrix above was calculated.  Floyd-Steinberg is very fast to compute because it only needs to scan once through each pixel.  That is why the error is not distributed to any of the pixels above or to the left in the current row.  But why the 7, 3, 5, 1 weights?  I haven't seen any explanation of why these specific values were chosen, besides the fact that they add up to 16 (so actually we are adding 7/16 of the error to the pixel to the right).

| x | x | x |
|:-:|:-:|:-:|
| **x** | @ | 7/16 |
| 3/16 | 5/16 | 1/16 |

I wanted to experiment with other combinations of weights.  Maybe other values would result in unpleasant or rigid patterns of dots, and 7,3,5,1 was the only way to have a balanced output?  Well, let's try some variations...

Here are several ways to split up the 1/16s across the four available directions:

![7.3.5.1](image/ex1.dither.7.3.5.1.png) 7, 3, 5, 1 (Floyd-Steinberg)

![4,4,4,4](image/ex1.dither.4.4.4.4.png) 4, 4, 4, 4 (equal distribution)

![8,0,8,0](image/ex1.dither.8.0.8.0.png) 8, 0, 8, 0 (right and down only)

![0,8,0,8](image/ex1.dither.0.8.0.8.png) 0, 8, 0, 8 (diagonals only)

![8.8.0.0](image/ex1.dither.8.8.0.0.png) 8, 8, 0, 0 (right and down-left only)

As you can see, some of these combinations tend to create artifacts that distract from the original image.  Floyd and Steinberg probably picked 7,3,5,1 because it tends to have the best results.  But maybe there are other combinations that deliver equally good results.

Now, what if we were to use some negative numbers?  If we use a negative weight for the rightward direction, we'll end up with some long horizontal lines, but since the total error of 16 is still distributed to other pixels, the result still gives a pretty good sense of the general brightness of different regions in the image.

![-4.4.12.4](image/ex1.dither.-4.4.12.4.png) -4, 4, 12, 4

And what if we eliminate the constraint that the total should be 16?  If the total is less than 16, the result will be somewhere between a dither and a naive bitonal (0, 0, 0, 0) image.

![-8.0.4.0](image/ex1.dither.-8.0.4.0.png) -8, 0, 4, 0

![0.8.0.-8](image/ex1.dither.0.8.0.-8.png) 0, 8, 0, -8

If we use even larger negative values, and increase the contrast of the original image, things really start to get interesting.  Here the results can begin to resemble phenomena like the [Sierpinski triangle](https://en.wikipedia.org/wiki/Sierpi%C5%84ski_triangle) and other types of [elementary cellular automata](https://en.wikipedia.org/wiki/Elementary_cellular_automaton#Random_initial_state)

![-17.0.0.-17](image/ex1.dither.-17.0.0.-17.png) -17, 0, 0, -17

Finally, we can create some interesting video effects by animating quickly through a range of values:

![glitching the algorithm](image/glitch.gif)


# ✨ Features and Controls

The interface provides granular control over nearly every aspect of the error diffusion process.

### Image Selection & Base Settings

| Control | Description |
| :--- | :--- |
| **Select an image** | A dropdown menu featuring built-in image options, along with the ability to **upload your own file**. |
| **Use Serpentine Scanning** | Toggles scanning direction. When checked, the scan direction alternates between left-to-right and right-to-left for every row, which helps break up visible dithering patterns. |
| **Block Dithering** | When enabled, the image is partitioned into independent square blocks (`Block Size x Block Size`), and the dithering process is run separately on each block. |
| **Block Size** | A slider to select the size of the blocks (e.g., 8, 16, 32, 64, 128) for Block Dithering. |

### Error Diffusion Weight Controls

These controls modify the weight matrix used to distribute the quantization error to neighboring pixels.

| Control | Description |
| :--- | :--- |
| **Weights (4 Sliders)** | Directly control the values assigned to the four neighbor positions (Right, Down-Left, Down, Down-Right). These values act as the **base weights** or the **maximum limits** for randomization. |
| **Weight Factor** | A multiplier (also known as "forgetfulness") that scales the total error propagated to neighbors. A value less than 1.0 means some error is discarded, often reducing pattern noise at the cost of fidelity. |

#### Dynamic Weight Generation

These options override or modify the base slider weights for dynamic experimentation.

| Control | Description |
| :--- | :--- |
| **Draw Weights from Image** | Derives a weight vector based on the **original image's gray levels**. The weights are proportional to the pixel values under the dithering window. |
| **Draw Weights from Image Diffs** | **Contrast-Aware Dithering**. Derives a weight vector based on the **absolute difference** between the current pixel and its neighbors. Larger differences lead to larger weights, pushing error towards high-contrast areas. |
| **Circular Weights** | Performs a **circular shift** on the weight vector at each pixel, constantly changing which neighbor receives which weight, potentially breaking patterns. |
| **Permute Weights** | The four weight values are **randomly permuted** at each pixel, offering high irregularity. |

#### Randomization and Ordering

| Control | Description |
| :--- | :--- |
| **Use Random Weights** | If checked, the base weights from the sliders (or the derived weights) are treated as **maximum limits**. The actual weight applied to a neighbor is a random value between 0 and the limit. |
| **Ordered** | **(Requires "Use Random Weights" to be enabled)**. If checked, the four randomly generated weights are sorted and assigned in a specific order: largest to Right, second-largest to Down, third-largest to Down-Left, and smallest to Down-Right. |



## 📊 Performance Measures

The interface displays real-time quantitative metrics to evaluate the dithered image against the original (or grayscale) source:

| Measure | Purpose |
| :--- | :--- |
| **Mean Squared Error (MSE)** | Measures the average squared difference between the pixel values of the original and dithered images. Lower is better. |
| **Signal-to-Noise Ratio (SNR)** | Measures the ratio of signal power to noise power. Higher values indicate less noise (error) relative to the image signal. |
| **Peak Signal-to-Noise Ratio (PSNR)** | Measures the ratio between the maximum possible power of a signal and the power of corrupting noise. Higher is better. |
| **Structural Similarity Index (SSIM)** | Measures perceived change in the structural information of the image, based on luminance, contrast, and structure. Closer to 1.0 indicates higher fidelity. |

# Your turn

See the [Randomize-Floyd online demo](https://leolca.github.io/floyd-steinberg-dithering/) to play with the parameters and see the results for yourself!
