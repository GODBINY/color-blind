# Third-party research and implementation notices

Last reviewed: 2026-07-26

Iris performs all image processing in browser-side TypeScript. The current source tree does not bundle, import, or execute code from the research projects listed below. These sources inform the mathematical models and are used for numerical cross-checking and attribution.

## Research models

- Machado, G. M., Oliveira, M. M., & Fernandes, L. A. F. (2009). *A physiologically-based model for simulation of color vision deficiency*. IEEE Transactions on Visualization and Computer Graphics, 15(6), 1291–1298. DOI: [10.1109/TVCG.2009.113](https://doi.org/10.1109/TVCG.2009.113).
  - Used for: Protan/Deutan simulation matrices and severity interpolation.
  - Note: the publication is cited as research; its paper text is not redistributed here. The matrix values in `src/lib/color/machado-matrices.ts` retain the original source attribution.

- Brettel, H., Viénot, F., & Mollon, J. D. (1997). *Computerized simulation of color appearance for dichromats*. Journal of the Optical Society of America A, 14(10), 2647–2655. DOI: [10.1364/JOSAA.14.002647](https://doi.org/10.1364/JOSAA.14.002647).
  - Used for: the independently implemented LMS-plane projection approach for Tritan simulation.

- Fidaner, O., Lin, Y., & Özgüven, F. (2005). *Analysis of Color Blindness*. Stanford Psych 221 project.
  - Used for: the general error-redistribution idea behind the Translate feature.
  - Iris uses its own matrices and implementation; it does not copy source code from this project.

## Reference implementation

- [DaltonLens-Python](https://github.com/DaltonLens/DaltonLens-Python) — MIT License.
  - Used only as a development-time numerical reference for the Brettel/LMS constants. It is not a dependency and none of its source files are distributed by Iris.

## Product and legal boundary

- Iris does not copy or emulate proprietary spectacle/filter transmission curves, and does not claim to replace glasses, lenses, clinical assessment, or treatment.
- Research attribution is not a substitute for a legal review. Before a commercial release, review the embedded Machado matrix table and all dependency notices with counsel for the jurisdictions where Iris is offered.
