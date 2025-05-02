import {makeAutoObservable} from "mobx";
import chroma from "chroma-js";
import {RAINBOWGRADIENT, RAINBOWV2GRADIENT} from "@stores/gradientColors.js";


class GradientStore {

  constructor() {
    makeAutoObservable(this);
  }


  get getRainbowV2Gradient(){
    return RAINBOWV2GRADIENT
  }
 get getRainbowGradient(){
    return RAINBOWGRADIENT
  }


    scaleGradient = (colors, number) =>
        chroma.bezier(colors).scale().mode("oklch").colors(number).join(", ");

    circleGradient = (colors, number, angle, angleTwo) =>
        `radial-gradient(in oklch circle at ${angle}% ${angleTwo}%, ${this.scaleGradient(colors, number)})`;

    linearAngleGradient = (colors, number, angle) =>
        `linear-gradient( ${angle}deg in oklch, ${this.scaleGradient(colors, number)})`;


    linearAngleGradientCubehelix = (start, rotations, gamma, lightnessStart, lightnessEnd, number, angle) =>
        `linear-gradient( ${angle}deg in oklch, ${this.scaleCubehelix(start, rotations, gamma, lightnessStart, lightnessEnd, number)})`;


    scaleCubehelix = (start, rotations, gamma, lightnessStart, lightnessEnd, number) =>
        chroma.cubehelix()
            .start(start)
            .rotations(rotations)
            .gamma(gamma)
            .lightness([lightnessStart, lightnessEnd])
            .scale() // convert to chroma.scale
            .correctLightness()
            .colors(number);

    averageOklch = (colors) => chroma.average(colors, 'oklch')

    chromaSpectral = () => chroma.scale('Spectral').domain([1,0])


    getTheme(theme) {
        return {
            color: theme.c,
            accentColor: theme.c,
            boxShadow: theme.bs,
            background: this.circleGradient(theme.bg[0], theme.bg[1], theme.bg[2], theme.bg[3]),
            navBarButtonBackground: this.circleGradient(theme.nbbb[0], theme.nbbb[1], theme.nbbb[2], theme.nbbb[3]),
            navBarButtonText: theme.nbbt,
            navBarActiveButtonText: theme.nbabt
        }
    }


    get darkCubehelixMode() {
        return {
            color: "oklch(0.99 0 0)",
            accentColor: "oklch(0.71 0.2086 263.9)",
            boxShadow: "2px 1px rgba(0, 150, 150, 0.05)",
            background: this.linearAngleGradientCubehelix(225, 0.2, 0.9, 0.08, 0.1, 32, 125),
            navBarButtonBackground: this.circleGradient(
                [
                    "#101210",
                    "#000001",
                    "#081011",
                    "#010203"
                ],
                12,
                100,
                50,
            ),
            navBarButtonText: [
                "#10CCDD",
                "#4079ff",
                "#99FFFF",
                "#0000ff",
                "#1050CC"
            ],
            navBarActiveButtonText: [
                "#FFFF00",
                "#FFFF99",
                "#CCCCCC",
                "#FFFF00",
                "#FFFFDD"
            ],
        };
    }


    get lightCubehelixMode() {
    return {
        color: "oklch(0.01 0 0)",
        accentColor: "oklch(0.42 0.2086 263.9)",
        boxShadow: "2px 1px rgba(0, 0, 0, 0.15)",
        background: this.linearAngleGradientCubehelix(200, -0.35, 0.3, 0.7, 0.9, 32, 125),
      navBarButtonBackground: this.circleGradient(
          [
            "#f0Daa0",
            "#F9F9DD",
            "#fafa99",
            "#FFFFED"
          ],
          12,
          0,
          250,
      ),
      navBarButtonText: [
        "#000055",
        "#4079ff",
        "#0525FF",
          "#0000ff",
        "#1050CC"
      ],
      navBarActiveButtonText: [
          "#FF5500",
          "#CC5500",
          "#FFEE00",
          "#BB7700",
          "#771100"
      ]
    };

  }






  // Методы для градиентов
    // createGradient(name, colorStops, type = "linear") {
    // this.gradients[name] = {
    //   colorStops,
    //   type,
    //   getCSS: (angle = "90deg") => {
    //     if (type === "linear") {
    //       return `linear-gradient(${angle}, ${colorStops.join(", ")})`;
    //     } else if (type === "radial") {
    //       return `radial-gradient(circle, ${colorStops.join(", ")})`;
    //     }
    //     return "";
    //   },
    // };
    // }

}

export const gradientStore = new GradientStore();
