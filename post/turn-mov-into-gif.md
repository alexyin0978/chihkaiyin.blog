---
title: "Turn .mov into GIF using ffmpeg and imagemagick"
subtitle: "Turn the .mov file into a .gif file using ffmpeg and imagemagick"
date: "2023-10-18"
tag: "movie,gif,bash,imagemagick,ffmpeg"
---

This article is about how to turn the `.mov` file recorded using Mac into a `.gif` file using ffmpeg and imagemagick.

## Installation

We are going to install two script packages: `ffmpeg` and `imagemagick` .

`ffmpeg` enables us to convert a `.mov` file into frames of image files.

`imagemagick` enables us to select images and turn them into a `.gif` file.

I am using Mac, so I am going to use `brew install` to install the above packages.

```bash
$ brew install ffmpeg
$ brew install imagemagick
```

## Convert .mov into frames of images

Now we can start the conversion.

Select a `.mov` file, and convert it into frames of `.png` files.

Specify where the output images should go, in this example, I am going to put them into a directory called `output` , while the images will be named `output_%3d.png` , by assigning `%3d`, I am telling `ffmpeg` to give my output images index, eg: `output_001.png` , `output_002.png` …etc.

```bash
# syntax
$ ffmpeg -i [INPUT_FILE.mov] -vf "fps=[ASSIGN_A_INTEGER_HERE]" ./output/[OUTPUT_FILE_NAME_%3d.[FILE_EXTENSION]]

```

In the above script, `-i` infers to “input file”, `-vf` infers to “video frame” and `fps` infers to “frame per second”. 

```bash
# example
$ ffmpeg -i movie.mov -vf "fps=15" ./output/output_%3d.png
```

So, in the above example, the `fps` is 15, while the movie file is 5 seconds long, the output images count should be 15*5 = 75 frames in total.

## Convert images into GIF

Select all the images in the directory, use Imagemagick to turn them into a GIF.

```bash
# syntax
$ convert -delay 10 -loop 0 ./output/[TARGET_FILES].[FILE_EXTENSION] ./output/result.gif
```

In the above script, the `-deley` specifies how many milliseconds a frame should display, while the `-loop` specifies how many times the GIF should loop, 0 means forever.

```bash
# example
$ convert -delay 10 -loop 0 ./output/output*.png ./output/result.gif
```

Now the GIF should be successfully created!

### Reference

- **[Creating a .GIF using QuickTime, ffmpeg and Imagemagick #TIL](https://medium.com/@evidanary/creating-a-gif-using-quicktime-ffmpeg-and-imagemagick-til-a8601fcf1f70)**