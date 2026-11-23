# ImageProcessing

Image processing app in JavaScript: convolution filters, edge detection and hybrid images on the HTML5 canvas.

**[Live demo](https://lakobrija.github.io/ImageProcessing/)**

## Features

Load any image from your computer, optionally select a region with the mouse, and apply a filter. The result appears in a separate canvas, and *Update image* feeds it back so filters can be chained. Without a selection, the whole image is processed.

**Pixel processing**
- Red / green / blue channel, greyscale, negative
- Gamma correction, threshold
- RGB offset sliders

**Kernel processing (3x3 convolution)**
- Box blur, Gaussian blur
- Laplace operator, high pass filter
- Sobel operator (X, Y and combined)
- Median filter
- Sharpening, unsharp masking

**Hybrid images**
- Combines the high frequencies of one image with the blurred low frequencies of another, so you see one image up close and the other from a distance.
- Both images must have the same proportions.

## How it works

- All filters are implemented from scratch on raw pixel data (`getImageData` / `putImageData`), without image processing libraries.
- A single `convolveData` function performs the convolution for all kernel filters.
- Intermediate results are kept in `Float32Array`, so negative and out-of-range values are not clipped before the final step.
- Edge pixels use clamped coordinates, so the image border is processed correctly.
- A hidden clean copy of the image is used as the source, so the selection rectangle never ends up in the result.

## Usage

Open the live demo, or open `index.html` locally. Choose *File → Load image*, pick a filter from the menus and compare the result on the right.

For a hybrid image: load the first image, then *Transformation → Load second image* and *Hybrid image*.

## Tech

JavaScript, HTML5, CSS, Bootstrap and jQuery (UI and mouse events only).
