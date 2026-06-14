import Foundation
import ImageIO
import UniformTypeIdentifiers

if CommandLine.arguments.count < 3 {
    fputs("Usage: convert-heic input output\n", stderr)
    exit(2)
}

let input = URL(fileURLWithPath: CommandLine.arguments[1])
let output = URL(fileURLWithPath: CommandLine.arguments[2])

guard let source = CGImageSourceCreateWithURL(input as CFURL, nil),
      let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
    fputs("Could not read image: \(input.path)\n", stderr)
    exit(1)
}

let options: [CFString: Any] = [
    kCGImageDestinationLossyCompressionQuality: 0.9
]

guard let destination = CGImageDestinationCreateWithURL(output as CFURL, UTType.jpeg.identifier as CFString, 1, nil) else {
    fputs("Could not create output: \(output.path)\n", stderr)
    exit(1)
}

CGImageDestinationAddImage(destination, image, options as CFDictionary)

if !CGImageDestinationFinalize(destination) {
    fputs("Could not finalize output: \(output.path)\n", stderr)
    exit(1)
}
